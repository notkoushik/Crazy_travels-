import { useState, useEffect } from 'react'
import {
  DestinationItem,
  PackageItem,
  StayItem,
  RoadTripItem,
  StoryItem,
  OfferItem,
  InstagramReelItem,
  ReviewItem,
  BookingSubmission,
  InquirySubmission,
} from '../types/travel'
import {
  nationalDestinations,
  allPackages,
  hotelStays,
  roadTrips,
  stories as defaultStories,
  offers as defaultOffers,
  heroSlides as defaultHeroSlides,
  instagramReels as defaultReels,
  reviews as defaultReviews,
} from '../data/travelData'

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

export interface SpecialItem {
  id: string
  slotIndex: number
  badge: string
  title: string
  description: string
  priceNum?: number
  image: string
  actionRoute: string
  actionLabel: string
}

export interface BoardFeatureItem {
  id: string
  kicker: string
  sectionTitle: string
  partnerBadge: string
  headline: string
  description: string
  image: string
  actionRoute: string
  actionLabel: string
}

export interface BrandPillarItem {
  id: string
  stepNumber: string
  title: string
  description: string
  displayOrder: number
  stageImage?: string
}

export interface TrustStatsItem {
  id: string
  stat1Value: string
  stat1Label: string
  stat2Value: string
  stat2Label: string
  stat3Value: string
  stat3Label: string
  stat4Value: string
  stat4Label: string
}

export interface SectionHeaderItem {
  kicker?: string
  title: string
  subtitle?: string
}

export interface StorefrontConfig {
  specials: SpecialItem[]
  boardFeature: BoardFeatureItem | null
  brandPillars: BrandPillarItem[]
  trustStats: TrustStatsItem | null
  sectionHeaders: Record<string, SectionHeaderItem>
}

export const defaultStorefrontConfig: StorefrontConfig = {
  specials: [
    {
      id: 'special-1',
      slotIndex: 1,
      badge: 'April departures · Limited season',
      title: 'Kashmir in full bloom',
      description: '6 days of tulip gardens, houseboat evenings and mountain air.',
      priceNum: 36800,
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=88',
      actionRoute: 'destination/srinagar',
      actionLabel: 'See the journey',
    },
    {
      id: 'special-2',
      slotIndex: 2,
      badge: 'September departures',
      title: 'High roads of Ladakh',
      description: 'Monasteries, mountain passes and nights beneath a spectacular sky.',
      priceNum: 42000,
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=88',
      actionRoute: 'road-trips',
      actionLabel: 'Explore the route',
    },
    {
      id: 'special-3',
      slotIndex: 3,
      badge: 'Monsoon in Kerala',
      title: 'Monsoon in Kerala',
      description: 'Tea-country mist, restorative stays and slow backwater days.',
      priceNum: 28500,
      image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=700&q=85',
      actionRoute: 'destination/munnar',
      actionLabel: 'Build your itinerary',
    },
    {
      id: 'special-4',
      slotIndex: 4,
      badge: 'Rajasthan by road',
      title: 'Rajasthan by road',
      description: 'Palace stays, craft towns and golden desert evenings.',
      priceNum: 31000,
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=85',
      actionRoute: 'road-trips',
      actionLabel: 'See road trips',
    },
  ],
  boardFeature: {
    id: 'main-board-feature',
    kicker: 'Selected with local experts',
    sectionTitle: 'Travel boards recommend',
    partnerBadge: 'In partnership with local storytellers',
    headline: 'Hampi, beyond the monuments',
    description: 'Riverside walks, ancient stories and boulder-lit sunsets—discover Karnataka at a gentler pace.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=88',
    actionRoute: 'destination/hampi',
    actionLabel: 'Explore Hampi',
  },
  brandPillars: [
    {
      id: 'pillar-1',
      stepNumber: '01',
      title: 'Human expertise',
      description: 'Real travel designers who listen before they plan. No auto-generated templates.',
      displayOrder: 1,
      stageImage: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
    },
    {
      id: 'pillar-2',
      stepNumber: '02',
      title: 'Built around you',
      description: 'Your pace, preferences and non-negotiables come first.',
      displayOrder: 2,
      stageImage: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
    },
    {
      id: 'pillar-3',
      stepNumber: '03',
      title: 'Here when needed',
      description: 'Reliable 24/7 on-trip concierge support from first departure to your return home.',
      displayOrder: 3,
      stageImage: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
    },
    {
      id: 'pillar-4',
      stepNumber: '04',
      title: 'Clear and considered',
      description: 'Certified heritage properties and transparent trip pricing with zero hidden fees.',
      displayOrder: 4,
      stageImage: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85',
    },
  ],
  trustStats: {
    id: 'main-trust-stats',
    stat1Value: '18',
    stat1Label: 'years exploring',
    stat2Value: '28',
    stat2Label: 'states explored',
    stat3Value: '24k',
    stat3Label: 'journeys planned',
    stat4Value: '4.9',
    stat4Label: 'average traveller rating',
  },
  sectionHeaders: {
    trending: {
      kicker: 'India, beautifully explored',
      title: 'Trending destinations',
      subtitle: 'Six remarkable places curated for immersive discovery. Each one designed as a deep journey, not a tourist checklist.',
    },
    specials: {
      kicker: 'Limited seasonal departures',
      title: 'Crazy Specials & Offers',
      subtitle: 'Handcrafted seasonal breaks with exclusive benefits and private local hosts.',
    },
    soul: {
      kicker: 'Made to linger',
      title: 'Journeys with a little more soul',
      subtitle: 'Signature departures celebrating unhurried discovery and living heritage.',
    },
    board: {
      kicker: 'Selected with local experts',
      title: 'Travel boards recommend',
      subtitle: 'Curated stories and architectural journeys handpicked by regional explorers.',
    },
    stays: {
      kicker: 'Stay somewhere memorable',
      title: 'Explore boutique hotel stays',
      subtitle: 'Heritage havelis, luxury houseboats, and serene plantation estates.',
    },
    pillars: {
      kicker: 'Why travel with Crazy Tours Travel',
      title: 'Expertly planned. Genuinely personal.',
      subtitle: 'The craft behind each journey.',
    },
    stats: {
      kicker: 'The Crazy Tours Travel difference',
      title: 'Why travellers return to us',
      subtitle: 'Decades of authentic travel design across India.',
    },
  },
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
  destinationsLoaded: boolean
  packagesLoaded: boolean
  stays: StayItem[]
  roadTrips: RoadTripItem[]
  stories: StoryItem[]
  offers: OfferItem[]
  heroSlides: HeroSlideItem[]
  reels: InstagramReelItem[]
  reviews: ReviewItem[]
  storefront: StorefrontConfig
  bookings: BookingSubmission[]
  inquiries: InquirySubmission[]
  stats: DynamicStoreStats
  isLoading: boolean
  isDatabaseConnected: boolean
  lastSyncedAt: string | null
}

const emptyInitialState: DynamicStoreState = {
  destinations: nationalDestinations,
  packages: allPackages,
  destinationsLoaded: true,
  packagesLoaded: true,
  stays: hotelStays,
  roadTrips: roadTrips,
  stories: defaultStories,
  offers: defaultOffers,
  heroSlides: defaultHeroSlides,
  reels: defaultReels,
  reviews: defaultReviews,
  storefront: defaultStorefrontConfig,
  bookings: [],
  inquiries: [],
  stats: {
    totalRevenueINR: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    newInquiries: 0,
    activeDestinations: 6,
    activeTravelers: 38,
    monthlyGrowth: 28.4,
  },
  isLoading: false,
  isDatabaseConnected: false,
  lastSyncedAt: null,
}

let currentStore: DynamicStoreState = { ...emptyInitialState }
let catalogRequest = 0

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

async function fetchCatalogCollection<T>(path: string): Promise<T[] | null> {
  try {
    const response = await fetch(path)
    const data = response.ok ? await response.json() : null
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
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
    const request = ++catalogRequest
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
        reviewsRes,
        storefrontRes,
      ] = await Promise.all([
        fetchCatalogCollection<DestinationItem>('/api/destinations'),
        fetchCatalogCollection<PackageItem>('/api/packages'),
        fetchCatalogCollection<StayItem>('/api/stays'),
        fetchCatalogCollection<RoadTripItem>('/api/road-trips'),
        fetchCatalogCollection<StoryItem>('/api/stories'),
        fetchCatalogCollection<OfferItem>('/api/offers'),
        fetchCatalogCollection<HeroSlideItem>('/api/hero-slides'),
        fetchCatalogCollection<InstagramReelItem>('/api/reels'),
        fetchCatalogCollection<ReviewItem>('/api/reviews'),
        fetch('/api/storefront-config').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ])

      if (request !== catalogRequest) return currentStore
      currentStore = {
        ...currentStore,
        destinations: destinationsRes ?? currentStore.destinations,
        packages: packagesRes ?? currentStore.packages,
        destinationsLoaded: currentStore.destinationsLoaded || destinationsRes !== null,
        packagesLoaded: currentStore.packagesLoaded || packagesRes !== null,
        stays: staysRes ?? currentStore.stays,
        roadTrips: roadTripsRes ?? currentStore.roadTrips,
        stories: storiesRes ?? currentStore.stories,
        offers: offersRes ?? currentStore.offers,
        heroSlides: heroSlidesRes ?? currentStore.heroSlides,
        reels: reelsRes ?? currentStore.reels,
        reviews: reviewsRes ?? currentStore.reviews,
        storefront: storefrontRes?.specials ? storefrontRes : currentStore.storefront,
        isLoading: false,
        isDatabaseConnected: [destinationsRes, packagesRes, staysRes, roadTripsRes, storiesRes, offersRes, heroSlidesRes, reelsRes, storefrontRes].some((collection) => collection !== null),
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
      if (request !== catalogRequest) return currentStore
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
        throw new Error(errData.error || errData.message || 'We could not send your request. Please try again.')
      }
      const data = await res.json()
      if (typeof data?.bookingId !== 'string' || !data.bookingId)
        throw new Error('We could not verify that your request was received. Please try again.')
      if (dataStore.isAdminAuthenticated()) {
        void dataStore.fetchAdminData().catch(console.error)
      }
      return data.bookingId as string
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
        throw new Error(errData.error || errData.message || 'Failed to record inquiry')
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
      if (!res.ok) {
        const failure = await res.json().catch(() => ({}))
        throw new Error(failure.error || 'Could not save the reel.')
      }
      await dataStore.fetchInitialData()
    } catch (err) {
      console.error('Error in saveReel:', err)
      throw err
    }
  },

  deleteReel: async (id: string) => {
    const res = await fetch(`/api/reels/${encodeURIComponent(id)}`, { method: 'DELETE', headers: getAdminHeaders() })
    if (!res.ok) throw new Error('Could not delete the reel.')
    currentStore = { ...currentStore, reels: currentStore.reels.filter((reel) => reel.id !== id) }
    notifyListeners()
  },

  saveSpecial: async (slotIndex: number, updates: Partial<SpecialItem>) => {
    const res = await fetch(`/api/storefront/specials/${slotIndex}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('Failed to update special offer')
    await dataStore.fetchInitialData()
  },

  saveBoardFeature: async (updates: Partial<BoardFeatureItem>) => {
    const res = await fetch('/api/storefront/board-feature', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('Failed to update board feature')
    await dataStore.fetchInitialData()
  },

  saveBrandPillars: async (stageImage: string, pillars: BrandPillarItem[]) => {
    const res = await fetch('/api/storefront/brand-pillars', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ stageImage, pillars }),
    })
    if (!res.ok) throw new Error('Failed to update brand pillars')
    await dataStore.fetchInitialData()
  },

  saveTrustStats: async (updates: Partial<TrustStatsItem>) => {
    const res = await fetch('/api/storefront/trust-stats', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('Failed to update trust statistics')
    await dataStore.fetchInitialData()
  },

  saveSectionHeader: async (sectionKey: string, header: SectionHeaderItem) => {
    const res = await fetch(`/api/storefront/section-headers/${encodeURIComponent(sectionKey)}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(header),
    })
    if (!res.ok) throw new Error('Failed to update section header')
    await dataStore.fetchInitialData()
  },

  saveCuratedSelection: async (curations: {
    trendingDestinations?: Array<{ slug: string; isTrending: boolean; displayOrder: number }>
    soulfulPackages?: Array<{ id: string; featured: boolean; homeSpotlightOrder: number }>
    featuredStays?: Array<{ id: string; isHomeFeatured: boolean; homeDisplayOrder: number }>
  }) => {
    const res = await fetch('/api/storefront/curated-selection', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(curations),
    })
    if (!res.ok) throw new Error('Failed to update curated selection')
    await dataStore.fetchInitialData()
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
