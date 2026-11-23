import React, { useState } from 'react'
import { Currency, PackageItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { formatPrice } from '../data/travelData'

interface PackageDetailPageProps {
  packageItem: PackageItem
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  saved: boolean
  onToggleSave: () => void
  currency: Currency
}

export function PackageDetailPage({
  packageItem,
  navigate,
  onBook,
  saved,
  onToggleSave,
  currency,
}: PackageDetailPageProps) {
  const [activeDay, setActiveDay] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions' | 'stays'>('itinerary')

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Breadcrumb Navigation */}
      <div className="shell mb-6 flex items-center gap-2 text-xs text-gray-500">
        <button onClick={() => navigate('home')} className="hover:text-[#ef4934]">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('packages')} className="hover:text-[#ef4934]">
          Holiday Packages
        </button>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{packageItem.title}</span>
      </div>

      {/* Hero Banner Section */}
      <section className="shell mb-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] sm:h-[480px]">
          <img
            src={packageItem.image}
            alt={packageItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white text-[#072f2b] text-xs font-bold shadow-md">
              {packageItem.duration}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#ef4934] text-white text-xs font-bold shadow-md">
              {packageItem.discount}
            </span>
          </div>

          <button
            onClick={onToggleSave}
            className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-colors shadow-lg ${
              saved ? 'bg-[#ef4934] text-white' : 'bg-white/80 hover:bg-white text-gray-800'
            }`}
            aria-label="Save this journey"
          >
            <Icon name="heart" size={20} />
          </button>

          <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffd0c7] block mb-2">
                {packageItem.place} · {packageItem.state} · Handcrafted Journey
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white font-normal leading-tight">
                {packageItem.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#dce9e6]">
                <span className="flex items-center gap-1 font-semibold text-white">
                  ★ {packageItem.rating} ({packageItem.reviewCount} verified reviews)
                </span>
                <span>•</span>
                <span>Verified Private AC Transfers</span>
                <span>•</span>
                <span>Breakfast & Dinner Included</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-none text-right">
              <span className="text-[11px] text-[#ffd0c7] block uppercase font-bold">
                Special Package Rate
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {formatPrice(packageItem.priceNum, currency)}
              </div>
              <span className="text-xs text-white/70 line-through block">
                {packageItem.originalPrice} per adult
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Booking Column Grid */}
      <div className="shell grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Tabs & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-white rounded-2xl p-2 shadow-xs gap-2">
            {[
              { id: 'itinerary', label: 'Day-by-Day Plan' },
              { id: 'overview', label: 'Overview & Highlights' },
              { id: 'inclusions', label: 'Inclusions & Exclusions' },
              { id: 'stays', label: 'Verified Stays' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0b4941] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <span className="kicker">Carefully Paced Flow</span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1 mb-2">
                  {packageItem.duration} Itinerary
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Click on each day below to see planned experiences, sightseeing, meal plans, and hotel details.
                </p>

                <div className="space-y-4">
                  {packageItem.itinerary.map((day) => {
                    const isOpen = activeDay === day.day
                    return (
                      <div
                        key={day.day}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'border-[#0b4941] bg-[#0b4941]/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => setActiveDay(isOpen ? -1 : day.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-none ${
                                isOpen ? 'bg-[#0b4941] text-white' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              Day {day.day}
                            </span>
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-gray-900">
                                {day.title}
                              </h4>
                              {day.meals && (
                                <span className="text-[11px] font-semibold text-[#ef4934]">
                                  {day.meals} · Stay: {day.hotel}
                                </span>
                              )}
                            </div>
                          </div>
                          <Icon
                            name="chevron"
                            size={18}
                            className={`transform transition-transform ${
                              isOpen ? 'rotate-90 text-[#0b4941]' : 'text-gray-400'
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100/60 mt-1 space-y-3">
                            <p>{day.description}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium">
                                🏨 {day.hotel}
                              </span>
                              <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium">
                                🍽️ {day.meals}
                              </span>
                              <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-600 text-[11px] font-medium">
                                🚗 Private Chauffeur Transfers Included
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <span className="kicker">Why this trip is special</span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1 mb-4">
                  The Story of This Journey
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{packageItem.overview}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-base text-gray-900 mb-3">Signature Trip Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <Icon name="check" size={16} className="text-[#ef4934] flex-none mt-0.5" />
                      <span className="text-xs font-medium text-gray-800">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 flex items-center gap-1.5 mb-2">
                  <Icon name="check" size={16} /> What’s Included in Your Package
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageItem.inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50/50 border border-green-100 text-xs text-gray-800">
                      <span className="w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center flex-none mt-0.5 text-[10px]">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-2">
                  <Icon name="x" size={16} /> Excluded from Package
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packageItem.exclusions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/40 border border-red-100 text-xs text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-red-400 text-white flex items-center justify-center flex-none mt-0.5 text-[10px]">
                        ✕
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STAYS */}
          {activeTab === 'stays' && (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <span className="kicker">Handpicked accommodations</span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1 mb-2">
                  Where You Will Stay
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  We favour verified heritage properties and boutique resorts with rich character and high hygiene standards.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageItem.itinerary
                    .filter((day, i, self) => self.findIndex((d) => d.hotel === day.hotel) === i)
                    .map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-[#fbfaf7] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#ef4934] tracking-wider block">
                          Verified Property
                        </span>
                        <h4 className="font-bold text-sm text-gray-900">{item.hotel}</h4>
                        <p className="text-xs text-gray-500">
                          Breakfast & Dinner buffet included. Upgrades available to Presidential & Heritage Suites.
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Booking Box */}
        <div className="space-y-6">
          <div className="sticky top-[calc(var(--site-nav-height)+1.5rem)] bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-5">
            <div className="pb-4 border-b border-gray-100">
              <span className="text-xs text-gray-400 uppercase font-bold block">Starting From</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0b4941]">
                  {formatPrice(packageItem.priceNum, currency)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {packageItem.originalPrice}
                </span>
              </div>
              <span className="text-xs text-green-700 font-semibold block mt-1">
                ✓ Special 2026 Online Rate Guaranteed
              </span>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Trip Duration:</span>
                <strong>{packageItem.duration}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Theme:</span>
                <strong>{packageItem.theme}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Transport:</span>
                <strong>Private Chauffeur Sedan/SUV</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Customizable:</span>
                <strong className="text-green-700">100% Yes</strong>
              </div>
            </div>

            <button
              onClick={() => onBook(packageItem.title, packageItem.priceNum)}
              className="w-full py-4 rounded-2xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ef4934]/30 transition-all"
            >
              <Icon name="calendar" size={17} />
              <span>Book / Request Free Quote</span>
            </button>

            <button
              onClick={() => navigate('custom-trip')}
              className="w-full py-2.5 rounded-xl border border-[#0b4941] text-[#0b4941] text-xs font-bold hover:bg-[#0b4941]/5 transition-all text-center"
            >
              Customize This Itinerary
            </button>

            <div className="pt-2 border-t border-gray-100 text-center space-y-2">
              <p className="text-xs text-gray-500">Need instant assistance?</p>
              <a
                href="https://wa.me/918047112112"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-green-700 font-bold text-xs hover:underline"
              >
                <Icon name="whatsapp" size={15} /> Chat with Kashmir Specialist
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
