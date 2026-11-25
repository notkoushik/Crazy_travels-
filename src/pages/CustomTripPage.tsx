import React, { useEffect, useState } from 'react'
import { DestinationItem, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { dataStore } from '../services/dataStore'

interface CustomTripPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
  catalogDestinations: DestinationItem[]
  destinationSlug?: string
}

export function CustomTripPage({ navigate, onToast, catalogDestinations, destinationSlug }: CustomTripPageProps) {
  const [step, setStep] = useState(1)
  const requestedCity = catalogDestinations.find(({ slug }) => encodeURIComponent(slug) === destinationSlug)?.city
  const [destinations, setDestinations] = useState<string[]>(() => requestedCity ? [requestedCity] : [])
  useEffect(() => {
    if (requestedCity) setDestinations([requestedCity])
  }, [requestedCity])
  const [style, setStyle] = useState(() => {
    try {
      const preset = window.sessionStorage.getItem('ct_custom_style')
      if (preset) {
        window.sessionStorage.removeItem('ct_custom_style')
        return preset
      }
    } catch {
      // Ignore storage access errors in restricted modes
    }
    return 'Romantic / Honeymoon'
  })
  const [duration, setDuration] = useState('7 - 9 Days')
  const [month, setMonth] = useState('April 2026')
  const [stayType, setStayType] = useState('Boutique Heritage Havelis & Resorts')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [transport, setTransport] = useState('Private Chauffeur Innova Crysta')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const availableDests = [...new Set(catalogDestinations.map(({ city }) => city))]

  const toggleDest = (d: string) => {
    setDestinations((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      onToast('Please enter your name and phone number.')
      return
    }
    const inqId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`
    try {
      await dataStore.addInquiry({
        id: inqId,
        fullName: name,
        email,
        phone: phone,
        preferredDestination: destinations.length ? destinations.join(', ') : 'Any Recommended Region',
        travelMonth: month,
        travelersCount: `${adults} Adults${children > 0 ? `, ${children} Children` : ''}`,
        budgetPerPerson: style,
        tripType: style,
        notes: `Duration: ${duration}. Stay: ${stayType}. Transport: ${transport}. Notes: ${notes || 'None'}`,
        status: 'New',
        assignedAgent: 'Unassigned',
        createdAt: new Date().toISOString(),
      })
      setSubmitted(true)
      onToast('Your tailor-made itinerary request has been received.')
    } catch (err) {
      console.error('Failed to submit inquiry:', err)
      onToast('We couldn’t send your itinerary request. Please try again.')
    }
  }

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
              <Icon name="sparkle" size={16} /> 100% Tailor-Made For You
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
              Design your dream journey from scratch.
            </h1>
            <p className="text-[#dce9e6] text-sm sm:text-base leading-relaxed">
              No pre-packaged constraints. Tell us what moves you, how you like to travel, and our master travel designers will shape an unforgettable private journey around your exact rhythm.
            </p>
          </div>
        </div>
      </section>

      <section className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Form: Wizard Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                    <Icon name="check" size={32} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                    Your Custom Itinerary Is Being Designed!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{name}</strong>. Our travel team will review your preferences and contact you at <strong>{phone}</strong> to discuss your itinerary.
                  </p>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => navigate('packages')}
                      className="px-6 py-2.5 rounded-full bg-[#0b4941] text-white text-xs font-bold"
                    >
                      Browse Featured Trips
                    </button>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setStep(1)
                      }}
                      className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
                    >
                      Start New Plan
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            step === s
                              ? 'bg-[#ef4934] text-white'
                              : step > s
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {step > s ? '✓' : s}
                        </span>
                        <span className="hidden sm:inline text-xs font-semibold text-gray-600">
                          {s === 1
                            ? 'Destinations'
                            : s === 2
                            ? 'Dates & Pace'
                            : s === 3
                            ? 'Stays & Cars'
                            : 'Contact Details'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* STEP 1: DESTINATIONS & STYLE */}
                  {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
                          Where would you like to travel?
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                          Select one or more destinations you want to include in this journey.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {availableDests.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => toggleDest(d)}
                              className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                                destinations.includes(d)
                                  ? 'border-[#ef4934] bg-[#ef4934]/5 text-[#ef4934] shadow-xs'
                                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {destinations.includes(d) ? '✓ ' : '+ '}
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Travel Vibe / Style
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            'Romantic / Honeymoon',
                            'Family with Kids',
                            'Friends & Bachelors Group',
                            'Adventure & Mountain Trails',
                            'Slow Heritage & Culture',
                            'Luxury Wellness & Spa',
                          ].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStyle(st)}
                              className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                                style === st
                                  ? 'border-[#0b4941] bg-[#0b4941]/5 text-[#0b4941]'
                                  : 'border-gray-200 text-gray-600'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (availableDests.length > 0 && destinations.length === 0) {
                              onToast('Please pick at least one destination to proceed.')
                              return
                            }
                            setStep(2)
                          }}
                          className="px-6 py-3 rounded-xl bg-[#ef4934] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#ef4934]/30"
                        >
                          <span>Next: Dates & Pace</span>
                          <Icon name="arrow" size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DATES & PACE */}
                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
                          Duration & Travel Timing
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                          How long do you want this journey to last?
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['4 - 6 Days', '7 - 9 Days', '10 - 13 Days', '14+ Days'].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDuration(d)}
                              className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                                duration === d
                                  ? 'border-[#ef4934] bg-[#ef4934]/5 text-[#ef4934]'
                                  : 'border-gray-200 text-gray-700'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Preferred Travel Month
                        </label>
                        <select
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none"
                        >
                          <option>March 2026</option>
                          <option>April 2026 (Tulip & Spring Season)</option>
                          <option>May 2026 (Summer Break)</option>
                          <option>June 2026</option>
                          <option>July - August 2026 (Monsoon Trails)</option>
                          <option>September - October 2026</option>
                          <option>November - December 2026 (Winter Royal Season)</option>
                        </select>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="px-6 py-3 rounded-xl bg-[#ef4934] text-white font-bold text-xs flex items-center gap-2 shadow-md"
                        >
                          <span>Next: Stays & Vehicles</span>
                          <Icon name="arrow" size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: STAYS & CARS */}
                  {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
                          Accommodation & Transport Preferences
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                          Select the style of stays you enjoy most.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            'Boutique Heritage Havelis & Resorts',
                            '5-Star Luxury Palaces & Taj/Oberoi',
                            'Soulful Homestays & Tea Estates',
                            'Comfort 4-Star Scenic Hotels',
                          ].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStayType(st)}
                              className={`p-4 rounded-xl border text-xs font-semibold text-left transition-all ${
                                stayType === st
                                  ? 'border-[#0b4941] bg-[#0b4941]/5 text-[#0b4941]'
                                  : 'border-gray-200 text-gray-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Dedicated Chauffeur Vehicle
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            'Private Sedan (Etios / Dzire)',
                            'Private Chauffeur Innova Crysta',
                            'Luxury 4x4 Fortuner / SUV',
                          ].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setTransport(v)}
                              className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                                transport === v
                                  ? 'border-[#ef4934] bg-[#ef4934]/5 text-[#ef4934]'
                                  : 'border-gray-200 text-gray-600'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          className="px-6 py-3 rounded-xl bg-[#ef4934] text-white font-bold text-xs flex items-center gap-2 shadow-md"
                        >
                          <span>Next: Final Details</span>
                          <Icon name="arrow" size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & NOTES */}
                  {step === 4 && (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-gray-900 mb-1">
                          Where should we send your custom itinerary?
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                          Our travel designer will tailor the full itinerary plan and WhatsApp it to you.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                              Your Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Priya Sundaram"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                              Phone / WhatsApp Number *
                            </label>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="priya@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Any Special Requests or Must-Haves?
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="E.g., We are celebrating our 10th anniversary, prefer lake-facing rooms, vegetarian food only, want a coracle boat experience..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 rounded-xl bg-[#0b4941] hover:bg-[#072f2b] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#0b4941]/30"
                        >
                          <Icon name="check" size={16} />
                          <span>Submit Custom Itinerary Request</span>
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Live Itinerary Summary Panel */}
          <div>
            <div className="sticky top-[calc(var(--site-nav-height)+1.5rem)] bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-4">
              <span className="text-[10px] uppercase font-bold text-[#ef4934] tracking-widest block">
                Live Itinerary Blueprint
              </span>
              <h4 className="font-serif font-bold text-lg text-gray-900">Your Trip Preferences</h4>

              <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <div>
                  <span className="text-gray-400 block">Destinations Selected:</span>
                  <strong className="text-gray-900">
                    {destinations.length > 0 ? destinations.join(', ') : 'Not selected yet'}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Travel Style:</span>
                  <strong className="text-gray-900">{style}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Duration & Timing:</span>
                  <strong className="text-gray-900">{duration} ({month})</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Stay Category:</span>
                  <strong className="text-gray-900">{stayType}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Chauffeur Transport:</span>
                  <strong className="text-gray-900">{transport}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 bg-[#fbfaf7] p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#0b4941] block">What happens next?</span>
                <p className="text-[11px] text-gray-500">
                  A regional specialist prepares a personalized day-by-day plan with photos and transparent pricing. No obligation to book.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
