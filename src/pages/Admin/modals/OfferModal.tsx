import React from 'react'
import { OfferItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface OfferModalProps {
  offer: OfferItem
  isNew: boolean
  onClose: () => void
  onSave: (offer: OfferItem) => void
  onChange: (offer: OfferItem) => void
}

export function OfferModal({
  offer,
  isNew,
  onClose,
  onSave,
  onChange,
}: OfferModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(offer)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 font-inter-tight">
            {isNew ? 'Create Promotional Offer' : `Edit Offer: ${offer.title}`}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Promo Code
              </label>
              <input
                type="text"
                required
                value={offer.code}
                onChange={(e) => onChange({ ...offer, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CRAZY15"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono font-bold outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Discount Tagline
              </label>
              <input
                type="text"
                required
                value={offer.discountText}
                onChange={(e) => onChange({ ...offer, discountText: e.target.value })}
                placeholder="e.g. Flat 15% Off"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
              Campaign Title
            </label>
            <input
              type="text"
              required
              value={offer.title}
              onChange={(e) => onChange({ ...offer, title: e.target.value })}
              placeholder="e.g. Royal Rajasthan Early Bird"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Badge Tag
              </label>
              <input
                type="text"
                required
                value={offer.tag}
                onChange={(e) => onChange({ ...offer, tag: e.target.value })}
                placeholder="e.g. Limited Time"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Valid Till
              </label>
              <input
                type="text"
                required
                value={offer.validTill}
                onChange={(e) => onChange({ ...offer, validTill: e.target.value })}
                placeholder="e.g. 31 Dec 2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Minimum Booking Condition
              </label>
              <input
                type="text"
                required
                value={offer.minBooking}
                onChange={(e) => onChange({ ...offer, minBooking: e.target.value })}
                placeholder="e.g. Min booking ₹25,000"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Photo Image URL
              </label>
              <input
                type="url"
                required
                value={offer.image}
                onChange={(e) => onChange({ ...offer, image: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
              Offer Description
            </label>
            <textarea
              rows={3}
              value={offer.description}
              onChange={(e) => onChange({ ...offer, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
            >
              Save Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
