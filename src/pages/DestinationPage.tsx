import React, { useState } from 'react'
import { CatalogPhotoCarousel } from '../components/CatalogPhotoCarousel'
import { PackageCategoryCards } from '../components/PackageCategoryCards'
import { getDestinationVideo } from '../data/destinationVideos'
import { Currency, DestinationItem, PackageCategory, PackageItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge, isGoogleMapsLink } from '../components/GoogleVerifiedBadge'
import { allPackages, formatPrice } from '../data/travelData'

interface DestinationPageProps {
  destination: DestinationItem
  packages?: PackageItem[]
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  saved: boolean
  onToggleSave: () => void
  currency: Currency
}

const CATEGORY_TO_CUSTOM_STYLE: Record<PackageCategory, string> = {
  Couple: 'Romantic / Honeymoon',
  Family: 'Family with Kids',
  Bachelors: 'Friends & Bachelors Group',
  Adventure: 'Adventure & Mountain Trails',
}

export function DestinationPage({
  destination,
  packages = allPackages,
  navigate,
  onBook,
  saved,
  onToggleSave,
  currency,
}: DestinationPageProps) {
  const [isVideoMuted, setIsVideoMuted] = useState(true)
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
  const hasCulture = destination.clothingAdvice || destination.culturalNotes || destination.mustTryFood?.length
  const hasGoogleReviews = !!(destination.googleRating && destination.googleReviewsCount && isGoogleMapsLink(destination.googleMapsUrl))
  const hasExperiences = destination.highlights.length > 0 || !!destination.keyAttractions?.length
  const sections = [
    ['packages', 'Packages', true],
    ['overview', 'Overview', true],
    ['culture', 'Culture & cuisine', hasCulture],
    ['experiences', 'Signature moments', hasExperiences],
  ] as const

  const handlePlanCustom = (category?: PackageCategory) => {
    if (category) {
      try {
        window.sessionStorage.setItem('ct_custom_style', CATEGORY_TO_CUSTOM_STYLE[category])
      } catch {
        // Ignore storage restrictions
      }
    }
    navigate(`custom-trip/${destination.slug}`)
  }

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
            <span className="eyebrow">{destVideo.locationBadge || destination.country || destination.state} · Handcrafted Journey</span>
            <h1>{destination.city}</h1>
            <p>{destination.tagline || destVideo.tagline}</p>
          </div>

          <div className="destination-hero-meta z-20">
            {(destination.duration || destination.recommendedStayDays) && <span>{destination.duration || destination.recommendedStayDays}</span>}
            {(destination.season || destination.peakSeason) && <span>{destination.season || destination.peakSeason}</span>}
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
            <span className="eyebrow">{destination.country || destination.state} · Curated Destination Guide</span>
            <h1>{destination.city}</h1>
            <p>{destination.tagline}</p>
          </div>
          <div className="destination-hero-meta">
            {(destination.duration || destination.recommendedStayDays) && <span>{destination.duration || destination.recommendedStayDays}</span>}
            {(destination.season || destination.peakSeason) && <span>{destination.season || destination.peakSeason}</span>}
            <span>From {formatPrice(destination.priceNum, currency)}</span>
          </div>
        </CatalogPhotoCarousel>
      )}

      {/* Sub Navigation Bar */}
      <nav className="destination-subnav mb-10 sticky top-0 z-30 shadow-xs bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="shell flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-semibold overflow-x-auto">
            {sections.filter(([, , visible]) => visible).map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(event) => {
                event.preventDefault()
                document.getElementById(id)?.scrollIntoView({ block: 'start' })
              }} className="whitespace-nowrap hover:text-[#ef4934]">{label}</a>
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
        onPlanCustom={handlePlanCustom}
      />

      {/* Overview Section */}
      <section className="shell destination-intro mb-16 scroll-mt-40" id="overview">
        <div>
          <span className="kicker">Why we love it</span>
          <h2>{destination.description}</h2>
        </div>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Explore the highlights of {destination.city} and ask our team to help plan a trip around what interests you.
          </p>
          <p>
            Every detail can be shaped around your preferences, from the character of your stay to how active you want each day to feel.
          </p>
          <div className="pt-2 text-xs text-gray-500 space-y-1">
            {season && <p><strong>Best time to visit</strong> {season}</p>}
            {destination.idealFor && <p><strong>Ideal for</strong> {destination.idealFor}</p>}
          </div>
        </div>
      </section>

      {!!hasCulture && (
        <section className="shell mb-16 scroll-mt-40" id="culture">
          <h2 className="mb-6 font-serif text-3xl text-[#072f2b]">Culture & cuisine</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {destination.clothingAdvice && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Clothing advice</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{destination.clothingAdvice}</p>
              </div>
            )}
            {destination.culturalNotes && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Cultural notes</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{destination.culturalNotes}</p>
              </div>
            )}
            {!!destination.mustTryFood?.length && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">Food to try</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {destination.mustTryFood.map((dish, index) => <li key={index}>{dish}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Signature Experiences */}
      {hasExperiences && <section className="destination-experiences shell mb-16 scroll-mt-40" id="experiences">
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
              <div><h3>{name}</h3>{type && <p>{type}</p>}</div>
            </article>
          ))}
        </div>
      </section>}

      {hasGoogleReviews && (
        <section className="shell mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 text-white md:p-8">
            <h2 className="font-serif text-2xl text-white">Reviews on Google Maps</h2>
            <GoogleVerifiedBadge rating={destination.googleRating} reviewsCount={destination.googleReviewsCount} mapsUrl={destination.googleMapsUrl} />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="destination-final-cta">
        <div className="shell">
          <span className="kicker">Your journey starts here</span>
          <h2>Let’s make {destination.city} yours.</h2>
          <p>
            Share what you love, how you travel, and when you want to go. We’ll take care of the rest.
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
