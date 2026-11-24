import React, { type CSSProperties, FormEvent, useEffect, useRef, useState } from 'react'
import { CatalogPhoto } from '../components/CatalogPhoto'
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
  reviews,
  services,
  socialStories,
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

      {/* Crazy Specials Section */}
      <section className="specials-section shell section">
        <div className="section-heading">
          <div>
            <span className="kicker">{headers.specials?.kicker || 'Limited seasonal departures'}</span>
            <h2>{headers.specials?.title || 'Crazy Specials & Offers'}</h2>
          </div>
          <button onClick={() => navigate('offers')} className="section-link">
            See all offers <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="specials-grid">
          <article
            className="special-card special-japan"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(22,38,34,.82), rgba(22,38,34,.08)), url(${special1.image || kashmirImage})`,
            }}
          >
            <span>{special1.badge}</span>
            <h3>{special1.title}</h3>
            <p>{special1.description}</p>
            {special1.priceNum ? <strong>From {formatPrice(special1.priceNum, currency)}</strong> : null}
            <button onClick={() => navigate(special1.actionRoute as RouteName)}>
              {special1.actionLabel || 'See the journey'} <Icon name="arrow" size={16} />
            </button>
          </article>

          <article
            className="special-card special-spiritual"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,39,35,.88), rgba(6,39,35,.12)), url(${special2.image || socialHimachal})`,
            }}
          >
            <span>{special2.badge}</span>
            <h3>{special2.title}</h3>
            <p>{special2.description}</p>
            {special2.priceNum ? <strong>From {formatPrice(special2.priceNum, currency)}</strong> : null}
            <button onClick={() => navigate(special2.actionRoute as RouteName)}>
              {special2.actionLabel || 'Explore the route'} <Icon name="arrow" size={16} />
            </button>
          </article>

          <article
            className="special-card special-small special-small-photo special-build"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,39,35,.8), rgba(6,39,35,.14)), url(${special3.image})`,
            }}
          >
            <Icon name="sparkle" size={28} />
            <h3>{special3.title}</h3>
            <p>{special3.description}</p>
            <button
              onClick={() => navigate(special3.actionRoute as RouteName)}
              aria-label={special3.actionLabel || 'Build your itinerary'}
            >
              <Icon name="arrow" size={18} />
            </button>
          </article>

          <article
            className="special-card special-small special-small-photo special-reward"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,39,35,.82), rgba(6,39,35,.12)), url(${special4.image})`,
            }}
          >
            <Icon name="wallet" size={28} />
            <h3>{special4.title}</h3>
            <p>{special4.description}</p>
            <button onClick={() => navigate(special4.actionRoute as RouteName)} aria-label={special4.actionLabel || 'See road trips'}>
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
              <span className="kicker">{headers.soul?.kicker || 'Made to linger'}</span>
              <h2>{headers.soul?.title || 'Journeys with a little more soul'}</h2>
            </div>
            <button onClick={() => navigate('packages')} className="text-link">
              View all {displayPackages.length} journeys <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="package-grid">
            {homePackages.map((trip) => (
              <article className="package-card" key={trip.id}>
                <div className="package-image">
                  <CatalogPhoto src={trip.image} alt={trip.place} />
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

      {/* Travel Board Feature */}
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

      {/* Social Moments Stories & Instagram Reels Video Section */}
      {store.reels.length > 0 && <section className="social-section" id="instagram-reels">
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
            {store.reels.map(
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
      </section>}

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
