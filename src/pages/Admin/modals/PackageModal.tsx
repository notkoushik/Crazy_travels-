import React from 'react'
import { PackageItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { ImageDropzone } from '../../../components/ImageDropzone'
import { GoogleVerifiedBadge } from '../../../components/GoogleVerifiedBadge'

interface PackageModalProps {
  pkg: PackageItem
  isNew: boolean
  onClose: () => void
  onSave: (pkg: PackageItem) => void
  onChange: (pkg: PackageItem) => void
}

export function PackageModal({
  pkg,
  isNew,
  onClose,
  onSave,
  onChange,
}: PackageModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(pkg)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 font-inter animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-inter-tight block">
              Package Tour Curator
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-inter-tight">
              {isNew ? 'Create New Tour Package' : `Edit Package: ${pkg.title}`}
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
          <div>
            <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
              Package Title *
            </label>
            <input
              type="text"
              required
              value={pkg.title}
              placeholder="e.g. Royal Rajasthan Grandeur: Palaces & Thar Safari"
              onChange={(e) => onChange({ ...pkg, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Destination Place *
              </label>
              <input
                type="text"
                required
                value={pkg.place}
                onChange={(e) => onChange({ ...pkg, place: e.target.value })}
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
                value={pkg.state}
                onChange={(e) => onChange({ ...pkg, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Theme *
              </label>
              <select
                value={pkg.theme}
                onChange={(e) =>
                  onChange({
                    ...pkg,
                    theme: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Heritage">Heritage</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Family">Family</option>
                <option value="Adventure">Adventure</option>
                <option value="Scenic">Scenic</option>
                <option value="Wildlife">Wildlife</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Base Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                value={pkg.priceNum}
                onChange={(e) =>
                  onChange({
                    ...pkg,
                    priceNum: Number(e.target.value),
                    price: `₹${Number(e.target.value).toLocaleString('en-IN')}`,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Duration String
              </label>
              <input
                type="text"
                value={pkg.duration}
                onChange={(e) => onChange({ ...pkg, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                Days Count
              </label>
              <input
                type="number"
                value={pkg.daysCount || 6}
                onChange={(e) => onChange({ ...pkg, daysCount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Local Device Photo Upload */}
          <div className="pt-1">
            <ImageDropzone
              value={pkg.image}
              onChange={(newUrl) => onChange({ ...pkg, image: newUrl })}
              label="Tour Package Hero Photo (Device Upload or Web URL)"
              helperText="Upload any high-resolution image from your phone/computer."
            />
          </div>

          {/* Google Verified Section */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs font-inter-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Google Verified Ratings & Traveler Trust (100% Free)
              </span>
              <GoogleVerifiedBadge
                rating={pkg.googleRating || pkg.rating || 4.9}
                reviewsCount={pkg.googleReviewsCount || pkg.reviewCount || 340}
                mapsUrl={pkg.googleMapsUrl}
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
                  value={pkg.googleRating || pkg.rating || 4.9}
                  onChange={(e) =>
                    onChange({
                      ...pkg,
                      googleRating: parseFloat(e.target.value),
                      rating: parseFloat(e.target.value),
                    })
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
                  value={pkg.googleReviewsCount || pkg.reviewCount || 340}
                  onChange={(e) =>
                    onChange({
                      ...pkg,
                      googleReviewsCount: parseInt(e.target.value, 10),
                      reviewCount: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">
                Google Maps Location URL
              </label>
              <input
                type="url"
                value={pkg.googleMapsUrl || ''}
                placeholder="https://maps.google.com/..."
                onChange={(e) => onChange({ ...pkg, googleMapsUrl: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
              Package Overview
            </label>
            <textarea
              rows={3}
              value={pkg.overview}
              placeholder="Detailed description of the tour circuit..."
              onChange={(e) => onChange({ ...pkg, overview: e.target.value })}
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
              Save Package
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
