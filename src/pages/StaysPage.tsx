import React, { useState } from 'react'
import { Currency, RouteName, StayItem } from '../types/travel'
import { Icon } from '../components/Icon'
import { GoogleVerifiedBadge } from '../components/GoogleVerifiedBadge'
import { formatPrice } from '../data/travelData'
import { useDynamicStore } from '../services/dataStore'

interface StaysPageProps {
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  currency: Currency
}

export function StaysPage({ navigate, onBook, currency }: StaysPageProps) {
  const store = useDynamicStore()
  const [selectedType, setSelectedType] = useState('All')
  const [searchCity, setSearchCity] = useState('')

  const types = ['All', 'Heritage Stays', 'Beach Retreats', 'Houseboat Stays', 'Plantation Retreats', 'Palace Stays']

  const filtered = store.stays.filter((stay) => {
    const matchesType = selectedType === 'All' || stay.type === selectedType
    const matchesCity =
      stay.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      stay.name.toLowerCase().includes(searchCity.toLowerCase())
    return matchesType && matchesCity
  })

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Hero Banner */}
      <section className="shell-wide mb-12">
        <div
          className="rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(7,47,43,.88), rgba(7,47,43,.25)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1900&q=88)`,
          }}
        >
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="bed" size={16} /> More Than a Place to Sleep
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              Stay somewhere truly memorable.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Characterful heritage palaces, restorative tea country bungalows, floating cedar houseboats, and ocean-facing retreats handpicked for how they make you feel.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="shell mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Icon name="search" size={18} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by city or property name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-[#0b4941] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stays Grid */}
      <section className="shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((stay) => (
            <article
              key={stay.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#072f2b] text-[11px] font-bold">
                    {stay.type}
                  </div>
                  <div className="absolute top-4 right-4">
                    <GoogleVerifiedBadge
                      rating={stay.googleRating || stay.rating || 4.9}
                      reviewsCount={stay.googleReviewsCount || 450}
                      mapsUrl={stay.googleMapsUrl}
                      size="sm"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs text-[#ffd0c7] font-semibold uppercase tracking-wider block">
                      {stay.city}, {stay.state}
                    </span>
                    <h3 className="text-base font-bold font-serif leading-snug drop-shadow-md">
                      {stay.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">{stay.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                    {stay.amenities.map((am) => (
                      <span
                        key={am}
                        className="px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-medium"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Nightly rate from</span>
                  <strong className="text-xl font-bold text-[#0b4941]">
                    {formatPrice(stay.priceNum, currency)}
                  </strong>
                </div>
                <button
                  onClick={() => onBook(`Reservation at ${stay.name} (${stay.city})`, stay.priceNum * 2)}
                  className="px-5 py-2.5 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white text-xs font-bold transition-all shadow-md shadow-[#ef4934]/30"
                >
                  Reserve Stay
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
