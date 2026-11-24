import React, { type CSSProperties, FormEvent, useEffect, useRef, useState } from 'react'
import { CatalogPhoto } from '../components/CatalogPhoto'
import { heroVideoConfig } from '../data/destinationVideos'
import { Currency, DestinationItem, InstagramReelItem, PackageItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge } from '../components/GoogleVerifiedBadge'
import { defaultStorefrontConfig, useDynamicStore } from '../services/dataStore'
import {
  directoryGroups,
  faqs,
  formatPrice,
  heroSlides,
  hotelStays,
  nationalDestinations,
  allPackages,
  instagramReels,
  reviews,
} from '../data/travelData'
import kashmirImage from '../assets/wayfare-kashmir.png'
import socialHimachal from '../assets/wayfare-social-himachal.png'

interface HomePageProps {
  navigate: (route: RouteName) => void
  saved: string[]
  onToggleSave: (city: string) => void
  onBook: (title: string, price: number) => void
  currency: Currency
  onToast: (msg: string) => void
  onOpenStory: (story: any, index?: number) => void
}

function HomePackageCard({ trip, currency, navigate }: {
  trip: PackageItem
  currency: Currency
  navigate: HomePageProps['navigate']
}) {
  return (
    <article className="package-card">
      <div className="package-image">
        <CatalogPhoto src={trip.image} alt="" loading="lazy" />
        <span>{trip.duration}</span>
      </div>
      <div className="package-body">
        <p>{trip.place}</p>
        <h3>{trip.title}</h3>
        <div className="package-meta">
          <span>{trip.theme}</span>
          {trip.reviewCount > 0 && trip.rating > 0 && <span>{trip.rating} ★ ({trip.reviewCount})</span>}
        </div>
        <div className="package-price">
          <span>From <strong>{formatPrice(trip.priceNum, currency)}</strong> per traveller</span>
          <button type="button" onClick={() => navigate(`package/${trip.id}`)} aria-label={`View ${trip.title}`}>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}

function ReelVideoCard({
  reel,
  index,
  onOpen,
}: {
  reel: InstagramReelItem
  index: number
  onOpen: (reel: InstagramReelItem, index: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cardRef = useRef<HTMLElement | null>(null)
  const [isCardMuted, setIsCardMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.15 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const nextMuted = !isCardMuted
    videoRef.current.muted = nextMuted
    setIsCardMuted(nextMuted)
  }

  return (
    <article
      ref={cardRef}
      className="social-card relative cursor-pointer group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-white/10 select-none shrink-0"
      onClick={() => onOpen(reel, index)}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.posterUrl}
        playsInline
        autoPlay
        muted={isCardMuted}
        loop
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/45 pointer-events-none" />

      {/* Top Bar on Card */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/15">
          <Icon name="instagram" size={11} className="text-rose-400" />
          <span>5.0</span>
          <span className="text-white/70">★ Review</span>
        </span>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={isCardMuted ? 'Unmute preview' : 'Mute preview'}
          className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-110 border border-white/20"
        >
          <Icon name={isCardMuted ? 'volumeX' : 'volume'} size={13} />
        </button>
      </div>

      {/* Center Play Button indicator on Hover */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/85 group-hover:bg-white text-[#072f2b] flex items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 opacity-75 group-hover:opacity-100">
        <Icon name="play" size={17} className="translate-x-0.5 fill-[#072f2b]" />
      </div>

      {/* Bottom Information */}
      <div className="absolute bottom-3 inset-x-3 z-10 text-white space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold tracking-tight text-white line-clamp-1 drop-shadow-sm">
            {reel.customerName}
          </p>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-300/80 font-mono">
            {reel.duration}
          </span>
        </div>
        <p className="text-[10px] text-amber-200 line-clamp-1 font-medium">
          📍 {reel.place}
        </p>
        <p className="text-[10px] text-white/85 line-clamp-2 leading-tight italic">
          “{reel.reviewQuote}”
        </p>
        <div className="pt-1.5 flex items-center justify-between border-t border-white/15">
          <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
            <Icon name="check" size={10} /> Verified Guest
          </span>
          <a
            href={reel.instagramUrl || 'https://www.instagram.com/crazytourstravels/'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-rose-300 hover:text-white flex items-center gap-1 font-semibold"
            title="Open on Instagram"
          >
            <span>Instagram</span>
            <Icon name="arrow" size={10} className="-rotate-45" />
          </a>
        </div>
      </div>
    </article>
  )
}


const customizationDestinations = [
  {
    slug: 'kashmir',
    city: 'Kashmir',
    tagline: 'Paradise in bloom, pine valleys & houseboats',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
    locations: ['Dal Lake Houseboat', 'Gulmarg Backcountry', 'Pahalgam Pine Valley', 'Sonamarg Thajiwas Glacier'],
    highlights: ['Private Shikara cruise at twilight', 'Chauffeured sedan throughout', 'Warm Kahwa tasting sessions'],
    startingPrice: 32500,
  },
  {
    slug: 'kerala',
    city: 'Kerala',
    tagline: 'Misty tea estates, backwaters & spice trails',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    locations: ['Munnar Tea Country', 'Alleppey Backwaters', 'Marari Secret Beach', 'Wayanad Rainforests'],
    highlights: ['Exclusive private luxury houseboat', 'Ayurvedic wellness sessions', 'Spice plantation trail with local botanist'],
    startingPrice: 28900,
  },
  {
    slug: 'rajasthan',
    city: 'Rajasthan',
    tagline: 'Golden dunes, royal havelis & starry skies',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85',
    locations: ['Udaipur Lake Pichola', 'Jaisalmer Sam Dunes', 'Jaipur Royal Palaces', 'Jodhpur Blue Fort'],
    highlights: ['Luxury desert tent with bonfire & stargazing', 'Curated palace suite upgrade options', 'Chauffeured Toyota Innova Crysta'],
    startingPrice: 26800,
  },
  {
    slug: 'ladakh',
    city: 'Ladakh',
    tagline: 'High mountain passes, azure lakes & silence',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=85',
    locations: ['Nubra Valley Sand Dunes', 'Pangong Tso Alpine Lake', 'Khardung La (17,982 ft)', 'Hemis & Thiksey Monasteries'],
    highlights: ['High-clearance 4x4 with emergency oxygen kit', 'Double-humped camel safari at Hunder', 'Night sky astrophotography guide'],
    startingPrice: 42000,
  },
  {
    slug: 'goa',
    city: 'Goa',
    tagline: 'Portuguese heritage villas & secluded shores',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
    locations: ['South Goa Heritage Villas', 'Dudhsagar Waterfalls', 'Cola Beach Lagoon', 'Chapora Sunset River Cruise'],
    highlights: ['Private villa with plunge pool', 'Secret beach hopping in open-top jeep', 'Catamaran sunset sail with snacks'],
    startingPrice: 22500,
  },
  {
    slug: 'andaman',
    city: 'Andaman',
    tagline: 'Turquoise waters, coral atolls & white sands',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
    locations: ['Havelock Radhanagar Beach', 'Elephant Beach Coral Reef', 'Neil Natural Bridge', 'Baratang Mangrove Caves'],
    highlights: ['High-speed Makruzz catamaran transfers', 'PADI-certified scuba dive session', 'Beachfront luxury cabana'],
    startingPrice: 34500,
  },
]

const adventureFeatures = [
  {
    title: 'High-Altitude Mountain Passes',
    location: 'Khardung La & Chang La, Ladakh (17,982 ft)',
    desc: 'Breathtaking 4x4 mountain drives and bike convoys with backup vehicle, first-aid & oxygen.',
  },
  {
    title: 'White-Water River Rafting',
    location: 'Indus & Zanskar Rapids / Ganges, Rishikesh',
    desc: 'Grade III & IV white-water runs navigated with certified rescue river masters.',
  },
  {
    title: 'Thar Desert Dune Glamping & Quad Biking',
    location: 'Sam Sand Dunes, Jaisalmer',
    desc: 'High-powered dune bashing, quad biking and luxury swiss tents under starry skies.',
  },
  {
    title: 'Coral Reef Snorkeling & Scuba Diving',
    location: 'Havelock Island & Elephant Beach, Andaman',
    desc: 'Pristine underwater coral gardens and sea turtle lagoons with certified PADI divemasters.',
  },
]

export function HomePage({
  navigate,
  saved,
  onToggleSave,
  onBook,
  currency,
  onToast,
  onOpenStory,
}: HomePageProps) {
  const store = useDynamicStore()
  const sf = store.storefront || defaultStorefrontConfig
  const headers = sf.sectionHeaders || defaultStorefrontConfig.sectionHeaders
  const slides = store.heroSlides.length > 0 ? store.heroSlides : heroSlides
  const displayPackages = store.packagesLoaded || store.isLoading ? store.packages : allPackages
  const displayStays = store.stays.length > 0 ? store.stays : hotelStays
  const displayReviews = store.reviews.length > 0 ? store.reviews : reviews

  const trendingDestinations = [...store.destinations]
    .filter((destination) => destination.isTrending !== false)
    .sort((a, b) => ((a as any).displayOrder ?? 0) - ((b as any).displayOrder ?? 0))

  const homePackages = (() => {
    const featured = [...displayPackages]
      .filter((pkg) => pkg.featured)
      .sort((left, right) => ((left as any).homeSpotlightOrder ?? 99) - ((right as any).homeSpotlightOrder ?? 99))
    if (featured.length >= 3) return featured.slice(0, 3)
    const remaining = displayPackages.filter((p) => !featured.some((f) => f.id === p.id))
    return [...featured, ...remaining].slice(0, 3)
  })()

  const homeStays = (() => {
    const featured = [...displayStays]
      .filter((stay) => (stay as any).isHomeFeatured !== false)
      .sort((a, b) => ((a as any).homeDisplayOrder ?? 99) - ((b as any).homeDisplayOrder ?? 99))
    return featured.length > 0 ? featured : displayStays
  })()

  const special1 = sf.specials.find((s) => s.slotIndex === 1) || defaultStorefrontConfig.specials[0]
  const special2 = sf.specials.find((s) => s.slotIndex === 2) || defaultStorefrontConfig.specials[1]
  const special3 = sf.specials.find((s) => s.slotIndex === 3) || defaultStorefrontConfig.specials[2]
  const special4 = sf.specials.find((s) => s.slotIndex === 4) || defaultStorefrontConfig.specials[3]

  const boardFeature = sf.boardFeature || defaultStorefrontConfig.boardFeature!
  const brandPillars = sf.brandPillars.length > 0 ? sf.brandPillars : defaultStorefrontConfig.brandPillars
  const stageImage = brandPillars[0]?.stageImage || 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85'
  const trustStats = sf.trustStats || defaultStorefrontConfig.trustStats!

  const displayReels = store.reels.length > 0 ? store.reels : instagramReels
  const rankedPackages = [...displayPackages].sort((left, right) => Number(!!right.featured) - Number(!!left.featured))
  const recommendedPackages = rankedPackages.slice(0, 3)
  const adventurePackages = rankedPackages.filter((trip) => trip.theme === 'Adventure').slice(0, 3)
  const offeredDestinations = store.destinationsLoaded || store.isLoading ? store.destinations : nationalDestinations
  const [isHeroMuted, setIsHeroMuted] = useState(true)
  const [activeCustomDestSlug, setActiveCustomDestSlug] = useState('kashmir')
  const activeCustomDest = customizationDestinations.find((d) => d.slug === activeCustomDestSlug) || customizationDestinations[0]
  const [customDestination, setCustomDestination] = useState('')
  const selectedDestination = offeredDestinations.find(({ slug }) => slug === customDestination)

  const [selectedHeroIndex, setHeroIndex] = useState(0)
  const heroIndex = selectedHeroIndex % slides.length
  const [activeService, setActiveService] = useState('Holidays')
  const [openFaq, setOpenFaq] = useState(0)
  const [directoryTab, setDirectoryTab] = useState<keyof typeof directoryGroups>('North India')
  const [searchDestination, setSearchDestination] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [searchTravellers, setSearchTravellers] = useState('2 adults')
  const destinationTrack = useRef<HTMLDivElement>(null)
  const socialTrackRef = useRef<HTMLDivElement>(null)
  const [reelNavigation, setReelNavigation] = useState({ previous: false, next: false })

  const scrollSocial = (direction: -1 | 1) => {
    const track = socialTrackRef.current
    const first = track?.children[0]
    const second = track?.children[1]
    if (!track || !first || !second) return
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left
    track.scrollBy({
      left: direction * step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  useEffect(() => {
    const track = socialTrackRef.current
    if (!track) return
    const update = () => {
      const previous = track.scrollLeft > 1
      const next = track.scrollLeft + track.clientWidth < track.scrollWidth - 1
      setReelNavigation((current) =>
        current.previous === previous && current.next === next ? current : { previous, next }
      )
    }
    const observer = new ResizeObserver(update)
    observer.observe(track)
    track.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      track.removeEventListener('scroll', update)
    }
  }, [store.reels.length])

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setTimeout(() => {
      setHeroIndex((current) => (current + 1) % slides.length)
    }, 6500)
    return () => window.clearTimeout(timer)
  }, [heroIndex, slides.length])

  const moveHero = (direction: number) => {
    setHeroIndex((current) => (current + direction + slides.length) % slides.length)
  }

  const scrollDestinations = (direction: number) => {
    destinationTrack.current?.scrollBy({ left: direction * 520, behavior: 'smooth' })
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (activeService === 'Stays') {
      navigate('stays')
    } else if (activeService === 'Road trips') {
      navigate('road-trips')
    } else {
      navigate('packages')
    }
    onToast(
      `Searching ${activeService.toLowerCase()} for ${searchDestination || 'top destinations in India'}...`
    )
  }

  return (
    <main>
      {/* Clean Scenic Hero Viewport & Brand Showcase (Inspired by Reference Mockup) */}
      <div className="shell-wide mb-8">
        <section className="hero-window-banner" aria-label="Crazy Tours Travel Showcase">
          {/* Ambient Video Background */}
          <video
            src={heroVideoConfig.videoUrl}
            poster={heroVideoConfig.posterUrl}
            autoPlay
            loop
            muted={isHeroMuted}
            playsInline
            className="hero-video-bg"
          />
          <div className="hero-window-scrim" />
          <div className="hero-window-frame" />

          <div className="hero-window-content">
            {/* Top row: Sound toggle */}
            <div className="hero-top-row">
              <div />
              <button
                type="button"
                onClick={() => setIsHeroMuted(!isHeroMuted)}
                className="hero-sound-toggle"
                aria-label={isHeroMuted ? 'Unmute ambient sound' : 'Mute sound'}
                title={isHeroMuted ? 'Unmute audio' : 'Mute audio'}
              >
                <Icon name={isHeroMuted ? 'volumeX' : 'volume'} size={18} />
              </button>
            </div>

            {/* Left Column: Pure English Brand Information (Right side empty for landscape view) */}
            <div className="hero-info-panel">
              <p className="hero-eyebrow">Travel with a local touch</p>

              <h1 className="hero-title">Crazy Tours Travel</h1>

              <p className="hero-subtitle">Handcrafted journeys across India and beyond</p>

              {/* 4 Feature Badges in a single horizontal strip */}
              <div className="hero-features-strip">
                <div className="hero-feature-item">
                  <Icon name="user" size={16} className="hero-feature-icon" />
                  <span>Telugu-speaking Tour Captains</span>
                </div>
                <div className="hero-feature-divider" />
                <div className="hero-feature-item">
                  <svg className="hero-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 17H6a2 2 0 0 1-2-2 8 8 0 0 1 16 0 2 2 0 0 1-2 2Z"/>
                    <path d="M12 5V3"/>
                    <path d="M4 21h16"/>
                  </svg>
                  <span>South Indian &amp; Andhra Meals</span>
                </div>
                <div className="hero-feature-divider" />
                <div className="hero-feature-item">
                  <Icon name="shield" size={16} className="hero-feature-icon" />
                  <span>Verified &amp; Safe Travel</span>
                </div>
                <div className="hero-feature-divider" />
                <div className="hero-feature-item">
                  <Icon name="calendar" size={16} className="hero-feature-icon" />
                  <span>24/7 Trip Support</span>
                </div>
              </div>

              {/* Two CTA Buttons */}
              <div className="hero-actions-row">
                <button
                  type="button"
                  onClick={() => navigate('packages')}
                  className="hero-btn-explore"
                >
                  <span>Explore Holidays</span>
                  <Icon name="arrow" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('custom-trip')}
                  className="hero-btn-custom"
                >
                  <span>Plan Custom Trip</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"/>
                    <line x1="4" y1="10" x2="4" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12" y2="3"/>
                    <line x1="20" y1="21" x2="20" y2="16"/>
                    <line x1="20" y1="12" x2="20" y2="3"/>
                    <line x1="1" y1="14" x2="7" y2="14"/>
                    <line x1="9" y1="8" x2="15" y2="8"/>
                    <line x1="17" y1="16" x2="23" y2="16"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Integrated Search Pill (Inspired by Reference Mockup) */}
            <form className="hero-bottom-search-bar" onSubmit={handleSearch}>
              <div className="hero-search-segment">
                <Icon name="pin" size={18} className="hero-search-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  placeholder="Where do you want to go?"
                  aria-label="Destination"
                />
              </div>

              <div className="hero-search-divider" />

              <div className="hero-search-segment">
                <Icon name="calendar" size={18} className="hero-search-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Travel Dates"
                  aria-label="Travel dates"
                />
              </div>

              <div className="hero-search-divider" />

              <div className="hero-search-segment">
                <Icon name="user" size={18} className="hero-search-icon" />
                <select
                  className="hero-search-select"
                  value={searchTravellers}
                  onChange={(e) => setSearchTravellers(e.target.value)}
                  aria-label="Travelers count"
                >
                  <option value="2 adults">2 adults</option>
                  <option value="1 adult">1 adult</option>
                  <option value="Family of 4">Family of 4</option>
                  <option value="Group of 6+">Group of 6+</option>
                </select>
              </div>

              <button type="submit" className="hero-search-submit" aria-label="Search journeys">
                <Icon name="search" size={18} />
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Trust Strip */}
      <section className="trust-strip shell">
        <div>
          <Icon name="shield" size={24} />
          <span>
            <strong>Travel with confidence</strong> 24/7 dedicated concierge, all trip long
          </span>
        </div>
        <div>
          <Icon name="compass" size={24} />
          <span>
            <strong>Curated by real explorers</strong> Handpicked stays & verified routes
          </span>
        </div>
        <div>
          <Icon name="wallet" size={24} />
          <span>
            <strong>Clear, honest pricing</strong> No hidden fees or surprises at checkout
          </span>
        </div>
      </section>

      {/* Trending Destinations Carousel */}
      <section className="destination-section">
        <div className="section shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ef4934]/10 text-[#ef4934] text-xs font-bold tracking-wider uppercase mb-2.5">
                <Icon name="sparkle" size={12} />
                <span>{headers.trending?.kicker || 'India, beautifully explored'}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-[#072f2b] tracking-tight font-normal">
                {headers.trending?.title || 'Trending destinations'}
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl leading-relaxed">
                {headers.trending?.subtitle || 'Six remarkable places curated for immersive discovery. Each one designed as a deep journey, not a tourist checklist.'}
              </p>
            </div>

            {/* Carousel navigation arrow controls */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                className="destination-arrow previous"
                onClick={() => scrollDestinations(-1)}
                aria-label="Previous destinations"
              >
                <Icon name="chevron" size={18} />
              </button>
              <button
                className="destination-arrow next"
                onClick={() => scrollDestinations(1)}
                aria-label="Next destinations"
              >
                <Icon name="chevron" size={18} />
              </button>
            </div>
          </div>

          <div className="destination-carousel">
            <div className="destination-track" ref={destinationTrack}>
              {trendingDestinations.map((destination) => {
                const isSaved = saved.includes(destination.city)
                return (
                  <article className="destination-card group" key={destination.slug}>
                    <CatalogPhoto
                      src={destination.image}
                      alt={`${destination.city}, ${destination.country}`}
                    />
                    <div className="destination-scrim" />
                    <a
                      href={`#/destination/${destination.slug}`}
                      aria-label={`Explore ${destination.city}`}
                      className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                      onClick={(event) => {
                        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
                        event.preventDefault()
                        navigate(`destination/${destination.slug}`)
                      }}
                    />

                    {/* Top Arch Center: State & City Title (Rajasthan Fort Window style) */}
                    <div className="absolute top-10 inset-x-5 z-10 text-center pointer-events-none">
                      <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#ffd0c7] drop-shadow-sm mb-0.5">
                        {destination.country}
                      </p>
                      <h3 className="font-serif text-[28px] font-normal text-white leading-tight drop-shadow-md group-hover:text-[#ffd0c7] transition-colors">
                        {destination.city}
                      </h3>
                    </div>

                    <div className="pointer-events-none absolute bottom-0 inset-x-0 z-20 flex flex-col justify-end p-4 sm:p-5">
                      {/* Google Verified Rating Badge */}
                      <div className="mb-2.5">
                        <GoogleVerifiedBadge
                          rating={destination.googleRating}
                          reviewsCount={destination.googleReviewsCount}
                          mapsUrl={destination.googleMapsUrl}
                          size="sm"
                          className="pointer-events-auto bg-white/95 text-slate-800 shadow-sm"
                        />
                      </div>

                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-white/70 mb-0.5">
                            Journeys from
                          </span>
                          <strong className="text-white text-base font-bold font-sans">
                            {formatPrice(destination.priceNum, currency)}
                          </strong>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            className={`pointer-events-auto grid size-10 place-items-center rounded-full border border-white/45 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isSaved ? 'bg-[#c83c2c] text-white' : 'bg-white text-[#072f2b] hover:bg-[#f9eee8] hover:text-[#c83c2c]'}`}
                            onClick={() => {
                              onToggleSave(destination.city)
                              onToast(isSaved ? `Removed ${destination.city} from saved trips.` : `Saved ${destination.city} to your wishlist.`)
                            }}
                            aria-label={`Save ${destination.city}`}
                            aria-pressed={isSaved}
                          >
                            <Icon name="heart" size={16} className={isSaved ? 'fill-current' : ''} />
                          </button>
                          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/60 transition-colors group-hover:bg-white group-hover:text-[#072f2b]">
                            <Icon name="arrow" size={17} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="destination-cta">
            <button onClick={() => navigate('packages')}>
              Explore all destinations & packages <Icon name="arrow" size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* We Offer Customization Showcase & Efficiency Hub */}
      <section className="customization-section" aria-labelledby="home-customization-heading">
        <div className="shell">
          <div className="section-heading mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b4941]/10 text-[#0b4941] text-xs font-bold tracking-wider uppercase mb-2">
                <Icon name="sparkle" size={13} />
                <span>Handcrafted to Your Pace</span>
              </div>
              <h2 id="home-customization-heading" className="font-serif text-3xl md:text-4xl lg:text-[42px] text-[#072f2b] tracking-tight font-normal">
                We offer customization
              </h2>
              <p className="text-gray-600 text-sm mt-2 max-w-2xl leading-relaxed">
                Why take a rigid group tour when you can craft an itinerary tailored to your exact pace, rhythm, and style?
                Direct vehicle coordination, handpicked boutique stays, and dedicated 24/7 personal trip design.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('custom-trip')}
              className="section-link"
            >
              Start custom planner <Icon name="arrow" size={17} />
            </button>
          </div>

          <div className="customization-grid">
            {/* Card 1: Tailored Locations for Each Destination We Offer */}
            <article className="customization-card-modern">
              <div className="customization-media-wrap">
                <CatalogPhoto
                  src={activeCustomDest.image}
                  alt={activeCustomDest.city}
                  loading="lazy"
                />
                <div className="customization-media-scrim" />
                <span className="customization-media-badge">
                  <Icon name="compass" size={12} />
                  <span>Custom Locations For Every Region</span>
                </span>
                <div className="customization-media-overlay-content">
                  <h3>{activeCustomDest.city} Custom Itineraries</h3>
                  <p>{activeCustomDest.tagline}</p>
                </div>
              </div>

              <div className="customization-body-modern">
                {/* Destination Selector Pills */}
                <div className="mb-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Select a destination to explore custom spots:
                  </span>
                  <div className="customization-pill-row">
                    {customizationDestinations.map((dest) => (
                      <button
                        key={dest.slug}
                        type="button"
                        className={`customization-pill ${activeCustomDestSlug === dest.slug ? 'active' : ''}`}
                        onClick={() => setActiveCustomDestSlug(dest.slug)}
                        aria-pressed={activeCustomDestSlug === dest.slug}
                      >
                        {dest.city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom locations offered in this destination */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-[#072f2b] uppercase tracking-wider block mb-1.5">
                    Curated Locations & Secret Stops in {activeCustomDest.city}:
                  </span>
                  <div className="customization-location-tags">
                    {activeCustomDest.locations.map((loc, idx) => (
                      <span key={idx} className="customization-location-tag">
                        📍 {loc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key customization perks */}
                <div className="customization-perks-list">
                  {activeCustomDest.highlights.map((item, idx) => (
                    <div key={idx} className="customization-perk-item">
                      <Icon name="check" size={14} />
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="customization-perk-item">
                    <Icon name="check" size={14} />
                    <span>Private AC Chauffeur & Sanitized Cab with zero forced stops</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="customization-footer-actions">
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">Starting from</span>
                    <strong className="text-lg font-bold text-[#072f2b]">
                      {formatPrice(activeCustomDest.startingPrice, currency)}
                    </strong>
                    <span className="text-[11px] text-gray-500"> / person</span>
                  </div>
                  <button
                    type="button"
                    className="customization-btn-primary"
                    onClick={() => navigate(`custom-trip/${encodeURIComponent(activeCustomDest.slug)}`)}
                  >
                    <span>Customize {activeCustomDest.city}</span>
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              </div>
            </article>

            {/* Card 2: Adventure Locations for Selected Packages */}
            <article className="customization-card-modern">
              <div className="customization-media-wrap">
                <CatalogPhoto
                  src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=85"
                  alt="Adventure mountain pass"
                  loading="lazy"
                />
                <div className="customization-media-scrim" />
                <span className="customization-media-badge">
                  <Icon name="sparkle" size={12} />
                  <span>Curated Thrills & High Passes</span>
                </span>
                <div className="customization-media-overlay-content">
                  <h3>Adventure Locations for Selected Packages</h3>
                  <p>Himalayan passes, river rapids, desert safaris & deep reefs tailored to your thrill level.</p>
                </div>
              </div>

              <div className="customization-body-modern">
                {/* Adventure Location Highlights */}
                <div className="space-y-3 mb-4">
                  {adventureFeatures.map((adv, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e4eee8] hover:border-[#b8d6c8] transition-colors">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#072f2b]">{adv.title}</h4>
                        <span className="text-[10px] font-semibold text-[#ef4934] shrink-0 font-mono">📍 {adv.location}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{adv.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Selected Adventure Packages */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-[#072f2b] uppercase tracking-wider block mb-2">
                    Popular Adventure Packages:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rankedPackages
                      .filter((p) => p.theme === 'Adventure' || p.id.includes('andaman') || p.id.includes('sikkim') || p.id.includes('kashmir'))
                      .slice(0, 3)
                      .map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => navigate(`package/${pkg.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c8ded4] bg-white text-xs font-semibold text-[#0b4941] hover:bg-[#eaf4ef] transition-colors"
                        >
                          <span>{pkg.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono">({formatPrice(pkg.priceNum, currency)})</span>
                          <Icon name="arrow" size={12} />
                        </button>
                      ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="customization-footer-actions">
                  <button
                    type="button"
                    className="customization-btn-secondary"
                    onClick={() => navigate('packages')}
                  >
                    <span>View all packages</span>
                  </button>
                  <button
                    type="button"
                    className="customization-btn-primary"
                    onClick={() => navigate('custom-trip')}
                  >
                    <span>Plan Custom Adventure</span>
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Efficiency & Trust Showcase Bar */}
          <div className="customization-trust-bar">
            <div className="customization-trust-item">
              <div className="customization-trust-icon">
                <Icon name="sparkle" size={20} />
              </div>
              <div className="customization-trust-text">
                <h4>24h Custom Blueprint</h4>
                <p>Personalized day-by-day route with vetted hotels sent to WhatsApp within 24 hours.</p>
              </div>
            </div>

            <div className="customization-trust-item">
              <div className="customization-trust-icon">
                <Icon name="refresh" size={20} />
              </div>
              <div className="customization-trust-text">
                <h4>Unlimited Free Revisions</h4>
                <p>Change hotels, add safari days, or tweak destinations until it perfectly matches your dream pace.</p>
              </div>
            </div>

            <div className="customization-trust-item">
              <div className="customization-trust-icon">
                <Icon name="wallet" size={20} />
              </div>
              <div className="customization-trust-text">
                <h4>Direct B2B Pricing</h4>
                <p>Contracted luxury rates with direct vehicle & hotel coordination. Zero hidden commission markups.</p>
              </div>
            </div>

            <div className="customization-trust-item">
              <div className="customization-trust-icon">
                <Icon name="phone" size={20} />
              </div>
              <div className="customization-trust-text">
                <h4>24/7 Dedicated Concierge</h4>
                <p>Your personal trip specialist stays on call via WhatsApp from departure until your safe flight home.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Moments Stories & Instagram Reels Video Section */}
      {displayReels.length > 0 && (
        <section className="social-section" id="instagram-reels">
          <div className="shell social-layout">
            <div className="social-intro">
              <span className="kicker">Follow @crazytourstravels</span>
              <h2>Small moments.<br />Real customer stories.</h2>
              <p>
                Live notes and customer video reviews from travelers across Kashmir, Kerala, Rajasthan, Ladakh, and beyond.
                Watch them run simultaneously or click any reel to experience full sound and reviews.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.instagram.com/crazytourstravels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
                >
                  <Icon name="instagram" size={15} />
                  <span>Follow on Instagram</span>
                </a>
                {(reelNavigation.previous || reelNavigation.next) && (
                  <div className="social-reel-controls">
                    <button
                      type="button"
                      onClick={() => scrollSocial(-1)}
                      disabled={!reelNavigation.previous}
                      aria-label="Previous reel"
                      aria-controls="instagram-reel-track"
                    >
                      <Icon name="chevron" size={18} className="rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSocial(1)}
                      disabled={!reelNavigation.next}
                      aria-label="Next reel"
                      aria-controls="instagram-reel-track"
                    >
                      <Icon name="chevron" size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div id="instagram-reel-track" className="social-track" ref={socialTrackRef}>
              {displayReels.map((reel: InstagramReelItem, index: number) => (
                <ReelVideoCard
                  key={reel.id || index}
                  reel={reel}
                  index={index}
                  onOpen={(r, idx) => onOpenStory(r, idx)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {displayPackages.length > 0 && (
        <>
          <section className="shell section" aria-labelledby="home-packages-heading">
            <div className="section-heading">
              <h2 id="home-packages-heading">Holiday packages</h2>
              <button type="button" onClick={() => navigate('packages')} className="section-link">
                View all packages <Icon name="arrow" size={17} />
              </button>
            </div>
            <div className="package-grid package-browse" tabIndex={0} role="group" aria-label="Browse holiday package cards">
              {displayPackages.map((trip) => (
                <HomePackageCard key={trip.id} trip={trip} currency={currency} navigate={navigate} />
              ))}
            </div>
          </section>

          <section className="journeys" aria-labelledby="home-recommended-heading">
            <div className="shell section">
              <div className="section-heading light">
                <h2 id="home-recommended-heading">Recommended packages</h2>
              </div>
              <div className="package-grid">
                {recommendedPackages.map((trip) => (
                  <HomePackageCard key={trip.id} trip={trip} currency={currency} navigate={navigate} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="board-section">
        <div className="shell section">
          <div className="section-heading">
            <div>
              <span className="kicker">{headers.board?.kicker || boardFeature.kicker}</span>
              <h2>{headers.board?.title || boardFeature.sectionTitle}</h2>
            </div>
            <button onClick={() => navigate('stories')} className="section-link">
              View all stories <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="board-feature">
            <img
              src={boardFeature.image}
              alt={boardFeature.headline}
            />
            <div className="board-overlay">
              <span>{boardFeature.partnerBadge}</span>
              <h3>{boardFeature.headline}</h3>
              <p>{boardFeature.description}</p>
              <button onClick={() => navigate(boardFeature.actionRoute as RouteName)}>
                {boardFeature.actionLabel} <Icon name="arrow" size={17} />
              </button>
            </div>
            <div className="board-progress">
              <i />
              <i className="active" />
              <i />
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Stays Showcase */}
      <section className="stays-section">
        <div className="shell section">
          <div className="section-heading">
            <div>
              <span className="kicker">{headers.stays?.kicker || 'Stay somewhere memorable'}</span>
              <h2>{headers.stays?.title || 'Explore boutique hotel stays'}</h2>
            </div>
            <button onClick={() => navigate('stays')} className="section-link">
              Browse all stays <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="stays-grid">
            {homeStays.map((stay) => (
              <article className="stay-card" key={stay.id}>
                <CatalogPhoto src={stay.image} alt={`${stay.type} in ${stay.city}`} />
                <div className="stay-card-scrim" />
                <span>{stay.type}</span>
                <h3>{stay.city}</h3>
                <button
                  onClick={() => onBook(`Stay at ${stay.name} (${stay.city})`, stay.priceNum)}
                  aria-label={`Explore stays in ${stay.city}`}
                >
                  <Icon name="arrow" size={18} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section className="why-section shell section">
        <div className="section-heading">
          <div>
            <span className="kicker">{headers.pillars?.kicker || 'Why travel with Crazy Tours Travel'}</span>
            <h2>{headers.pillars?.title || 'Expertly planned. Genuinely personal.'}</h2>
          </div>
        </div>
        <div className="why-stage">
          <img
            src={stageImage}
            alt="Travellers beginning a new journey"
          />
          {brandPillars.slice(0, 4).map((pillar, idx) => {
            const classNames = ['why-one', 'why-two', 'why-three', 'why-four']
            return (
              <article className={`why-card ${classNames[idx] || 'why-one'}`} key={pillar.id || pillar.stepNumber || idx}>
                <span>{pillar.stepNumber}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Testimonials & Stats */}
      <section className="love-section">
        <div className="shell section">
          <div className="love-heading">
            <span className="kicker">{headers.stats?.kicker || 'The Crazy Tours Travel difference'}</span>
            <h2>{headers.stats?.title || 'Why travellers return to us'}</h2>
          </div>
          <div className="stats-row">
            <div>
              <strong>{trustStats.stat1Value}</strong>
              <span>{trustStats.stat1Label}</span>
            </div>
            <div>
              <strong>{trustStats.stat2Value}</strong>
              <span>{trustStats.stat2Label}</span>
            </div>
            <div>
              <strong>{trustStats.stat3Value}</strong>
              <span>{trustStats.stat3Label}</span>
            </div>
            <div>
              <strong>{trustStats.stat4Value}</strong>
              <span>{trustStats.stat4Label}</span>
            </div>
          </div>
          <div className="review-track">
            {displayReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <span className="quote-mark">“</span>
                <p>{review.quote}</p>
                <div>
                  <span>{review.name.slice(0, 1)}</span>
                  <p>
                    <strong>{review.name}</strong>
                    <small>{review.trip}</small>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Trip Planner CTA */}
      <section className="planner shell">
        <div className="planner-art">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <Icon name="compass" size={62} />
        </div>
        <div className="planner-copy">
          <span className="kicker">Your trip, your rhythm</span>
          <h2>Can’t find the journey in your head?</h2>
          <p>
            Tell our travel designers what moves you. We’ll shape a one-of-a-kind itinerary around your pace,
            tastes and budget with private chauffeured cars and certified boutique stays.
          </p>
          <button onClick={() => navigate('custom-trip')}>
            Plan something original <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section">
        <div className="shell section">
          <div className="faq-heading">
            <span className="kicker">Before you set off</span>
            <h2>Frequently asked questions</h2>
            <p>Clear answers to the things travellers ask us most.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                key={faq.question}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <Icon name="chevron" size={19} />
                </button>
                <div>
                  <p>{faq.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Browser */}
      <section className="directory-section">
        <div className="shell section">
          <div className="directory-copy">
            <span className="kicker">Find your way</span>
            <h2>A world of journeys</h2>
            <p>
              Browse our most-loved destinations and travel styles. Every link is a starting point for
              something more personal.
            </p>
          </div>
          <div className="directory-browser">
            <div className="directory-tabs">
              {(Object.keys(directoryGroups) as Array<keyof typeof directoryGroups>).map((group) => (
                <button
                  className={directoryTab === group ? 'active' : ''}
                  onClick={() => setDirectoryTab(group)}
                  key={group}
                >
                  {group}
                  <Icon name="chevron" size={15} />
                </button>
              ))}
            </div>
            <div className="directory-links">
              {directoryGroups[directoryTab].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate('packages')}
                  className="text-left hover:text-[#ef4934] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
