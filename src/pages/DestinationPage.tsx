import React from 'react'
import { Currency, DestinationItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge } from '../components/GoogleVerifiedBadge'
import { formatPrice } from '../data/travelData'

interface DestinationPageProps {
  destination: DestinationItem
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  saved: boolean
  onToggleSave: () => void
  currency: Currency
}

export function DestinationPage({
  destination,
  navigate,
  onBook,
  saved,
  onToggleSave,
  currency,
}: DestinationPageProps) {
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

      {/* Hero Banner */}
      <section className="destination-detail-hero shell-wide relative rounded-3xl overflow-hidden shadow-xl mb-6">
        <img
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          className="w-full h-full object-cover"
        />
        <div className="destination-detail-shade" />

        {/* Top Right Save & Rating */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <GoogleVerifiedBadge
            rating={destination.googleRating || 4.9}
            reviewsCount={destination.googleReviewsCount || 1420}
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
          <span>{destination.duration || `${destination.recommendedStayDays || 5} Days`}</span>
          <span>{destination.season || destination.peakSeason}</span>
          <span>From {formatPrice(destination.priceNum, currency)}</span>
        </div>
      </section>

      {/* Sub Navigation Bar */}
      <nav className="destination-subnav mb-10 sticky top-0 z-30 shadow-xs bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="shell flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-semibold">
            <a href="#overview" className="hover:text-[#ef4934]">Overview</a>
            <a href="#logistics" className="hover:text-[#ef4934]">Travel Logistics</a>
            <a href="#culture" className="hover:text-[#ef4934]">Culture & Cuisine</a>
            <a href="#experiences" className="hover:text-[#ef4934]">Signature Moments</a>
            <a href="#itinerary" className="hover:text-[#ef4934]">Suggested Flow</a>
          </div>
          <button
            onClick={() => onBook(`Plan ${destination.city} Journey`, destination.priceNum)}
            className="px-6 py-2 rounded-full bg-[#ef4934] text-white text-xs font-bold hover:bg-[#df3a25] shadow-md shadow-[#ef4934]/30"
          >
            Plan This Journey
          </button>
        </div>
      </nav>

      {/* Overview Section */}
      <section className="shell destination-intro mb-16" id="overview">
        <div>
          <span className="kicker">Why we love it</span>
          <h2>{destination.description}</h2>
        </div>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Our {destination.city} journeys are designed around the living texture of the place—not a checklist of crowded sights. Expect considered pacing, verified heritage properties, and private local hosts.
          </p>
          <p>
            Every detail can be shaped around your preferences, from the character of your stay to how active you want each day to feel.
          </p>
          <div className="pt-2 text-xs text-gray-500 space-y-1">
            <p><strong>Best Time to Visit:</strong> {destination.bestTimeToVisit || destination.season}</p>
            <p><strong>Ideal For:</strong> {destination.idealFor || 'Couples, Culture & Heritage Enthusiasts'}</p>
          </div>
        </div>
      </section>

      {/* 10-DIMENSION TOURISM LOGISTICS & ESSENTIALS BLUEPRINT */}
      <section className="shell mb-16" id="logistics">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b4941]/10 text-[#0b4941] text-xs font-bold tracking-wider uppercase mb-2">
            <Icon name="compass" size={12} />
            <span>Traveler Practical Blueprint</span>
          </div>
          <h2 className="font-serif text-3xl text-[#072f2b]">
            Arrival Logistics & Climate Insights
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Essential operational details curated by ground concierges to make your journey effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Nearest Airport */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                <Icon name="flight" size={20} />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block">
                Nearest Airport
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {destination.nearestAirport || 'Major Regional Airport'}
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Private chauffeur airport pickup and luggage handling included with luxury packages.
            </p>
          </div>

          {/* Nearest Railway */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Icon name="map" size={20} />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block">
                Nearest Railway
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {destination.nearestRailway || 'Main Central Junction'}
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              High-speed Vande Bharat and express connections with chauffeur station greeting.
            </p>
          </div>

          {/* Climate & Weather */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center mb-3">
                <Icon name="sparkle" size={20} />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block">
                Peak Season & Climate
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {destination.season || destination.peakSeason || 'October to March'}
              </h4>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-mono text-xs font-bold">
                {destination.avgTemp || '18°C – 28°C'}
              </span>
              <span className="text-xs text-gray-500">
                Ideal: {destination.recommendedStayDays || 4} nights
              </span>
            </div>
          </div>

          {/* Permits & Regulatory */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                destination.permitRequired ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                <Icon name="shield" size={20} />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block">
                Entry Permits
              </span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {destination.permitRequired ? 'Permit Required (ILP/PAP)' : 'Unrestricted Entry'}
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {destination.permitDetails || 'Open travel for all Indian citizens and international passport holders.'}
            </p>
          </div>
        </div>
      </section>

      {/* CULTURE, GASTRONOMY & ETIQUETTE BLUEPRINT */}
      <section className="shell mb-16" id="culture">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dress Code */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <span className="text-[11px] font-bold text-[#ef4934] uppercase tracking-wider block">
              What to Pack & Dress Code
            </span>
            <h3 className="font-serif text-xl text-gray-900">Clothing Advice</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {destination.clothingAdvice ||
                'Breathable natural cottons for warm afternoons, comfortable walking shoes for heritage cobblestone steps, and light layers or pashmina shawls for breezy evenings.'}
            </p>
            <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-400 flex items-center gap-1.5">
              <Icon name="user" size={13} />
              <span>Modest attire respected at sacred sites</span>
            </div>
          </div>

          {/* Cultural Etiquette */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <span className="text-[11px] font-bold text-[#0b4941] uppercase tracking-wider block">
              Heritage Respect
            </span>
            <h3 className="font-serif text-xl text-gray-900">Cultural Etiquette</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {destination.culturalNotes ||
                'Remove footwear before sanctums; seek permission before photographing artisans and private rituals; silence mobile devices in historic courtyards.'}
            </p>
            <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-400 flex items-center gap-1.5">
              <Icon name="check" size={13} />
              <span>Certified private local guides provided</span>
            </div>
          </div>

          {/* Gastronomy */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Culinary Heritage
            </span>
            <h3 className="font-serif text-xl text-gray-900">Must-Try Gastronomy</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Curated royal banquet flavors and authentic local epicurean classics:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(destination.mustTryFood && destination.mustTryFood.length > 0
                ? destination.mustTryFood
                : ['Dal Baati Churma', 'Ker Sangri', 'Royal Laal Maas', 'Ghevar']
              ).map((food, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 text-xs font-semibold"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signature Experiences */}
      <section className="destination-experiences shell mb-16" id="experiences">
        <div className="destination-experience-lead">
          <span className="kicker">Signature moments</span>
          <h2>The experiences you’ll remember</h2>
        </div>
        <div className="experience-grid">
          {(destination.highlights || []).map((highlight, index) => (
            <article key={highlight}>
              <span>0{index + 1}</span>
              <div>
                <h3>{highlight}</h3>
                <p>Private, unhurried, and hosted by people who know the region best.</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Google Verified Review Deep-Link Strip */}
      <section className="shell mb-16">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <GoogleVerifiedBadge
                rating={destination.googleRating || 4.9}
                reviewsCount={destination.googleReviewsCount || 1420}
                mapsUrl={destination.googleMapsUrl}
                size="md"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                100% Verified Reviews
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-white">
              Trusted by thousands of genuine travelers on Google Maps
            </h3>
            <p className="text-xs text-slate-300">
              Read transparent, unfiltered traveler feedback, photo reviews, and local guide ratings on Google Maps.
            </p>
          </div>
          <a
            href={destination.googleMapsUrl || 'https://maps.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-all shadow-md flex items-center gap-2 shrink-0 font-inter-tight"
          >
            <span>Inspect Google Reviews</span>
            <Icon name="arrow" size={14} />
          </a>
        </div>
      </section>

      {/* Photo Gallery & Quote */}
      <section className="destination-gallery mb-16">
        <div className="shell">
          <img src={destination.image} alt={`Landscape in ${destination.city}`} />
          <img
            src={
              destination.slug === 'andaman'
                ? 'https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=900&q=85'
                : 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85'
            }
            alt={`Local experience in ${destination.country}`}
          />
          <blockquote>
            “Go slowly enough and the place begins to tell you its own story.”
          </blockquote>
        </div>
      </section>

      {/* Suggested Itinerary */}
      <section className="shell destination-itinerary mb-16" id="itinerary">
        <div className="itinerary-heading">
          <span className="kicker">A beautifully paced plan</span>
          <h2>{destination.duration || `${destination.recommendedStayDays || 5} Days`}, made to feel entirely your own.</h2>
          <p>A suggested flow with room to personalize every day.</p>
        </div>
        <div className="itinerary-days">
          {[
            'Arrive and settle into the rhythm',
            (destination.highlights && destination.highlights[0]) || 'Morning historic walk',
            (destination.highlights && destination.highlights[1]) || 'Scenic countryside journey',
            (destination.highlights && destination.highlights[2]) || 'Local cultural dinner',
            'A final slow morning & departure',
          ].map((day, index) => (
            <article key={day}>
              <span>Day {index + 1}</span>
              <h3>{day}</h3>
              <p>
                {index === 0
                  ? 'A private airport welcome, an easy transfer, and time to arrive properly.'
                  : 'A thoughtfully hosted day with time left open for your own discoveries.'}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Stay Section */}
      <section className="shell destination-stay mb-16" id="stay">
        <div className="destination-stay-image">
          <img src={destination.image} alt={`A handpicked stay in ${destination.city}`} />
        </div>
        <div>
          <span className="kicker">Stay with character</span>
          <h2>Places that belong to the landscape.</h2>
          <p>
            We favour small, soulful stays with a strong sense of place—warm hosts, thoughtful design, and mornings you won’t want to rush.
          </p>
          <ul>
            <li>Breakfast and dinner included</li>
            <li>Personally inspected for character & comfort</li>
            <li>Flexible room upgrade choices available</li>
          </ul>
        </div>
      </section>

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
