import React, { useState } from 'react'
import { DestinationItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { ImageDropzone } from '../../../components/ImageDropzone'
import { GoogleVerifiedBadge } from '../../../components/GoogleVerifiedBadge'

interface DestinationModalProps {
  destination: DestinationItem
  isNew: boolean
  onClose: () => void
  onSave: (dest: DestinationItem) => void
  onChange: (dest: DestinationItem) => void
}

type ModalStep = 'core' | 'logistics' | 'culture' | 'google' | 'preview'

export function DestinationModal({
  destination,
  isNew,
  onClose,
  onSave,
  onChange,
}: DestinationModalProps) {
  const [activeStep, setActiveStep] = useState<ModalStep>('core')
  const [newHighlight, setNewHighlight] = useState('')
  const [newFood, setNewFood] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(destination)
  }

  const steps: { id: ModalStep; label: string; icon: any }[] = [
    { id: 'core', label: '1. Core & Photo', icon: 'map' },
    { id: 'logistics', label: '2. Logistics & Weather', icon: 'compass' },
    { id: 'culture', label: '3. Experiences & Culture', icon: 'shield' },
    { id: 'google', label: '4. Google Ratings', icon: 'star' },
    { id: 'preview', label: '5. Live Card Preview', icon: 'eye' },
  ]

  const addHighlight = () => {
    if (!newHighlight.trim()) return
    const current = destination.highlights || []
    onChange({ ...destination, highlights: [...current, newHighlight.trim()] })
    setNewHighlight('')
  }

  const removeHighlight = (idx: number) => {
    const current = (destination.highlights || []).filter((_, i) => i !== idx)
    onChange({ ...destination, highlights: current })
  }

  const addFood = () => {
    if (!newFood.trim()) return
    const current = destination.mustTryFood || []
    onChange({ ...destination, mustTryFood: [...current, newFood.trim()] })
    setNewFood('')
  }

  const removeFood = (idx: number) => {
    const current = (destination.mustTryFood || []).filter((_, i) => i !== idx)
    onChange({ ...destination, mustTryFood: current })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 font-inter animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-inter-tight block">
              Destination Curator
            </span>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-inter-tight flex items-center gap-2">
              {isNew ? 'Curate New Destination (Fort Arch)' : `Edit ${destination.city}`}
              {destination.state && (
                <span className="text-xs font-normal text-slate-500">({destination.state})</span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto gap-2">
          {steps.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStep(st.id)}
              className={`py-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                activeStep === st.id
                  ? 'border-slate-900 text-slate-900 font-inter-tight'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon name={st.icon} size={14} />
              {st.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* STEP 1: CORE & MEDIA */}
          {activeStep === 'core' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    City / Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination.city}
                    placeholder="e.g. Udaipur, Munnar, Hampi"
                    onChange={(e) =>
                      onChange({
                        ...destination,
                        city: e.target.value,
                        slug: isNew
                          ? e.target.value.toLowerCase().replace(/\s+/g, '-')
                          : destination.slug,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination.state || destination.country || ''}
                    placeholder="e.g. Rajasthan, Kerala, Karnataka"
                    onChange={(e) =>
                      onChange({
                        ...destination,
                        country: e.target.value,
                        state: e.target.value,
                        region: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={destination.tagline || ''}
                  placeholder="e.g. City of Lakes & Royal Venetian Splendor"
                  onChange={(e) => onChange({ ...destination, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                  Destination Overview & Story
                </label>
                <textarea
                  rows={3}
                  value={destination.description || ''}
                  placeholder="Deep narrative describing the architectural splendor, royal heritage, or natural beauty..."
                  onChange={(e) => onChange({ ...destination, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Base Tour Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={destination.priceNum || 25000}
                    onChange={(e) =>
                      onChange({
                        ...destination,
                        priceNum: Number(e.target.value),
                        price: `₹${Number(e.target.value).toLocaleString('en-IN')}`,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Standard Trip Duration
                  </label>
                  <input
                    type="text"
                    value={destination.duration || '5 Days / 4 Nights'}
                    onChange={(e) => onChange({ ...destination, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Local Device Photo Upload Component */}
              <div className="pt-2">
                <ImageDropzone
                  value={destination.image}
                  onChange={(newUrl) => onChange({ ...destination, image: newUrl })}
                  label="Fort Arch Cover Photo (Device Upload or Web URL)"
                  helperText="Upload any high-resolution photo from your phone or computer. Instant upload to server."
                />
              </div>
            </div>
          )}

          {/* STEP 2: LOGISTICS & WEATHER */}
          {activeStep === 'logistics' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-2">
                <p className="text-xs text-slate-600">
                  Real-world logistics information empowers travelers to book with confidence by knowing exactly how to reach and what conditions to expect.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Nearest Airport (Name, IATA & Distance)
                  </label>
                  <input
                    type="text"
                    value={destination.nearestAirport || ''}
                    placeholder="e.g. Maharana Pratap Airport (UDR) - 22 km"
                    onChange={(e) => onChange({ ...destination, nearestAirport: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Nearest Railway Station
                  </label>
                  <input
                    type="text"
                    value={destination.nearestRailway || ''}
                    placeholder="e.g. Udaipur City Railway Station (UDZ) - 3 km"
                    onChange={(e) => onChange({ ...destination, nearestRailway: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Peak Travel Season
                  </label>
                  <input
                    type="text"
                    value={destination.season || destination.peakSeason || ''}
                    placeholder="e.g. October to March"
                    onChange={(e) =>
                      onChange({
                        ...destination,
                        season: e.target.value,
                        peakSeason: e.target.value,
                        bestTimeToVisit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Average Temperature
                  </label>
                  <input
                    type="text"
                    value={destination.avgTemp || ''}
                    placeholder="e.g. 15°C – 28°C"
                    onChange={(e) => onChange({ ...destination, avgTemp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Recommended Stay Duration
                  </label>
                  <input
                    type="number"
                    value={destination.recommendedStayDays || 4}
                    onChange={(e) =>
                      onChange({
                        ...destination,
                        recommendedStayDays: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                  Mobile Network Coverage
                </label>
                <input
                  type="text"
                  value={destination.networkCoverage || ''}
                  placeholder="e.g. Excellent 5G on Jio and Airtel throughout city center"
                  onChange={(e) => onChange({ ...destination, networkCoverage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCES & CULTURE */}
          {activeStep === 'culture' && (
            <div className="space-y-4">
              {/* Permits Toggle */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="permitCheck"
                  checked={destination.permitRequired || false}
                  onChange={(e) =>
                    onChange({ ...destination, permitRequired: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div className="flex-1">
                  <label htmlFor="permitCheck" className="font-semibold text-slate-900 font-inter-tight cursor-pointer">
                    Requires Special Permit (ILP / PAP / Forest Clearance)?
                  </label>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Enable this for protected border areas like Sikkim, Ladakh, Arunachal, or Lakshadweep.
                  </p>
                  {destination.permitRequired && (
                    <input
                      type="text"
                      value={destination.permitDetails || ''}
                      placeholder="e.g. Protected Area Permit (PAP) required for Tsomgo Lake & Nathula Pass."
                      onChange={(e) =>
                        onChange({ ...destination, permitDetails: e.target.value })
                      }
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900 bg-white"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Dress Code & What to Pack
                  </label>
                  <textarea
                    rows={2}
                    value={destination.clothingAdvice || ''}
                    placeholder="e.g. Modest shoulders/knees covered for temples; light cottons for day, light shawl for evenings."
                    onChange={(e) => onChange({ ...destination, clothingAdvice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Cultural & Heritage Etiquette
                  </label>
                  <textarea
                    rows={2}
                    value={destination.culturalNotes || ''}
                    placeholder="e.g. Remove footwear before temple sanctums; photography prohibited inside royal shrines."
                    onChange={(e) => onChange({ ...destination, culturalNotes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Must-Try Gastronomy */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                  Must-Try Regional Gastronomy
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFood}
                    placeholder="e.g. Dal Baati Churma, Ker Sangri, Ghevar"
                    onChange={(e) => setNewFood(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFood()
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFood}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                  >
                    Add Dish
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(destination.mustTryFood || []).map((dish, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium flex items-center gap-1.5"
                    >
                      {dish}
                      <button
                        type="button"
                        onClick={() => removeFood(i)}
                        className="text-amber-500 hover:text-amber-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights & Signature Micro-experiences */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                  Signature Micro-Experiences
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHighlight}
                    placeholder="e.g. Private sunset solar boat cruise on Lake Pichola"
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addHighlight()
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(destination.highlights || []).map((hl, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium flex items-center gap-1.5"
                    >
                      {hl}
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GOOGLE VERIFIED RATING (100% FREE APPROACH) */}
          {activeStep === 'google' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900">
                <div className="flex items-center gap-2 font-bold font-inter-tight mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Free Google Verified Trust Engine
                </div>
                <p className="text-xs text-emerald-800">
                  Zero Google Cloud billing, zero API credits needed. Enter the official Google Maps rating and direct share link. The verified badge appears on the Fort Arch cards and links directly to Google Maps for authentic traveler verification!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Google Maps Star Rating (1.0 to 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={destination.googleRating || 4.9}
                    onChange={(e) =>
                      onChange({ ...destination, googleRating: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                    Total Google Reviews Count
                  </label>
                  <input
                    type="number"
                    value={destination.googleReviewsCount || 1500}
                    onChange={(e) =>
                      onChange({
                        ...destination,
                        googleReviewsCount: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-inter-tight">
                  Google Maps URL / Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={destination.googleMapsUrl || ''}
                    placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/place/..."
                    onChange={(e) =>
                      onChange({ ...destination, googleMapsUrl: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono text-[11px] outline-none focus:border-slate-900"
                  />
                  {destination.googleMapsUrl && (
                    <a
                      href={destination.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
                    >
                      Test Link ↗
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Open Google Maps, find {destination.city || 'the destination'}, click "Share", and paste the link here.
                </p>
              </div>

              {/* Badge Preview */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2 font-inter-tight">
                  Public Badge Preview:
                </span>
                <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-center">
                  <GoogleVerifiedBadge
                    rating={destination.googleRating || 4.9}
                    reviewsCount={destination.googleReviewsCount || 1500}
                    mapsUrl={destination.googleMapsUrl}
                    size="md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LIVE FORT ARCH CARD PREVIEW */}
          {activeStep === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm font-inter-tight">
                  Live Fort Arch Card Appearance
                </h3>
                <span className="text-xs text-slate-400">
                  How travelers see this on the homepage and destination catalog
                </span>
              </div>

              <div className="flex justify-center p-6 bg-slate-100/70 rounded-2xl border border-slate-200">
                <div className="w-72 sm:w-80 rounded-2xl bg-white border border-slate-200/90 shadow-lg overflow-hidden flex flex-col">
                  {/* Fort Arch Image with Arch Styling */}
                  <div className="relative aspect-4/5 overflow-hidden bg-slate-200">
                    <img
                      src={destination.image}
                      alt={destination.city}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                    {/* Google Badge Top Right */}
                    <div className="absolute top-3 right-3">
                      <GoogleVerifiedBadge
                        rating={destination.googleRating || 4.9}
                        reviewsCount={destination.googleReviewsCount || 1500}
                        mapsUrl={destination.googleMapsUrl}
                        size="sm"
                      />
                    </div>

                    {/* State Tag Top Left */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 backdrop-blur-md text-slate-900 shadow-xs uppercase tracking-wider font-inter-tight">
                        {destination.state || destination.country || 'India'}
                      </span>
                    </div>

                    {/* Content on Image Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="text-xl font-bold font-inter-tight leading-tight drop-shadow-xs">
                        {destination.city || 'Destination Name'}
                      </h4>
                      <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                        {destination.tagline || destination.season || 'Palaces and royal heritage'}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-white/20">
                        <span className="font-mono font-bold text-amber-300 font-inter-tight">
                          ₹{destination.priceNum?.toLocaleString('en-IN') || destination.price}
                        </span>
                        <span className="text-[11px] text-slate-300">
                          {destination.duration || '5 Days'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Logistics Footer */}
                  <div className="p-3 bg-white text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Icon name="compass" size={12} className="text-slate-400" />
                      {destination.season || 'Oct - Mar'}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-medium text-slate-800">
                      {destination.avgTemp || '22°C'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex gap-2">
              {activeStep !== 'core' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = steps.findIndex((s) => s.id === activeStep)
                    if (idx > 0) setActiveStep(steps[idx - 1].id)
                  }}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  ← Back
                </button>
              )}
              {activeStep !== 'preview' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = steps.findIndex((s) => s.id === activeStep)
                    if (idx < steps.length - 1) setActiveStep(steps[idx + 1].id)
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs flex items-center gap-1.5 font-inter-tight"
              >
                <Icon name="check" size={14} />
                {isNew ? 'Publish Destination' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
