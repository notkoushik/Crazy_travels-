import { useState, useEffect } from 'react'
import {
  DestinationCustomizationStop,
  DestinationItem,
  PackageCategory,
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
      badge: '3D/2N · 4D/3N · 5D/4N departures',
      title: 'Manali, Solang & Atal Tunnel',
      description: 'Snow points, Hidimba Temple, Mall Road and Kullu Valley with private cab & 24/7 Telugu support.',
      priceNum: 6999,
      image: '/Video/optimized/destination_himachal_poster.jpg',
      actionRoute: 'destination/manali',
      actionLabel: 'See the journey',
    },
    {
      id: 'special-2',
      slotIndex: 2,
      badge: 'Parvati riverside stays',
      title: 'Kasol & Manikaran Hot Springs',
      description: 'Riverside camps, Kasol cafés, and Manikaran Sahib paired seamlessly with Manali.',
      priceNum: 8499,
      image: '/Video/optimized/destination_kinnaur_poster.jpg',
      actionRoute: 'destination/kasol',
      actionLabel: 'Explore Kasol',
    },
    {
      id: 'special-3',
      slotIndex: 3,
      badge: 'Delhi to Delhi private cab',
      title: 'Shimla, Kufri & Manali Circuit',
      description: 'The Ridge, Christ Church, Jakhu Temple, Pandoh Dam and Solang snow peaks in one trip.',
      priceNum: 10999,
      image: '/Video/optimized/destination_adventure_poster.jpg',
      actionRoute: 'destination/shimla',
      actionLabel: 'Explore Shimla',
    },
    {
      id: 'special-4',
      slotIndex: 4,
      badge: 'All 18 Himachal itineraries',
      title: 'Compare Couple, Family & Squad Plans',
      description: 'Browse all 3D/2N, 4D/3N & 5D/4N packages and customize add-on stops directly on your route.',
      priceNum: 6999,
      image: '/Video/optimized/destination_kedarnath_poster.jpg',
      actionRoute: 'packages',
      actionLabel: 'View all packages',
    },
  ],
  boardFeature: {
    id: 'main-board-feature',
    kicker: 'Selected with local experts',
    sectionTitle: 'Travel boards recommend',
    partnerBadge: 'Himachal Signature Circuit',
    headline: 'Manali, Kasol & Shimla — built around your pace',
    description: 'Start from any verified 3D/2N, 4D/3N, or 5D/4N route and add stops like Dharamshala, Dalhousie, Tosh, or Amritsar right on your itinerary.',
    image: '/Video/optimized/destination_himachal_poster.jpg',
    actionRoute: 'destination/manali',
    actionLabel: 'Explore Manali',
  },
  brandPillars: [
    {
      id: 'pillar-1',
      stepNumber: '01',
      title: 'Human expertise',
      description: 'Real travel designers who listen before they plan. No auto-generated templates.',
      displayOrder: 1,
      stageImage: '/Video/optimized/destination_himachal_poster.jpg',
    },
    {
      id: 'pillar-2',
      stepNumber: '02',
      title: 'Built around you',
      description: 'Your pace, preferences and non-negotiables come first.',
      displayOrder: 2,
      stageImage: '/Video/optimized/destination_kinnaur_poster.jpg',
    },
    {
      id: 'pillar-3',
      stepNumber: '03',
      title: 'Here when needed',
      description: 'Reliable 24/7 on-trip Telugu concierge support from first departure to your return home.',
      displayOrder: 3,
      stageImage: '/Video/optimized/destination_adventure_poster.jpg',
    },
    {
      id: 'pillar-4',
      stepNumber: '04',
      title: 'Clear and considered',
      description: 'Verified mountain properties and transparent tiered pricing with zero hidden fees.',
      displayOrder: 4,
      stageImage: '/Video/optimized/destination_kedarnath_poster.jpg',
    },
  ],
  trustStats: {
    id: 'main-trust-stats',
    stat1Value: '18',
    stat1Label: 'curated PDF packages',
    stat2Value: '3',
    stat2Label: 'Himachal hubs',
    stat3Value: '24k',
    stat3Label: 'journeys planned',
    stat4Value: '4.9',
    stat4Label: 'average traveller rating',
  },
  sectionHeaders: {
    trending: {
      kicker: 'Himachal, thoughtfully planned',
      title: 'Trending destinations',
      subtitle: 'Explore Manali, Kasol, and Shimla—each backed by verified Couple, Family, and Bachelors itineraries.',
    },
    specials: {
      kicker: 'Seasonal & off-season departures',
      title: 'Crazy Specials & Offers',
      subtitle: 'Handcrafted Himachal breaks with transparent Standard, Standard Plus, and Premium stays.',
    },
    soul: {
      kicker: 'Made to linger',
      title: 'Journeys with a little more soul',
      subtitle: 'Signature Himachal departures celebrating scenic valleys, mountain stays, and local hospitality.',
    },
    board: {
      kicker: 'Selected with local experts',
      title: 'Travel boards recommend',
      subtitle: 'Curated Himachal circuits and customizable valley stops handpicked by our specialists.',
    },
    stays: {
      kicker: 'Stay somewhere memorable',
      title: 'Explore boutique hotel stays',
      subtitle: 'Cedar mountain resorts, Parvati riverside camps, and hillside retreats.',
    },
    pillars: {
      kicker: 'Why travel with Crazy Tours Travel',
      title: 'Expertly planned. Genuinely personal.',
      subtitle: 'The craft behind each journey.',
    },
    stats: {
      kicker: 'The Crazy Tours Travel difference',
      title: 'Why travellers return to us',
      subtitle: 'Trusted mountain travel design with 24/7 Telugu concierge care.',
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

const VALID_REEL_CATEGORIES = new Set<PackageCategory>(['Couple', 'Family', 'Bachelors', 'Adventure'])

function normalizeCustomizationStop(stop: DestinationCustomizationStop): DestinationCustomizationStop {
  return {
    id: String(stop.id || '').trim() || `stop-${Math.random().toString(36).slice(2, 8)}`,
    name: String(stop.name || '').trim(),
    subtitle: stop.subtitle ? String(stop.subtitle) : undefined,
    extraDays: Number(stop.extraDays) || 0,
    extraNights: Number(stop.extraNights) || 0,
    priceDelta: stop.priceDelta !== undefined && stop.priceDelta !== null ? Number(stop.priceDelta) : undefined,
    highlights: Array.isArray(stop.highlights) ? stop.highlights.map(String).filter(Boolean) : [],
    allowedDurations: Array.isArray(stop.allowedDurations) ? stop.allowedDurations.map(String).filter(Boolean) : undefined,
    image: stop.image ? String(stop.image) : undefined,
  }
}

function normalizeDestination(d: DestinationItem): DestinationItem {
  return {
    ...d,
    adventureEnabled: Boolean(d.adventureEnabled),
    highlights: Array.isArray(d.highlights) ? d.highlights : [],
    gallery: Array.isArray(d.gallery) ? d.gallery : [],
    mustTryFood: Array.isArray(d.mustTryFood) ? d.mustTryFood : [],
    keyAttractions: Array.isArray(d.keyAttractions) ? d.keyAttractions : [],
    customizationOptions: Array.isArray(d.customizationOptions)
      ? d.customizationOptions.map(normalizeCustomizationStop).filter((stop) => Boolean(stop.name))
      : [],
  }
}

function normalizeReel(r: InstagramReelItem): InstagramReelItem {
  const category = r.category && VALID_REEL_CATEGORIES.has(r.category) ? r.category : undefined
  return {
    ...r,
    category,
    rating: Number(r.rating) || 5,
    displayOrder: Number(r.displayOrder) || 0,
  }
}

function normalizePackage(p: PackageItem): PackageItem {
  const daysCount = Number(p.daysCount) || 1
  return {
    ...p,
    daysCount,
    nightsCount: p.nightsCount ?? Math.max(0, daysCount - 1),
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
    exclusions: Array.isArray(p.exclusions) ? p.exclusions : [],
    thingsToCarry: Array.isArray(p.thingsToCarry) ? p.thingsToCarry : [],
    cancellationPolicy: Array.isArray(p.cancellationPolicy) ? p.cancellationPolicy : [],
    itinerary: Array.isArray(p.itinerary) ? p.itinerary : [],
  }
}

const emptyInitialState: DynamicStoreState = {
  destinations: nationalDestinations.map(normalizeDestination),
  packages: allPackages.map(normalizePackage),
  destinationsLoaded: true,
  packagesLoaded: true,
  stays: hotelStays,
  roadTrips: roadTrips,
  stories: defaultStories,
  offers: defaultOffers,
  heroSlides: defaultHeroSlides,
  reels: defaultReels.map(normalizeReel),
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
    activeDestinations: nationalDestinations.length,
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
      const nextDestinations = destinationsRes ? destinationsRes.map(normalizeDestination) : currentStore.destinations
      const nextPackages = packagesRes ? packagesRes.map(normalizePackage) : currentStore.packages
      currentStore = {
        ...currentStore,
        destinations: nextDestinations,
        packages: nextPackages,
        destinationsLoaded: currentStore.destinationsLoaded || destinationsRes !== null,
        packagesLoaded: currentStore.packagesLoaded || packagesRes !== null,
        stays: staysRes ?? currentStore.stays,
        roadTrips: roadTripsRes ?? currentStore.roadTrips,
        stories: storiesRes ?? currentStore.stories,
        offers: offersRes ?? currentStore.offers,
        heroSlides: heroSlidesRes ?? currentStore.heroSlides,
        reels: reelsRes ? reelsRes.map(normalizeReel) : currentStore.reels,
        reviews: reviewsRes ?? currentStore.reviews,
        storefront: storefrontRes?.specials ? storefrontRes : currentStore.storefront,
        stats: {
          ...currentStore.stats,
          activeDestinations: nextDestinations.length,
        },
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
      const payload = normalizeDestination(destination)
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || errData.message || 'Failed to save destination')
      }
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
      const payload = normalizePackage(pkg)
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || errData.message || 'Failed to save package')
      }
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
        const normalizedReel = normalizeReel(data.reel)
        currentStore = {
          ...currentStore,
          reels: currentStore.reels.map((r) => (r.id === id ? normalizedReel : r)),
        }
        notifyListeners()
      }
      return data.reel ? normalizeReel(data.reel) : data.reel
    } catch (err) {
      console.error('Error in updateReel:', err)
      throw err
    }
  },

  saveReel: async (reel: InstagramReelItem) => {
    try {
      const payload = normalizeReel(reel)
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
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
