import React, { useState } from 'react'
import { CatalogPhoto } from '../components/CatalogPhoto'
import { Currency, PackageItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge } from '../components/GoogleVerifiedBadge'
import { formatPrice } from '../data/travelData'
import { useDynamicStore } from '../services/dataStore'

interface PackagesPageProps {
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  saved: string[]
  onToggleSave: (id: string) => void
  currency: Currency
}

export function PackagesPage({
  navigate,
  onBook,
  saved,
  onToggleSave,
  currency,
}: PackagesPageProps) {
  const store = useDynamicStore()
  const [selectedTheme, setSelectedTheme] = useState<string>('All')
  const [selectedDuration, setSelectedDuration] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const themes = ['All', 'Honeymoon', 'Family', 'Heritage', 'Adventure', 'Scenic']

  const filtered = store.packages.filter((pkg) => {
    const matchesTheme = selectedTheme === 'All' || pkg.theme === selectedTheme
    const matchesDuration =
      selectedDuration === 'All'
        ? true
        : selectedDuration === 'short'
        ? pkg.daysCount <= 5
        : selectedDuration === 'medium'
        ? pkg.daysCount >= 6 && pkg.daysCount <= 7
        : pkg.daysCount >= 8

    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.state.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTheme && matchesDuration && matchesSearch
  })

  return (
    <main className="pb-24 pt-6 bg-[#fbfaf7]">
      {/* Header Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-gradient-to-r from-[#072f2b] to-[#0b4941] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ef4934] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="flight" size={16} /> Handcrafted Tour Packages
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              Explore India, exactly as it was meant to be seen.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Every itinerary includes handpicked verified stays, private air-conditioned vehicles, dedicated local guides, and 24/7 on-trip concierge assistance.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
            <Icon name="compass" size={320} />
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="shell mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Icon name="search" size={18} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by state or title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
            />
          </div>

          {/* Theme Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTheme === theme
                    ? 'bg-[#0b4941] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* Duration Selector */}
          <div className="w-full md:w-auto flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span>Duration:</span>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white font-medium"
            >
              <option value="All">All Durations</option>
              <option value="short">Short (3-5 Days)</option>
              <option value="medium">Medium (6-7 Days)</option>
              <option value="long">Extended (8+ Days)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="shell">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Showing {filtered.length} curated {filtered.length === 1 ? 'journey' : 'journeys'}
          </p>
          <button
            onClick={() => {
              setSelectedTheme('All')
              setSelectedDuration('All')
              setSearchQuery('')
            }}
            className="text-xs text-[#ef4934] font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <article
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Package Image & Badges */}
                <div className="relative h-64 overflow-hidden">
                  <CatalogPhoto
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute left-4 right-16 top-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#072f2b] text-[11px] font-bold">
                      {pkg.duration}
                    </span>
                    {pkg.discount && (
                      <span className="px-2.5 py-1 rounded-full bg-[#ef4934] text-white text-[11px] font-bold">
                        {pkg.discount}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleSave(pkg.id)}
                    className={`absolute right-4 top-4 grid size-10 place-items-center rounded-full backdrop-blur-xs transition-colors ${
                      saved.includes(pkg.id)
                        ? 'bg-[#ef4934] text-white'
                        : 'bg-white/80 hover:bg-white text-gray-700'
                    }`}
                    aria-label={`Save ${pkg.title}`}
                    aria-pressed={saved.includes(pkg.id)}
                  >
                    <Icon name="heart" size={17} className={saved.includes(pkg.id) ? 'fill-current' : ''} />
                  </button>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs text-[#ffd0c7] font-semibold uppercase tracking-wider block">
                      {pkg.place} · {pkg.state}
                    </span>
                    <h3 className="text-lg font-bold font-serif leading-snug">{pkg.title}</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {pkg.overview}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <Icon name="check" size={14} className="text-[#ef4934] flex-none mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <GoogleVerifiedBadge
                      rating={pkg.googleRating}
                      reviewsCount={pkg.googleReviewsCount}
                      mapsUrl={pkg.googleMapsUrl}
                      size="sm"
                    />
                    <span className="bg-[#0b4941]/10 text-[#0b4941] px-2 py-0.5 rounded-md font-bold text-[10px]">
                      {pkg.theme}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Starting from</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-xl font-bold text-[#0b4941]">
                      {formatPrice(pkg.priceNum, currency)}
                    </strong>
                    <span className="text-xs text-gray-400 line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`package/${pkg.id}` as RouteName)}
                    className="px-3.5 py-2 rounded-xl border border-[#0b4941] text-[#0b4941] hover:bg-[#0b4941] hover:text-white text-xs font-bold transition-all"
                  >
                    Itinerary
                  </button>
                  <button
                    onClick={() => onBook(pkg.title, pkg.priceNum)}
                    className="px-4 py-2 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white text-xs font-bold transition-all shadow-md shadow-[#ef4934]/30"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
