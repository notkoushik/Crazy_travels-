import { useState, useEffect } from 'react'
import {
  DestinationItem,
  PackageItem,
  StayItem,
  RoadTripItem,
  StoryItem,
  OfferItem,
  BookingSubmission,
  InquirySubmission,
} from '../types/travel'

const EVENT_NAME = 'crazy_tours_store_updated'

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
  bookings: [],
  inquiries: [],
  stats: {
    totalRevenueINR: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    newInquiries: 0,
    activeDestinations: 0,
    activeTravelers: 0,
    monthlyGrowth: 0,
  },
  isLoading: true,
  isDatabaseConnected: false,
  lastSyncedAt: null,
}

let currentStore: DynamicStoreState = { ...emptyInitialState }

function notifyListeners() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: currentStore }))
}

// ========================================================
// CORE API CLIENT - DIRECT POSTGRESQL FETCH & MUTATIONS
// ========================================================

export const dataStore = {
  getState: (): DynamicStoreState => currentStore,

  // Fetch all tables directly from PostgreSQL 18
  fetchInitialData: async () => {
    try {
      currentStore = { ...currentStore, isLoading: true }
      notifyListeners()

      const [
        destinationsRes,
        packagesRes,
        staysRes,
        roadTripsRes,
        storiesRes,
        offersRes,
        heroSlidesRes,
        bookingsRes,
        inquiriesRes,
        statsRes,
      ] = await Promise.all([
        fetch('/api/destinations').then((r) => r.json()),
        fetch('/api/packages').then((r) => r.json()),
        fetch('/api/stays').then((r) => r.json()),
        fetch('/api/road-trips').then((r) => r.json()),
        fetch('/api/stories').then((r) => r.json()),
        fetch('/api/offers').then((r) => r.json()),
        fetch('/api/hero-slides').then((r) => r.json()),
        fetch('/api/bookings').then((r) => r.json()),
        fetch('/api/inquiries').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ])

      currentStore = {
        destinations: Array.isArray(destinationsRes) ? destinationsRes : [],
        packages: Array.isArray(packagesRes) ? packagesRes : [],
        stays: Array.isArray(staysRes) ? staysRes : [],
        roadTrips: Array.isArray(roadTripsRes) ? roadTripsRes : [],
        stories: Array.isArray(storiesRes) ? storiesRes : [],
        offers: Array.isArray(offersRes) ? offersRes : [],
        heroSlides: Array.isArray(heroSlidesRes) ? heroSlidesRes : [],
        bookings: Array.isArray(bookingsRes) ? bookingsRes : [],
        inquiries: Array.isArray(inquiriesRes) ? inquiriesRes : [],
        stats: statsRes?.totalRevenueINR !== undefined ? statsRes : currentStore.stats,
        isLoading: false,
        isDatabaseConnected: true,
        lastSyncedAt: new Date().toISOString(),
      }
      notifyListeners()
      return currentStore
    } catch (err) {
      console.error('Failed fetching data from PostgreSQL API:', err)
      currentStore = {
        ...currentStore,
        isLoading: false,
        isDatabaseConnected: false,
      }
      notifyListeners()
      throw err
    }
  },

  // 1. Destinations (Rajasthan Fort Window & Catalog)
  saveDestination: async (destination: DestinationItem) => {
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination),
      })
      if (!res.ok) throw new Error('Failed to save destination to PostgreSQL')
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
      })
      if (!res.ok) throw new Error('Failed to delete destination from PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteDestination:', err)
      throw err
    }
  },

  // 2. Packages & Itineraries
  savePackage: async (pkg: PackageItem) => {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg),
      })
      if (!res.ok) throw new Error('Failed to save package to PostgreSQL')
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
      })
      if (!res.ok) throw new Error('Failed to delete package from PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deletePackage:', err)
      throw err
    }
  },

  // 3. Customer Bookings
  addBooking: async (booking: BookingSubmission) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error('Failed to record booking in PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in addBooking:', err)
      throw err
    }
  },

  updateBookingStatus: async (
    bookingId: string,
    status: BookingSubmission['status'],
    paymentStatus?: BookingSubmission['paymentStatus']
  ) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      })
      if (!res.ok) throw new Error('Failed to update booking in PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in updateBookingStatus:', err)
      throw err
    }
  },

  deleteBooking: async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete booking from PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteBooking:', err)
      throw err
    }
  },

  // 4. Custom Trip Inquiries (CRM Leads)
  addInquiry: async (inquiry: InquirySubmission) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      })
      if (!res.ok) throw new Error('Failed to record inquiry in PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in addInquiry:', err)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedAgent }),
      })
      if (!res.ok) throw new Error('Failed to update inquiry status in PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in updateInquiryStatus:', err)
      throw err
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete inquiry from PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteInquiry:', err)
      throw err
    }
  },

  // 5. Stays & Haveli Management
  saveStay: async (stay: StayItem) => {
    try {
      const res = await fetch('/api/stays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stay),
      })
      if (!res.ok) throw new Error('Failed to save stay in PostgreSQL')
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
      })
      if (!res.ok) throw new Error('Failed to delete stay from PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteStay:', err)
      throw err
    }
  },

  // 6. Offers & Promotions Management
  saveOffer: async (offer: OfferItem) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      })
      if (!res.ok) throw new Error('Failed to save offer in PostgreSQL')
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
      })
      if (!res.ok) throw new Error('Failed to delete offer from PostgreSQL')
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in deleteOffer:', err)
      throw err
    }
  },

  // Refresh helper
  refresh: async () => {
    return await dataStore.fetchInitialData()
  },
}

// Automatically trigger initial load from PostgreSQL on script evaluation
if (typeof window !== 'undefined') {
  dataStore.fetchInitialData().catch((err) => {
    console.warn('Initial PostgreSQL fetch waiting for network or server boot:', err)
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

    // Ensure we trigger a fetch if still empty
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
