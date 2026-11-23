import React from 'react'
import { StayItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { ImageDropzone } from '../../../components/ImageDropzone'
import { GoogleVerifiedBadge } from '../../../components/GoogleVerifiedBadge'

interface StayModalProps {
  stay: StayItem
  isNew: boolean
  onClose: () => void
  onSave: (stay: StayItem) => void
  onChange: (stay: StayItem) => void
}

export function StayModal({
  stay,
  isNew,
  onClose,
  onSave,
  onChange,
}: StayModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(stay)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 font-inter animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-inter-tight block">
              Heritage Stay Curator
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-inter-tight">
              {isNew ? 'Add New Stay & Haveli' : `Edit Stay: ${stay.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Property / Haveli Name *
              </label>
              <input
                type="text"
                required
                value={stay.name}
                onChange={(e) => onChange({ ...stay, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Category / Type *
              </label>
              <select
                value={stay.type}
                onChange={(e) => onChange({ ...stay, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Heritage Stays">Heritage Stays</option>
                <option value="Palace Stays">Palace Stays</option>
                <option value="Beach Retreats">Beach Retreats</option>
                <option value="Houseboat Stays">Houseboat Stays</option>
                <option value="Plantation Retreats">Plantation Retreats</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                City *
              </label>
              <input
                type="text"
                required
                value={stay.city}
                onChange={(e) => onChange({ ...stay, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                State *
              </label>
              <input
                type="text"
                required
                value={stay.state}
                onChange={(e) => onChange({ ...stay, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Price per Night (₹ INR) *
              </label>
              <input
                type="number"
                required
                value={stay.priceNum}
                onChange={(e) =>
                  onChange({
                    ...stay,
                    priceNum: Number(e.target.value),
                    price: `₹${Number(e.target.value).toLocaleString('en-IN')}`,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Internal Score / Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                required
                value={stay.rating}
                onChange={(e) => onChange({ ...stay, rating: parseFloat(e.target.value) || 4.9 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Device Photo Upload */}
          <div className="pt-1">
            <ImageDropzone
              value={stay.image}
              onChange={(newUrl) => onChange({ ...stay, image: newUrl })}
              label="Stay / Haveli Photo (Device Upload or URL)"
              helperText="Upload any high-res room, palace facade, or courtyard photo directly from device."
            />
          </div>

          {/* Google Verified Section */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs font-inter-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Google Verified Ratings (100% Free)
              </span>
              <GoogleVerifiedBadge
                rating={stay.googleRating || stay.rating || 4.9}
                reviewsCount={stay.googleReviewsCount || 450}
                mapsUrl={stay.googleMapsUrl}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">
                  Google Rating (1.0 to 5.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={stay.googleRating || stay.rating || 4.9}
                  onChange={(e) =>
                    onChange({ ...stay, googleRating: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">
                  Google Reviews Count
                </label>
                <input
                  type="number"
                  value={stay.googleReviewsCount || 450}
                  onChange={(e) =>
                    onChange({ ...stay, googleReviewsCount: parseInt(e.target.value, 10) })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">
                Google Maps Listing URL
              </label>
              <input
                type="url"
                value={stay.googleMapsUrl || ''}
                placeholder="https://maps.google.com/..."
                onChange={(e) => onChange({ ...stay, googleMapsUrl: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              value={stay.amenities?.join(', ') || ''}
              onChange={(e) =>
                onChange({
                  ...stay,
                  amenities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="e.g. Private Pool, Heritage Courtyard, Butler Service, Rooftop Dining"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
              Description
            </label>
            <textarea
              rows={3}
              value={stay.description}
              onChange={(e) => onChange({ ...stay, description: e.target.value })}
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
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs font-inter-tight"
            >
              Save Stay
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
