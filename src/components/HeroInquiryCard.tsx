import React, { useState } from 'react'

interface HeroInquiryCardProps {
  className?: string
  onClose?: () => void
  initialDestination?: string
}

export function HeroInquiryCard({
  className = '',
  onClose,
  initialDestination = 'Kashmir',
}: HeroInquiryCardProps) {
  const [destination, setDestination] = useState(initialDestination)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [month, setMonth] = useState('Next 30 Days')
  const [travelers, setTravelers] = useState('Couple (2 Adults)')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const destinations = ['Kashmir', 'Kerala', 'Rajasthan', 'Andaman', 'Sikkim', 'Hampi']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setIsSubmitting(true)
    try {
      const slugMap: Record<string, string> = {
        Kashmir: 'srinagar',
        Kerala: 'munnar',
        Rajasthan: 'udaipur',
        Andaman: 'andaman',
        Sikkim: 'gangtok',
        Hampi: 'hampi',
      }
      const destSlug = slugMap[destination] || 'udaipur'
      const inqId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`

      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inqId,
          fullName: name.trim(),
          email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@guest.crazytours.in`,
          phone: phone.trim(),
          preferredDestination: destination,
          travelMonth: month,
          travelersCount: travelers,
          budgetPerPerson: '₹50,000 - ₹1,00,000',
          tripType: 'Bespoke Handcrafted Holiday',
          notes: `Direct Hero Inquiry for ${destination} (${travelers}, ${month})`,
          destinationSlug: destSlug,
        }),
      })

      setIsSubmitted(true)
    } catch (err) {
      console.error('Failed to submit inquiry:', err)
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Collapsed Pill State if user clicked cross mark to cut it down
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="keka-spring-badge group flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ef4934] to-[#dc3723] text-white shadow-2xl border border-white/25 cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
        <span className="font-extrabold text-xs tracking-wide">
          Plan Custom Trip · Express Interest
        </span>
        <span className="text-sm font-black group-hover:translate-x-1 transition-transform">
          ➜
        </span>
      </button>
    )
  }

  return (
    <div
      className={`hero-inquiry-card relative select-none font-inter w-[300px] sm:w-[330px] lg:w-[360px] min-h-[480px] rounded-[32px] p-6 sm:p-7 shadow-2xl backdrop-blur-md border border-white/25 flex flex-col justify-between text-white transition-all duration-300 ${className}`}
      style={{
        background:
          'radial-gradient(circle at 45% 20%, #f4503c 0%, #dc3723 55%, #b31e0f 100%)',
        boxShadow:
          '0 25px 60px -15px rgba(220, 55, 35, 0.55), 0 0 0 1px rgba(255,255,255,0.2) inset',
      }}
    >
      {/* Top Header with Close Cross Mark */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/95 text-[11px] font-bold uppercase tracking-wider font-inter-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>Trip Details & Inquiry</span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onClose) {
              onClose()
            } else {
              setIsCollapsed(true)
            }
          }}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center text-sm font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
          aria-label="Close trip details popup"
          title="Close / minimize"
        >
          ✕
        </button>
      </div>

      {/* Form Content or Submitted State */}
      {isSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-2xl font-black mb-3 text-white shadow-lg shadow-black/20">
            ✓
          </div>
          <h4 className="text-xl font-extrabold text-white tracking-tight">
            Inquiry Confirmed!
          </h4>
          <p className="text-xs text-white/90 mt-2 leading-relaxed px-2">
            Thank you, <strong className="text-white underline">{name}</strong>. Our travel concierge will WhatsApp you custom itineraries for <strong className="text-white">{destination}</strong> within 15 minutes.
          </p>
          <div className="mt-5 pt-3 border-t border-white/20 w-full flex flex-col gap-2.5">
            <a
              href={`https://wa.me/918894998808?text=${encodeURIComponent(
                `Hi Crazy Tours Travels, I just submitted an inquiry for ${destination} (${travelers}, ${month}). My name is ${name}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95"
            >
              <span>Chat on WhatsApp Directly</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false)
                setName('')
                setPhone('')
              }}
              className="w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Submit Another Inquiry ↺
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between py-2 space-y-3.5">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-[19px] font-extrabold tracking-tight text-white leading-tight">
              Where would you like to travel?
            </h4>
            <p className="text-[11.5px] text-white/80 leading-relaxed font-normal">
              Bespoke luxury itineraries crafted with verified local concierges.
            </p>
          </div>

          {/* Quick Destination Chips — Rounded Pills matching user design */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {destinations.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => setDestination(dest)}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs tracking-tight transition-all cursor-pointer ${
                  destination === dest
                    ? 'bg-white text-[#dc3723] font-bold shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 font-medium'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="space-y-2.5">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-black/25 hover:bg-black/30 border border-white/20 focus:border-white/60 focus:bg-black/35 text-white placeholder-white/70 text-xs sm:text-[13px] font-medium outline-none transition-all shadow-inner"
            />

            <input
              type="tel"
              required
              placeholder="WhatsApp / Phone (+91 ...) *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-black/25 hover:bg-black/30 border border-white/20 focus:border-white/60 focus:bg-black/35 text-white placeholder-white/70 text-xs sm:text-[13px] font-medium outline-none transition-all shadow-inner"
            />

            {/* Dropdown Selects with Custom Chevron */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-7 rounded-2xl bg-black/25 hover:bg-black/30 border border-white/20 focus:border-white/60 text-white text-xs font-medium appearance-none cursor-pointer outline-none transition-all shadow-inner"
                >
                  <option value="Next 30 Days" className="bg-[#072f2b] text-white">Next 30 Days</option>
                  <option value="Spring (Mar-May)" className="bg-[#072f2b] text-white">Spring (Mar-May)</option>
                  <option value="Summer (Jun-Aug)" className="bg-[#072f2b] text-white">Summer (Jun-Aug)</option>
                  <option value="Autumn / Festive" className="bg-[#072f2b] text-white">Autumn / Festive</option>
                  <option value="Winter Holiday" className="bg-[#072f2b] text-white">Winter Holiday</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-7 rounded-2xl bg-black/25 hover:bg-black/30 border border-white/20 focus:border-white/60 text-white text-xs font-medium appearance-none cursor-pointer outline-none transition-all shadow-inner"
                >
                  <option value="Couple (2 Adults)" className="bg-[#072f2b] text-white">Couple (2 Adults)</option>
                  <option value="Family (3-4 Members)" className="bg-[#072f2b] text-white">Family (3-4)</option>
                  <option value="Friends Group (5+)" className="bg-[#072f2b] text-white">Group (5+)</option>
                  <option value="Solo Explorer" className="bg-[#072f2b] text-white">Solo Traveler</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-1.5 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-white/95 text-[#dc3723] font-black text-xs sm:text-[13px] tracking-wide shadow-xl shadow-black/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Sending Request...' : 'Get Bespoke Itinerary & Quote ➔'}
            </button>
            <p className="text-[10.5px] text-white/80 text-center font-medium flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>Free quote · Instant WhatsApp delivery</span>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}
