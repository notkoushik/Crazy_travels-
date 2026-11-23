import React, { type CSSProperties, FormEvent, type RefObject, useEffect, useRef, useState } from 'react'
import { Currency, DestinationItem, InstagramReelItem, PackageItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge } from '../components/GoogleVerifiedBadge'
import { TripInquiry } from '../components/TripInquiry'
import { WhatsAppFloat } from '../components/WhatsAppFloat'
import { useDynamicStore } from '../services/dataStore'
import {
  directoryGroups,
  faqs,
  formatPrice,
  heroSlides,
  hotelStays,
  nationalDestinations,
  allPackages,
  reviews,
  services,
  socialStories,
  instagramReels,
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
  isHeroInquiryOpen: boolean
  onCloseHeroInquiry: () => void
  inquiryLauncherRef: RefObject<HTMLButtonElement | null>
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

export function HomePage({
  navigate,
  saved,
  onToggleSave,
  onBook,
  currency,
  onToast,
  onOpenStory,
  isHeroInquiryOpen,
  onCloseHeroInquiry,
  inquiryLauncherRef,
}: HomePageProps) {
  const store = useDynamicStore()
  const slides = store.heroSlides.length > 0 ? store.heroSlides : heroSlides
  const displayPackages = store.packages.length > 0 ? store.packages : allPackages
  const displayStays = store.stays.length > 0 ? store.stays : hotelStays
  const homePackages = [...displayPackages].sort((left, right) => Number(!!right.featured) - Number(!!left.featured)).slice(0, 3)

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

  const scrollSocial = (direction: 'left' | 'right') => {
    if (socialTrackRef.current) {
      socialTrackRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      })
    }
  }

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
      {/* Hero Carousel Section */}
      <div className="shell-wide relative home-hero-frame">
        <section className="hero" aria-label="Featured journeys">
          <div className="hero-track" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
            {slides.map((slide, index) => (
              <article
                className="hero-slide"
                key={slide.location}
                aria-hidden={heroIndex !== index}
                inert={heroIndex !== index}
                style={{ '--hero-image': `url(${JSON.stringify(slide.image)})` } as CSSProperties}
              >
                <div className="hero-content">
                  <span className="eyebrow keka-fade-1">
                    <Icon name="sparkle" size={15} /> {slide.eyebrow}
                  </span>
                  <h1 className="text-white mt-4 keka-fade-2 font-inter-tight font-extrabold tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-[#edf7f4] mt-5 leading-relaxed keka-fade-3 text-base sm:text-lg">
                    {slide.copy}
                  </p>
                  <div className="hero-actions mt-8 flex items-center gap-4 keka-fade-4">
                    <button
                      onClick={() => navigate(slide.actionRoute as RouteName)}
                      className="hero-action-primary px-6 py-3 rounded-full bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#ef4934]/30 active:scale-95 transition-all"
                    >
                      <span className="hidden md:inline">Explore This Journey</span>
                      <span className="md:hidden">Explore trip</span>
                      <Icon name="arrow" size={16} />
                    </button>
                    <button
                      onClick={() => navigate('packages')}
                      className="hero-action-secondary px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm active:scale-95 transition-all"
                    >
                      <span className="hidden md:inline">View All Holidays</span>
                      <span className="md:hidden">All holidays</span>
                    </button>
                  </div>
                </div>
                <div className="hero-note">
                  <span>Featured Journey</span>
                  <strong>{slide.location}</strong>
                </div>
              </article>
            ))}
          </div>
          {slides.length > 1 && (
            <div className="hero-controls">
              <div className="hero-dots">
                {slides.map((slide, index) => (
                  <button
                    key={slide.location}
                    type="button"
                    className={heroIndex === index ? 'active' : ''}
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Show slide ${index + 1}`}
                    aria-current={heroIndex === index ? 'true' : undefined}
                  />
                ))}
              </div>
              <div className="hero-arrows">
                <button
                  type="button"
                  className="hero-arrow hero-arrow-left"
                  onClick={() => moveHero(-1)}
                  aria-label="Previous featured journey"
                >
                  <Icon name="chevron" />
                </button>
                <button
                  type="button"
                  className="hero-arrow hero-arrow-right"
                  onClick={() => moveHero(1)}
                  aria-label="Next featured journey"
                >
                  <Icon name="chevron" />
                </button>
              </div>
            </div>
          )}
        </section>
        <TripInquiry
          isOpen={isHeroInquiryOpen}
          onClose={onCloseHeroInquiry}
          launcherRef={inquiryLauncherRef}
          initialDestination={slides[heroIndex]?.location}
        />
      </div>

      {/* Floating Dynamic Search Widget */}
      <section className="search-wrap shell">
        <div className="search-panel">
          <div className="service-tabs" role="tablist" aria-label="Booking type">
            {[
              { name: 'Holidays', icon: 'compass' as const },
              { name: 'Stays', icon: 'hotel' as const },
              { name: 'Road trips', icon: 'car' as const },
            ].map((service) => (
              <button
                key={service.name}
                role="tab"
                aria-selected={activeService === service.name}
                onClick={() => setActiveService(service.name)}
                className={activeService === service.name ? 'active' : ''}
              >
                <Icon name={service.icon} size={19} /> {service.name}
              </button>
            ))}
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <label>
              <span>Where to?</span>
              <span className="input-row">
                <Icon name="pin" size={19} />
                <input
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  placeholder="Kashmir, Kerala, Rajasthan..."
                />
              </span>
            </label>
            <label>
              <span>When?</span>
              <span className="input-row">
                <Icon name="calendar" size={19} />
                <input
                  type="text"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Travel dates"
                />
              </span>
            </label>
            <label>
              <span>Travellers</span>
              <span className="input-row">
                <Icon name="user" size={19} />
                <select
                  value={searchTravellers}
                  onChange={(e) => setSearchTravellers(e.target.value)}
                >
                  <option>1 adult</option>
                  <option>2 adults</option>
                  <option>Family of 4</option>
                  <option>Group of 6+</option>
                </select>
              </span>
            </label>
            <button className="search-button" type="submit">
              <Icon name="search" size={20} />
              <span>Explore</span>
            </button>
          </form>
        </div>
        <WhatsAppFloat placement="mobile-inline" />
      </section>

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
                <span>India, beautifully explored</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-[#072f2b] tracking-tight font-normal">
                Trending destinations
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl leading-relaxed">
                Six remarkable places curated for immersive discovery. Each one designed as a deep journey, not a tourist checklist.
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
              {store.destinations.filter((destination) => destination.isTrending !== false).map((destination) => {
                const isSaved = saved.includes(destination.city)
                return (
                  <article
                    className="destination-card group cursor-pointer"
                    key={destination.city}
                    onClick={() => navigate(`destination/${destination.slug}` as RouteName)}
                  >
                    <img
                      src={destination.image}
                      alt={`${destination.city}, ${destination.country}`}
                    />
                    <div className="destination-scrim" />

                    {/* Top Arch Center: State & City Title (Rajasthan Fort Window style) */}
                    <div className="absolute top-10 inset-x-5 z-10 text-center pointer-events-none">
                      <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#ffd0c7] drop-shadow-sm mb-0.5">
                        {destination.country}
                      </p>
                      <h3 className="font-serif text-[28px] font-normal text-white leading-tight drop-shadow-md group-hover:text-[#ffd0c7] transition-colors">
                        {destination.city}
                      </h3>
                    </div>

                    {/* Top Right: Wishlist Saved Heart Button - perfectly placed on arch shoulder */}
                    <button
                      className={`absolute top-[48px] right-3.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                        isSaved
                          ? 'bg-[#ef4934] text-white shadow-[#ef4934]/40 scale-105'
                          : 'bg-white/90 hover:bg-white text-[#072f2b] hover:text-[#ef4934] backdrop-blur-sm'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleSave(destination.city)
                        onToast(
                          isSaved
                            ? `Removed ${destination.city} from saved.`
                            : `Saved ${destination.city} to your wishlist!`
                        )
                      }}
                      aria-label={`Save ${destination.city}`}
                    >
                      <Icon
                        name="heart"
                        size={15}
                        className={isSaved ? 'fill-white text-white' : ''}
                      />
                    </button>

                    {/* Bottom Content Area */}
                    <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end">
                      {/* Google Verified Rating Badge */}
                      <div className="mb-2.5">
                        <GoogleVerifiedBadge
                          rating={destination.googleRating}
                          reviewsCount={destination.googleReviewsCount}
                          mapsUrl={destination.googleMapsUrl}
                          size="sm"
                          className="bg-white/95 text-slate-800 shadow-sm"
                        />
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-white/70 mb-0.5">
                            Journeys from
                          </span>
                          <strong className="text-white text-base font-bold font-sans">
                            {formatPrice(destination.priceNum, currency)}
                          </strong>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-[#ef4934] text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-[#072f2b] transition-all shadow-md">
                          <Icon name="arrow" size={16} />
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

      {/* Crazy Specials Section */}
      <section className="specials-section shell section">
        <div className="section-heading">
          <div>
            <span className="kicker">Limited seasonal departures</span>
            <h2>Crazy Specials & Offers</h2>
          </div>
          <button onClick={() => navigate('offers')} className="section-link">
            See all offers <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="specials-grid">
          <article
            className="special-card special-japan"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(22,38,34,.82), rgba(22,38,34,.08)), url(${kashmirImage})`,
            }}
          >
            <span>April departures · Limited season</span>
            <h3>Kashmir in full bloom</h3>
            <p>6 days of tulip gardens, houseboat evenings and mountain air.</p>
            <strong>From {formatPrice(36800, currency)}</strong>
            <button onClick={() => navigate('destination/srinagar')}>
              See the journey <Icon name="arrow" size={16} />
            </button>
          </article>

          <article
            className="special-card special-spiritual"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,39,35,.88), rgba(6,39,35,.12)), url(${socialHimachal})`,
            }}
          >
            <span>September departures</span>
            <h3>High roads of Ladakh</h3>
            <p>Monasteries, mountain passes and nights beneath a spectacular sky.</p>
            <button onClick={() => navigate('road-trips')}>
              Explore the route <Icon name="arrow" size={16} />
            </button>
          </article>

          <article
            className="special-card special-small special-small-photo special-build"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,39,35,.8), rgba(6,39,35,.14)), url(https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=700&q=85)`,
            }}
          >
            <Icon name="sparkle" size={28} />
            <h3>Monsoon in Kerala</h3>
            <p>Tea-country mist, restorative stays and slow backwater days.</p>
            <button
              onClick={() => navigate('destination/munnar')}
              aria-label="Build your itinerary"
            >
              <Icon name="arrow" size={18} />
            </button>
          </article>

          <article
            className="special-card special-small special-small-photo special-reward"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,39,35,.82), rgba(6,39,35,.12)), url(https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=85)`,
            }}
          >
            <Icon name="wallet" size={28} />
            <h3>Rajasthan by road</h3>
            <p>Palace stays, craft towns and golden desert evenings.</p>
            <button onClick={() => navigate('road-trips')} aria-label="See road trips">
              <Icon name="arrow" size={18} />
            </button>
          </article>
        </div>
      </section>

      {/* Journeys With Soul (Packages Showcase) */}
      <section className="journeys">
        <div className="shell section">
          <div className="section-heading light">
            <div>
              <span className="kicker">Made to linger</span>
              <h2>Journeys with a little more soul</h2>
            </div>
            <button onClick={() => navigate('packages')} className="text-link">
              View all {displayPackages.length} journeys <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="package-grid">
            {homePackages.map((trip) => (
              <article className="package-card" key={trip.id}>
                <div className="package-image">
                  <img src={trip.image} alt={trip.place} />
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
                    <span>
                      from <strong>{formatPrice(trip.priceNum, currency)}</strong> / person
                    </span>
                    <button
                      onClick={() => navigate(`package/${trip.id}` as RouteName)}
                      aria-label={`View ${trip.title}`}
                    >
                      <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Board Feature (Hampi) */}
      <section className="board-section">
        <div className="shell section">
          <div className="section-heading">
            <div>
              <span className="kicker">Selected with local experts</span>
              <h2>Travel boards recommend</h2>
            </div>
            <button onClick={() => navigate('stories')} className="section-link">
              View all stories <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="board-feature">
            <img
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=88"
              alt="Ancient stone landscape in Hampi"
            />
            <div className="board-overlay">
              <span>In partnership with local storytellers</span>
              <h3>Hampi, beyond the monuments</h3>
              <p>Riverside walks, ancient stories and boulder-lit sunsets—discover Karnataka at a gentler pace.</p>
              <button onClick={() => navigate('destination/hampi')}>
                Explore Hampi <Icon name="arrow" size={17} />
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
              <span className="kicker">Stay somewhere memorable</span>
              <h2>Explore boutique hotel stays</h2>
            </div>
            <button onClick={() => navigate('stays')} className="section-link">
              Browse all stays <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="stays-grid">
            {displayStays.map((stay) => (
              <article className="stay-card" key={stay.id}>
                <img src={stay.image} alt={`${stay.type} in ${stay.city}`} />
                <div />
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
            <span className="kicker">Why travel with Crazy Tours Travels</span>
            <h2>Expertly planned. Genuinely personal.</h2>
          </div>
        </div>
        <div className="why-stage">
          <img
            src="https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85"
            alt="Travellers beginning a new journey"
          />
          <article className="why-card why-one">
            <span>01</span>
            <h3>Human expertise</h3>
            <p>Real travel designers who listen before they plan. No auto-generated templates.</p>
          </article>
          <article className="why-card why-two">
            <span>02</span>
            <h3>Built around you</h3>
            <p>Your pace, preferences and non-negotiables come first.</p>
          </article>
          <article className="why-card why-three">
            <span>03</span>
            <h3>Here when needed</h3>
            <p>Reliable 24/7 on-trip concierge support from first departure to your return home.</p>
          </article>
          <article className="why-card why-four">
            <span>04</span>
            <h3>Clear and considered</h3>
            <p>Certified heritage properties and transparent trip pricing with zero hidden fees.</p>
          </article>
        </div>
      </section>

      {/* Testimonials & Stats */}
      <section className="love-section">
        <div className="shell section">
          <div className="love-heading">
            <span className="kicker">The Crazy Tours Travels difference</span>
            <h2>Why travellers return to us</h2>
          </div>
          <div className="stats-row">
            <div>
              <strong>18</strong>
              <span>years exploring</span>
            </div>
            <div>
              <strong>28</strong>
              <span>states explored</span>
            </div>
            <div>
              <strong>24k</strong>
              <span>journeys planned</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>average traveller rating</span>
            </div>
          </div>
          <div className="review-track">
            {reviews.map((review) => (
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

      {/* Social Moments Stories & Instagram Reels Video Section */}
      <section className="social-section" id="instagram-reels">
        <div className="shell social-layout">
          <div className="social-intro">
            <span className="kicker">Follow @crazytourstravels</span>
            <h2>Small moments.<br />Real customer stories.</h2>
            <p>
              Live notes and customer video reviews from travelers across Kashmir, Kerala, Rajasthan, Ladakh, and beyond.
              Watch them run simultaneously or click any reel to experience full sound and reviews.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="https://www.instagram.com/crazytourstravels/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
              >
                <Icon name="instagram" size={15} />
                <span>Follow on Instagram</span>
              </a>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollSocial('left')}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
                  aria-label="Previous reel"
                >
                  <Icon name="chevron" size={15} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSocial('right')}
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
                  aria-label="Next reel"
                >
                  <Icon name="chevron" size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="social-track" ref={socialTrackRef}>
            {(store.reels && store.reels.length > 0 ? store.reels : instagramReels).map(
              (reel, index) => (
                <ReelVideoCard
                  key={reel.id || index}
                  reel={reel}
                  index={index}
                  onOpen={(r, idx) => onOpenStory(r, idx)}
                />
              )
            )}
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
