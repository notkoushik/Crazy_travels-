import React, { useEffect, useState } from 'react'
import { CatalogPhoto } from '../components/CatalogPhoto'
import { CatalogPhotoCarousel } from '../components/CatalogPhotoCarousel'
import {
  CategoryVideoReviews,
  PackageCategoryCards,
} from '../components/PackageCategoryCards'
import { getDestinationVideo } from '../data/destinationVideos'
import {
  Currency,
  DestinationItem,
  InstagramReelItem,
  PackageCategory,
  PackageItem,
  RouteName,
} from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge, isGoogleMapsLink } from '../components/GoogleVerifiedBadge'
import { allPackages, formatPrice, instagramReels } from '../data/travelData'
import { useDynamicStore } from '../services/dataStore'

interface DestinationPageProps {
  destination: DestinationItem
  packages?: PackageItem[]
  reels?: InstagramReelItem[]
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  onOpenStory?: (
    story: InstagramReelItem,
    index?: number,
    filteredReels?: InstagramReelItem[],
  ) => void
  saved: boolean
  onToggleSave: () => void
  currency: Currency
}

export function DestinationPage({
  destination,
  packages = allPackages,
  reels,
  navigate,
  onBook,
  onOpenStory,
  saved,
  onToggleSave,
  currency,
}: DestinationPageProps) {
  const store = useDynamicStore()
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | null>(null)

  useEffect(() => {
    setSelectedCategory(null)
  }, [destination.slug])

  const displayReels =
    reels && reels.length > 0
      ? reels
      : store.reels.length > 0
        ? store.reels
        : instagramReels

  const destVideo = destination.videoUrl
    ? {
        videoUrl: destination.videoUrl,
        posterUrl: destination.posterUrl || destination.image,
        title: destination.city,
        tagline: destination.tagline,
        locationBadge: destination.state || destination.country || 'Verified Destination',
      }
    : getDestinationVideo(destination.slug || destination.city)
  const season = destination.bestTimeToVisit || destination.peakSeason || destination.season
  const hasCulture =
    destination.clothingAdvice || destination.culturalNotes || destination.mustTryFood?.length
  const hasGoogleReviews = !!(
    destination.googleRating &&
    destination.googleReviewsCount &&
    isGoogleMapsLink(destination.googleMapsUrl)
  )
  const hasExperiences =
    destination.highlights.length > 0 || !!destination.keyAttractions?.length
  const sections = [
    ['packages', 'Packages', true],
    ['category-video-reviews', 'Video reviews', selectedCategory !== null],
    ['overview', `About ${destination.city}`, true],
    ['culture', 'Culture & cuisine', hasCulture],
    ['experiences', 'Signature moments', hasExperiences],
  ] as const

  return (
    <main className="destination-page bg-[#fbfaf7] pb-24 font-inter">
      {/* Breadcrumb */}
      <div className="shell py-4 flex items-center gap-2 text-xs text-gray-500">
        <button onClick={() => navigate('home')} className="hover:text-[#ef4934]">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('packages')} className="hover:text-[#ef4934]">
          Destinations
        </button>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{destination.city}</span>
      </div>

      {/* Cinematic Destination Hero Banner with Live Video */}
      {destVideo ? (
        <div className="shell-wide mb-6 relative rounded-3xl overflow-hidden destination-detail-hero min-h-[460px] md:min-h-[540px] shadow-xl group">
          <video
            src={destVideo.videoUrl}
            poster={destVideo.posterUrl || destination.image}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="destination-detail-shade absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

          {/* Top Bar: Live Video Tag, Audio Control, Rating & Save */}
          <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20 shadow-md">
              <Icon name="sparkle" size={13} className="text-amber-400" />
              <span>Live Journey Video Preview</span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-transform hover:scale-110 shadow-lg border border-white/20"
                aria-label={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
                title={isVideoMuted ? 'Unmute audio' : 'Mute audio'}
              >
                <Icon name={isVideoMuted ? 'volumeX' : 'volume'} size={18} />
              </button>

              <GoogleVerifiedBadge
                rating={destination.googleRating}
                reviewsCount={destination.googleReviewsCount}
                mapsUrl={destination.googleMapsUrl}
                size="md"
                className="shadow-lg"
              />

              <button
                onClick={onToggleSave}
                className={`p-3 rounded-full backdrop-blur-md transition-colors shadow-lg ${
                  saved ? 'bg-[#ef4934] text-white' : 'bg-white/90 hover:bg-white text-gray-800'
                }`}
                aria-label="Save destination"
              >
                <Icon name="heart" size={20} className={saved ? 'fill-white' : ''} />
              </button>
            </div>
          </div>

          {/* Bottom Title & Tagline */}
          <div className="destination-detail-title z-20">
            <span className="eyebrow">
              {destVideo.locationBadge || destination.country || destination.state} · Handcrafted Journey
            </span>
            <h1>{destination.city}</h1>
            <p>{destination.tagline || destVideo.tagline}</p>
          </div>

          <div className="destination-hero-meta z-20">
            {(destination.duration || destination.recommendedStayDays) && (
              <span>{destination.duration || destination.recommendedStayDays}</span>
            )}
            {(destination.season || destination.peakSeason) && (
              <span>{destination.season || destination.peakSeason}</span>
            )}
            <span>From {formatPrice(destination.priceNum, currency)}</span>
          </div>
        </div>
      ) : (
        <CatalogPhotoCarousel
          key={destination.slug}
          title={destination.city}
          cover={destination.image}
          gallery={destination.gallery}
          className="shell-wide mb-6"
          frameClassName="destination-detail-hero"
        >
          <div className="destination-detail-shade" />

          {/* Top Right Save & Rating */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <GoogleVerifiedBadge
              rating={destination.googleRating}
              reviewsCount={destination.googleReviewsCount}
              mapsUrl={destination.googleMapsUrl}
              size="md"
              className="shadow-lg"
            />
            <button
              onClick={onToggleSave}
              className={`p-3 rounded-full backdrop-blur-md transition-colors shadow-lg ${
                saved ? 'bg-[#ef4934] text-white' : 'bg-white/90 hover:bg-white text-gray-800'
              }`}
              aria-label="Save destination"
            >
              <Icon name="heart" size={20} className={saved ? 'fill-white' : ''} />
            </button>
          </div>

          <div className="destination-detail-title">
            <span className="eyebrow">
              {destination.country || destination.state} · Curated Destination Guide
            </span>
            <h1>{destination.city}</h1>
            <p>{destination.tagline}</p>
          </div>
          <div className="destination-hero-meta">
            {(destination.duration || destination.recommendedStayDays) && (
              <span>{destination.duration || destination.recommendedStayDays}</span>
            )}
            {(destination.season || destination.peakSeason) && (
              <span>{destination.season || destination.peakSeason}</span>
            )}
            <span>From {formatPrice(destination.priceNum, currency)}</span>
          </div>
        </CatalogPhotoCarousel>
      )}

      {/* Sub Navigation Bar */}
      <nav className="destination-subnav mb-10 sticky top-0 z-30 shadow-xs bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="shell flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-semibold overflow-x-auto">
            {sections
              .filter(([, , visible]) => visible)
              .map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(event) => {
                    event.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ block: 'start' })
                  }}
                  className="whitespace-nowrap hover:text-[#ef4934]"
                >
                  {label}
                </a>
              ))}
          </div>
          <button
            onClick={() => onBook(`Plan ${destination.city} Journey`, destination.priceNum)}
            className="px-6 py-2 rounded-full bg-[#ef4934] text-white text-xs font-bold hover:bg-[#df3a25] shadow-md shadow-[#ef4934]/30 shrink-0"
          >
            Plan This Journey
          </button>
        </div>
      </nav>

      {/* Explore Packages by Category (Couple / Family / Bachelors / conditional Adventure) */}
      <PackageCategoryCards
        destination={destination}
        packages={packages}
        currency={currency}
        onOpenPackage={(packageId) => navigate(`package/${packageId}`)}
        onCategoryChange={setSelectedCategory}
      />

      {/* Category-Matched Traveler Video Reviews directly below the packages */}
      {selectedCategory !== null && (
        <CategoryVideoReviews
          category={selectedCategory}
          reels={displayReels}
          onOpenReel={(reel, index, filteredReels) =>
            onOpenStory?.(reel, index, filteredReels)
          }
          subtitle={`Real ${selectedCategory.toLowerCase()} traveler stories in ${destination.city} & Himachal. Tap any reel to play in full screen.`}
        />
      )}

      {/* About the Destination Section */}
      <section className="shell my-14 scroll-mt-40" id="overview">
        <div className="overflow-hidden rounded-3xl border border-[#072f2b]/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ef4934]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#b83222]">
                  <Icon name="pin" size={12} className="text-[#ef4934]" />
                  <span>
                    About {destination.city} · {destination.state || destination.country || 'Himachal Pradesh'}
                  </span>
                </span>
                <h2 className="font-serif text-3xl font-semibold leading-[1.16] tracking-tight text-[#072f2b] sm:text-4xl">
                  {destination.tagline || `Discover ${destination.city}`}
                </h2>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  {destination.description}
                </p>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {season && (
                  <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0b4941]">
                      <Icon name="calendar" size={14} className="text-[#ef4934]" />
                      <span>Best time to visit</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">{season}</p>
                  </div>
                )}

                {(destination.idealFor || destination.recommendedStayDays || destination.duration) && (
                  <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0b4941]">
                      <Icon name="user" size={14} className="text-[#ef4934]" />
                      <span>Ideal pace &amp; travelers</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">
                      {[destination.recommendedStayDays || destination.duration, destination.idealFor]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                )}

                {(destination.nearestAirport || destination.nearestRailway) && (
                  <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0b4941]">
                      <Icon name="car" size={14} className="text-[#ef4934]" />
                      <span>Connectivity &amp; arrival</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">
                      {destination.nearestAirport || destination.nearestRailway}
                    </p>
                    {destination.nearestAirport && destination.nearestRailway && (
                      <p className="mt-1 text-xs text-slate-500">Rail: {destination.nearestRailway}</p>
                    )}
                  </div>
                )}

                {(destination.avgTemp || destination.networkCoverage) && (
                  <div className="rounded-2xl border border-slate-100 bg-[#fbfaf7] p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0b4941]">
                      <Icon name="compass" size={14} className="text-[#ef4934]" />
                      <span>Climate &amp; mobile network</span>
                    </div>
                    {destination.avgTemp && (
                      <p className="mt-1.5 text-sm font-medium text-slate-800">
                        Typical temperatures: {destination.avgTemp}
                      </p>
                    )}
                    {destination.networkCoverage && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {destination.networkCoverage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <CatalogPhoto
                    src={destination.gallery?.[1] || destination.gallery?.[0] || destination.image}
                    alt={`${destination.city} mountain landscape`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffd0c7]">
                    Curated in every circuit
                  </p>
                  <p className="mt-1 font-serif text-xl font-medium">
                    Personal cab, handpicked stays &amp; 24/7 Telugu concierge
                  </p>
                </div>
              </div>

              {!!destination.keyAttractions?.length && (
                <div className="rounded-2xl border border-[#072f2b]/10 bg-[#fbfaf7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0b4941]">
                    Must-visit places in {destination.city}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {destination.keyAttractions.map((spot) => (
                      <span
                        key={spot.name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#072f2b]/15 bg-white px-3 py-1 text-xs font-medium text-[#072f2b]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ef4934]" />
                        {spot.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {!!hasCulture && (
        <section className="shell mb-16 scroll-mt-40" id="culture">
          <h2 className="mb-6 font-serif text-3xl text-[#072f2b]">Culture &amp; cuisine</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {destination.clothingAdvice && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Clothing advice</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                  {destination.clothingAdvice}
                </p>
              </div>
            )}
            {destination.culturalNotes && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Cultural notes</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                  {destination.culturalNotes}
                </p>
              </div>
            )}
            {!!destination.mustTryFood?.length && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Food to try</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {destination.mustTryFood.map((dish, index) => (
                    <li key={index}>{dish}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Signature Experiences */}
      {hasExperiences && (
        <section className="destination-experiences shell mb-16 scroll-mt-40" id="experiences">
          <div className="destination-experience-lead">
            <span className="kicker">Signature moments</span>
            <h2>The experiences you’ll remember</h2>
          </div>
          <div className="experience-grid">
            {destination.highlights.map((highlight, index) => (
              <article key={`${highlight}-${index}`}>
                <Icon name="compass" size={20} className="mt-1 shrink-0 text-[#0b4941]" />
                <div>
                  <h3>{highlight}</h3>
                </div>
              </article>
            ))}
            {destination.keyAttractions?.map(({ name, type }, index) => (
              <article key={`${name}-${index}`}>
                <Icon name="pin" size={20} className="mt-1 shrink-0 text-[#0b4941]" />
                <div>
                  <h3>{name}</h3>
                  {type && <p>{type}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {hasGoogleReviews && (
        <section className="shell mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 text-white md:p-8">
            <h2 className="font-serif text-2xl text-white">Reviews on Google Maps</h2>
            <GoogleVerifiedBadge
              rating={destination.googleRating}
              reviewsCount={destination.googleReviewsCount}
              mapsUrl={destination.googleMapsUrl}
            />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="destination-final-cta">
        <div className="shell">
          <span className="kicker">Your journey starts here</span>
          <h2>Let’s make {destination.city} yours.</h2>
          <p>
            Share what you love, how you travel, and when you want to go. We’ll take care of the
            rest.
          </p>
          <button
            onClick={() => onBook(`Plan My ${destination.city} Trip`, destination.priceNum)}
            className="flex items-center gap-2 mx-auto"
          >
            <span>Plan my {destination.city} trip</span>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </main>
  )
}
