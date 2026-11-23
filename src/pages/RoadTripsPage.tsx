import React from 'react'
import { Currency, RoadTripItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { formatPrice } from '../data/travelData'
import { useDynamicStore } from '../services/dataStore'

interface RoadTripsPageProps {
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  currency: Currency
}

export function RoadTripsPage({ navigate, onBook, currency }: RoadTripsPageProps) {
  const store = useDynamicStore()
  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Hero Banner */}
      <section className="shell-wide mb-12">
        <div
          className="rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(7,47,43,.85), rgba(7,47,43,.25)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1900&q=88)`,
          }}
        >
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="car" size={16} /> Take the Scenic Way
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              The road is part of the journey.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Curated driving expeditions with private 4WD SUVs or chauffeur sedans, mapped pitstops, road-tested timings, and handpicked stays waiting at every day’s end.
            </p>
          </div>
        </div>
      </section>

      {/* Road Trips Grid */}
      <section className="shell space-y-10">
        <div className="section-heading">
          <div>
            <span className="kicker">Epic drives across India</span>
            <h2>Signature road expeditions</h2>
          </div>
          <button onClick={() => navigate('custom-trip')} className="section-link">
            Plan a custom route <Icon name="arrow" size={17} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {store.roadTrips.map((trip) => (
            <article
              key={trip.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#072f2b] text-[11px] font-bold">
                      {trip.days} · {trip.distance}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold text-white ${
                        trip.difficulty === 'Easy'
                          ? 'bg-green-600'
                          : trip.difficulty === 'Moderate'
                          ? 'bg-amber-500'
                          : 'bg-red-600'
                      }`}
                    >
                      {trip.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ef4934]">
                    {trip.route}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-gray-900">{trip.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{trip.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Scenic Route Pitstops:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.stops.map((stop, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium"
                        >
                          {stop} {i < trip.stops.length - 1 ? '→' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Trip Package from</span>
                  <strong className="text-xl font-bold text-[#0b4941]">
                    {formatPrice(34500, currency)}
                  </strong>
                </div>
                <button
                  onClick={() => onBook(`Road Trip: ${trip.name}`, 34500)}
                  className="px-5 py-2.5 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white text-xs font-bold transition-all shadow-md shadow-[#ef4934]/30"
                >
                  Book Expedition
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
