import React from 'react'
import { OfferItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface OffersTabProps {
  offers: OfferItem[]
  onAddNewOffer: () => void
  onEditOffer: (offer: OfferItem) => void
  onDeleteOffer: (offer: OfferItem) => void
}

export function OffersTab({
  offers,
  onAddNewOffer,
  onEditOffer,
  onDeleteOffer,
}: OffersTabProps) {
  return (
    <div className="space-y-6 max-w-7xl font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Offers & Promotions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage promotional coupon codes, festive campaigns, and discount vouchers.
          </p>
        </div>

        <button
          onClick={onAddNewOffer}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Icon name="plus" size={14} /> Create Promo Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
          >
            <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500 text-white shadow-xs">
                  {offer.tag}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-900/90 backdrop-blur-md text-amber-300 shadow-xs border border-white/20 tracking-wider">
                  {offer.code}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-emerald-700 font-bold text-xs uppercase tracking-wide">
                  {offer.discountText}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5 leading-snug font-inter-tight">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {offer.description}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Validity:</span>
                  <span className="font-medium text-slate-800">{offer.validTill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Condition:</span>
                  <span className="font-medium text-slate-800">{offer.minBooking}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Icon name="tag" size={13} className="text-slate-400" />
                  <span>Coupon: <strong>{offer.code}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditOffer(offer)}
                    className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Icon name="edit" size={12} /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteOffer(offer)}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Offer"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
