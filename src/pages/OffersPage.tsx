import React from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { useDynamicStore } from '../services/dataStore'

interface OffersPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
  onBook: (title: string, price: number) => void
}

export function OffersPage({ navigate, onToast, onBook }: OffersPageProps) {
  const store = useDynamicStore()
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    onToast(`Promo code ${code} copied to clipboard! Paste it during checkout.`)
  }

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Hero Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-gradient-to-r from-[#072f2b] to-[#0b4941] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ef4934] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="tag" size={16} /> Exclusive Specials & Vouchers
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              Crazy Deals on Handcrafted Holidays
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              Unlock verified savings on early-bird summer departures, romantic honeymoon packages, and family escapes. All deals include private transfers and certified boutique stays.
            </p>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {store.offers.map((offer) => (
            <article
              key={offer.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#ef4934] text-white text-[11px] font-bold shadow-md">
                    {offer.discountText}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#072f2b] text-[10px] font-bold">
                    {offer.tag}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 block">
                    {offer.validTill}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-gray-900 leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{offer.description}</p>
                  <p className="text-[11px] text-gray-400 font-semibold">{offer.minBooking}</p>

                  {/* Voucher Box */}
                  <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-400 block">Voucher Code</span>
                      <strong className="text-sm font-mono text-[#0b4941]">{offer.code}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-[#ef4934] hover:bg-[#ef4934] hover:text-white transition-all shadow-xs"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                <button
                  onClick={() => navigate('packages')}
                  className="text-xs font-bold text-gray-600 hover:text-[#0b4941]"
                >
                  View Eligible Trips
                </button>
                <button
                  onClick={() => onBook(`Claim Offer: ${offer.title} (${offer.code})`, 45000)}
                  className="px-5 py-2.5 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white text-xs font-bold transition-all shadow-md shadow-[#ef4934]/30"
                >
                  Claim Offer
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
