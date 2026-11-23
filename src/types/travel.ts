import React from 'react'

export type IconName =
  | 'arrow'
  | 'bed'
  | 'calendar'
  | 'car'
  | 'chevron'
  | 'compass'
  | 'flight'
  | 'globe'
  | 'heart'
  | 'help'
  | 'hotel'
  | 'menu'
  | 'pin'
  | 'search'
  | 'shield'
  | 'sparkle'
  | 'user'
  | 'wallet'
  | 'x'
  | 'phone'
  | 'mail'
  | 'check'
  | 'clock'
  | 'share'
  | 'filter'
  | 'star'
  | 'tag'
  | 'download'
  | 'messageSquare'
  | 'camera'
  | 'play'
  | 'plus'
  | 'minus'
  | 'whatsapp'
  | 'instagram'
  | 'volume'
  | 'volumeX'
  | 'video'
  | 'award'
  | 'map'
  | 'barChart'
  | 'edit'
  | 'trash'
  | 'eye'
  | 'settings'
  | 'refresh'
  | 'copy'
  | 'grid'
  | 'list'
  | 'layers'
  | 'trendingUp'

export interface ItineraryDay {
  day: number
  title: string
  description: string
  meals?: string
  hotel?: string
  activities?: string[]
  startLocation?: string
  endLocation?: string
}

export interface PackageItem {
  id: string
  title: string
  place: string
  state: string
  duration: string
  daysCount: number
  price: string
  priceNum: number
  originalPrice: string
  discount: string
  rating: number
  reviewCount: number
  image: string
  gallery?: string[]
  overview: string
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: ItineraryDay[]
  theme: 'Honeymoon' | 'Family' | 'Adventure' | 'Heritage' | 'Scenic' | 'Wildlife'
  featured?: boolean
  googleRating?: number
  googleReviewsCount?: number
  googleMapsUrl?: string
}

export interface KeyAttraction {
  name: string
  type: string
}

export interface DestinationItem {
  slug: string
  city: string
  country: string
  state: string
  region?: string
  price: string
  priceNum: number
  image: string
  season: string
  duration: string
  tagline: string
  description: string
  highlights: string[]
  gallery: string[]
  bestTimeToVisit: string
  idealFor: string
  isTrending?: boolean
  displayOrder?: number
  // Google Ratings & Verified Social Proof (100% Free)
  googleRating?: number
  googleReviewsCount?: number
  googleMapsUrl?: string
  // Tourism Dimensions & Logistics
  nearestAirport?: string
  nearestRailway?: string
  recommendedStayDays?: string
  peakSeason?: string
  avgTemp?: string
  permitRequired?: boolean
  permitDetails?: string
  clothingAdvice?: string
  culturalNotes?: string
  mustTryFood?: string[]
  keyAttractions?: KeyAttraction[]
  networkCoverage?: string
}

export interface StayItem {
  id: string
  city: string
  state: string
  type: string
  name: string
  price: string
  priceNum: number
  rating: number
  image: string
  amenities: string[]
  description: string
  googleRating?: number
  googleReviewsCount?: number
  googleMapsUrl?: string
}

export interface RoadTripItem {
  id: string
  name: string
  route: string
  days: string
  distance: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  image: string
  highlights: string[]
  description: string
  stops: string[]
}

export interface StoryItem {
  id: string
  title: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  snippet: string
  content: string[]
}

export interface OfferItem {
  id: string
  code: string
  title: string
  discountText: string
  tag: string
  validTill: string
  description: string
  minBooking: string
  image: string
}

export interface InstagramReelItem {
  id: string
  title: string
  place: string
  customerName: string
  rating: number
  reviewQuote: string
  videoUrl: string
  posterUrl: string
  instagramUrl?: string
  duration: string
  displayOrder: number
}

export interface ReviewItem {
  id: string
  quote: string
  name: string
  trip: string
  rating: number
  avatar?: string
}

export interface FAQItem {
  question: string
  answer: string
  category?: string
}

export interface OfficeLocation {
  city: string
  address: string
  phone: string
  email: string
  hours: string
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'

export interface CurrencyConfig {
  code: Currency
  symbol: string
  rate: number // Rate relative to INR
}

export type RouteName =
  | 'home'
  | 'packages'
  | 'stays'
  | 'road-trips'
  | 'stories'
  | 'offers'
  | 'custom-trip'
  | 'about'
  | 'contact'
  | 'help'
  | 'manage-booking'
  | 'terms'
  | 'privacy'
  | 'admin'
  | `admin/${string}`
  | `package/${string}`
  | `destination/${string}`

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Voucher Issued'
  | 'Completed'
  | 'Cancelled'

export type PaymentStatus =
  | 'Unpaid'
  | 'Deposit Paid'
  | 'Fully Paid'
  | 'Refunded'

export interface BookingSubmission {
  bookingId: string
  packageName: string
  travelDate: string
  adults: number
  children: number
  hotelType: 'Standard' | 'Deluxe' | 'Luxury 5-Star'
  customerName: string
  customerEmail: string
  customerPhone: string
  specialRequests?: string
  totalPrice: number
  submittedAt: string
  status?: BookingStatus
  paymentStatus?: PaymentStatus
}

export type InquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Quoted'
  | 'Converted'
  | 'Closed'

export interface InquirySubmission {
  id: string
  fullName: string
  email: string
  phone: string
  preferredDestination: string
  travelMonth: string
  travelStart?: string
  travelEnd?: string
  travelSeason?: string
  sourcePage?: string
  sourceTitle?: string
  travelersCount: string
  budgetPerPerson: string
  tripType: string
  notes?: string
  status: InquiryStatus
  assignedAgent?: string
  createdAt: string
}
