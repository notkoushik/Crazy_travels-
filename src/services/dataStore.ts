import { useState, useEffect } from 'react'
import {
  DestinationItem,
  PackageItem,
  StayItem,
  RoadTripItem,
  StoryItem,
  OfferItem,
  InstagramReelItem,
  BookingSubmission,
  InquirySubmission,
} from '../types/travel'
import { instagramReels as fallbackReels } from '../data/travelData'

const EVENT_NAME = 'crazy_tours_store_updated'
const ADMIN_TOKEN_KEY = 'crazy_tours_admin_token'

export interface HeroSlideItem {
  image: string
  eyebrow: string
  title: string
  copy: string
  location: string
  actionRoute: string
}

export interface DynamicStoreStats {
  totalRevenueINR: number
  totalBookings: number
  confirmedBookings: number
  totalInquiries: number
  newInquiries: number
  activeDestinations: number
  activeTravelers: number
  monthlyGrowth: number
}

export interface DynamicStoreState {
  destinations: DestinationItem[]
  packages: PackageItem[]
  stays: StayItem[]
  roadTrips: RoadTripItem[]
  stories: StoryItem[]
  offers: OfferItem[]
  heroSlides: HeroSlideItem[]
  reels: InstagramReelItem[]
  bookings: BookingSubmission[]
  inquiries: InquirySubmission[]
  stats: DynamicStoreStats
  isLoading: boolean
  isDatabaseConnected: boolean
  lastSyncedAt: string | null
}

const emptyInitialState: DynamicStoreState = {
  destinations: [],
  packages: [],
  stays: [],
  roadTrips: [],
  stories: [],
  offers: [],
  heroSlides: [],
  reels: fallbackReels,
  bookings: [],
  inquiries: [],
  stats: {
    totalRevenueINR: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    newInquiries: 0,
    activeDestinations: 0,
    activeTravelers: 38,
    monthlyGrowth: 28.4,
  },
  isLoading: true,
  isDatabaseConnected: false,
  lastSyncedAt: null,
}

let currentStore: DynamicStoreState = { ...emptyInitialState }

function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: currentStore }))
  }
}

// Helper: Secure Admin Headers
export function getAdminAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getAdminHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', ...getAdminAuthHeaders() }
}

// ========================================================
// CORE API CLIENT - PRIVACY-FIRST ZERO-TRUST ARCHITECTURE
// ========================================================

export const dataStore = {
  getState: (): DynamicStoreState => currentStore,

  // ------------------------------------------------------
  // 1. PUBLIC CATALOG FETCH (Strictly Zero PII)
  // ------------------------------------------------------
  fetchInitialData: async () => {
    try {
      currentStore = { ...currentStore, isLoading: true }
      notifyListeners()

      // Fetch only public catalog data. Never fetch bookings or customer inquiries here.
      const [
        destinationsRes,
        packagesRes,
        staysRes,
        roadTripsRes,
        storiesRes,
        offersRes,
        heroSlidesRes,
        reelsRes,
      ] = await Promise.all([
        fetch('/api/destinations').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/packages').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/stays').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/road-trips').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/stories').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/offers').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/hero-slides').then((r) => (r.ok ? r.json() : [])),
        fetch('/api/reels').then((r) => (r.ok ? r.json() : fallbackReels)).catch(() => fallbackReels),
      ])

      currentStore = {
        ...currentStore,
        destinations: Array.isArray(destinationsRes) ? destinationsRes : [],
        packages: Array.isArray(packagesRes) ? packagesRes : [],
        stays: Array.isArray(staysRes) ? staysRes : [],
        roadTrips: Array.isArray(roadTripsRes) ? roadTripsRes : [],
        stories: Array.isArray(storiesRes) ? storiesRes : [],
        offers: Array.isArray(offersRes) ? offersRes : [],
        heroSlides: Array.isArray(heroSlidesRes) ? heroSlidesRes : [],
        reels: Array.isArray(reelsRes) && reelsRes.length > 0 ? reelsRes : fallbackReels,
        isLoading: false,
        isDatabaseConnected: true,
        lastSyncedAt: new Date().toISOString(),
      }
      notifyListeners()

      // If already logged in as Admin, also hydrate admin customer records
      if (dataStore.isAdminAuthenticated()) {
        dataStore.fetchAdminData().catch((err) => {
          console.warn('Admin background data sync waiting for session refresh:', err)
        })
      }

      return currentStore
    } catch (err) {
      console.error('Failed fetching catalog from API:', err)
      currentStore = {
        ...currentStore,
        isLoading: false,
        isDatabaseConnected: false,
      }
      notifyListeners()
      throw err
    }
  },

  // ------------------------------------------------------
  // 2. ADMIN AUTHENTICATION & RESTRICTED PII ACCESS
  // ------------------------------------------------------
  isAdminAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) return false
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return false
      const payload = JSON.parse(atob(parts[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },

  adminLogin: async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Invalid admin credentials')
      }
      const data = await res.json()
      if (data.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token)
        await dataStore.fetchAdminData()
        return true
      }
      return false
    } catch (err) {
      console.error('Admin authentication failure:', err)
      throw err
    }
  },

  adminLogout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    }
    // Wipe all sensitive customer records from browser memory immediately
    currentStore = {
      ...currentStore,
      bookings: [],
      inquiries: [],
      stats: emptyInitialState.stats,
    }
    notifyListeners()
  },

  fetchAdminData: async () => {
    if (!dataStore.isAdminAuthenticated()) return currentStore
    try {
      const headers = getAdminHeaders()
      const [bookingsRes, inquiriesRes, statsRes] = await Promise.all([
        fetch('/api/bookings', { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch('/api/inquiries', { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch('/api/stats', { headers }).then((r) => (r.ok ? r.json() : currentStore.stats)),
      ])

      currentStore = {
        ...currentStore,
        bookings: Array.isArray(bookingsRes) ? bookingsRes : [],
        inquiries: Array.isArray(inquiriesRes) ? inquiriesRes : [],
        stats: statsRes?.totalRevenueINR !== undefined ? statsRes : currentStore.stats,
        lastSyncedAt: new Date().toISOString(),
      }
      notifyListeners()
      return currentStore
    } catch (err) {
      console.error('Failed fetching admin customer data:', err)
      throw err
    }
  },

  // ------------------------------------------------------
  // 3. TRAVELER SELF-SERVICE PRIVACY-SAFE LOOKUP
  // ------------------------------------------------------
  lookupBooking: async (bookingId: string, phone: string) => {
    try {
      const res = await fetch('/api/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'No reservation matching these credentials was found.')
      }
      return data.booking
    } catch (err) {
      console.error('Booking lookup error:', err)
      throw err
    }
  },

  // ------------------------------------------------------
  // 4. PUBLIC SUBMISSIONS (Write-Only by Customers)
  // ------------------------------------------------------
  addBooking: async (booking: BookingSubmission) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to submit booking')
      }
      // If admin is browsing, sync admin records
      if (dataStore.isAdminAuthenticated()) {
        await dataStore.fetchAdminData()
      }
    } catch (err) {
      console.error('Error submitting booking:', err)
      throw err
    }
  },

  addInquiry: async (inquiry: InquirySubmission) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to record inquiry')
      }
      if (dataStore.isAdminAuthenticated()) {
        await dataStore.fetchAdminData()
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      throw err
    }
  },

  // ------------------------------------------------------
  // 5. RESTRICTED ADMIN MUTATIONS
  // ------------------------------------------------------
  updateBookingStatus: async (
    bookingId: string,
    status: BookingSubmission['status'],
    paymentStatus?: BookingSubmission['paymentStatus']
  ) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, paymentStatus }),
      })
      if (!res.ok) throw new Error('Failed to update booking status')
      await dataStore.fetchAdminData()
    } catch (err) {
      console.error('Error in updateBookingStatus:', err)
      throw err
    }
  },

  deleteBooking: async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete booking')
      await dataStore.fetchAdminData()
    } catch (err) {
      console.error('Error in deleteBooking:', err)
      throw err
    }
  },

  updateInquiryStatus: async (
    id: string,
    status: InquirySubmission['status'],
    assignedAgent?: string
  ) => {
    try {
      const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, assignedAgent }),
      })
      if (!res.ok) throw new Error('Failed to update inquiry status')
      await dataStore.fetchAdminData()
    } catch (err) {
      console.error('Error in updateInquiryStatus:', err)
      throw err
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete inquiry')
      await dataStore.fetchAdminData()
    } catch (err) {
      console.error('Error in deleteInquiry:', err)
      throw err
    }
  },

  saveDestination: async (destination: DestinationItem) => {
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(destination),
      })
      if (!res.ok) throw new Error('Failed to save destination')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in saveDestination:', err)
      throw err
    }
  },

  deleteDestination: async (slug: string) => {
    try {
      const res = await fetch(`/api/destinations/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete destination')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteDestination:', err)
      throw err
    }
  },

  savePackage: async (pkg: PackageItem) => {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(pkg),
      })
      if (!res.ok) throw new Error('Failed to save package')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in savePackage:', err)
      throw err
    }
  },

  deletePackage: async (id: string) => {
    try {
      const res = await fetch(`/api/packages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete package')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deletePackage:', err)
      throw err
    }
  },

  saveStay: async (stay: StayItem) => {
    try {
      const res = await fetch('/api/stays', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(stay),
      })
      if (!res.ok) throw new Error('Failed to save stay')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in saveStay:', err)
      throw err
    }
  },

  deleteStay: async (id: string) => {
    try {
      const res = await fetch(`/api/stays/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete stay')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteStay:', err)
      throw err
    }
  },

  saveOffer: async (offer: OfferItem) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(offer),
      })
      if (!res.ok) throw new Error('Failed to save offer')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in saveOffer:', err)
      throw err
    }
  },

  deleteOffer: async (id: string) => {
    try {
      const res = await fetch(`/api/offers/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete offer')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteOffer:', err)
      throw err
    }
  },

  updateReel: async (id: string, updates: Partial<InstagramReelItem>) => {
    try {
      const res = await fetch(`/api/reels/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update Instagram reel')
      const data = await res.json()
      if (data.reel) {
        currentStore = {
          ...currentStore,
          reels: currentStore.reels.map((r) => (r.id === id ? data.reel : r)),
        }
        notifyListeners()
      }
      return data.reel
    } catch (err) {
      console.error('Error in updateReel:', err)
      throw err
    }
  },

  saveReel: async (reel: InstagramReelItem) => {
    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(reel),
      })
      if (!res.ok) throw new Error('Failed to save Instagram reel')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in saveReel:', err)
      throw err
    }
  },

  refresh: async () => {
    await dataStore.fetchInitialData()
    if (dataStore.isAdminAuthenticated()) {
      await dataStore.fetchAdminData()
    }
    return currentStore
  },
}

// Initial public catalog load on script evaluation
if (typeof window !== 'undefined') {
  dataStore.fetchInitialData().catch((err) => {
    console.warn('Initial catalog fetch waiting for network or server boot:', err)
  })
}

// React Hook for live reactivity
export function useDynamicStore() {
  const [state, setState] = useState<DynamicStoreState>(currentStore)

  useEffect(() => {
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent<DynamicStoreState>
      setState(customEvent.detail)
    }
    window.addEventListener(EVENT_NAME, listener)

    if (currentStore.destinations.length === 0 && !currentStore.isDatabaseConnected) {
      dataStore.fetchInitialData().catch(console.error)
    }

    return () => window.removeEventListener(EVENT_NAME, listener)
  }, [])

  return {
    ...state,
    ...dataStore,
  }
}
