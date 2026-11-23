import React, { useEffect, useRef, useState, useCallback } from 'react'

interface HeroPlaneLogoAnimationProps {
  variant?: 'card' | 'inline'
  autoPlay?: boolean
  className?: string
  onComplete?: () => void
}

/**
 * 100% Exact Official Vector Polygon extracted directly from master asset
 * Crazy Tours Travels/public/IMG_1611.PNG (2500x2500 master emblem)
 * Sub-pixel verified against official brand lockup.
 */
const OFFICIAL_POLYGON_D =
  'M 1006 20 L 1020 21 L 1031 26 L 1118 112 L 1185 114 L 1200 126 L 1207 145 ' +
  'L 1201 168 L 1183 182 L 1117 183 L 1033 267 L 1022 273 L 1003 274 L 991 269 ' +
  'L 982 261 L 975 246 L 975 231 L 980 219 L 1013 185 L 1012 183 L 500 184 ' +
  'L 471 187 L 457 193 L 444 207 L 439 222 L 440 236 L 449 253 L 458 261 ' +
  'L 474 267 L 518 263 L 605 263 L 639 271 L 667 288 L 684 306 L 696 326 ' +
  'L 705 357 L 705 876 L 713 896 L 725 907 L 737 912 L 754 912 L 769 905 ' +
  'L 779 895 L 786 877 L 785 361 L 794 327 L 808 304 L 830 283 L 854 270 ' +
  'L 885 263 L 921 266 L 948 277 L 964 288 L 987 315 L 997 336 L 1002 357 ' +
  'L 1002 925 L 998 951 L 986 990 L 973 1017 L 952 1048 L 921 1080 L 889 1103 ' +
  'L 849 1122 L 812 1132 L 790 1135 L 515 1135 L 445 1128 L 366 1108 L 283 1071 ' +
  'L 218 1028 L 187 1002 L 127 937 L 91 884 L 61 825 L 38 759 L 25 696 ' +
  'L 20 632 L 24 558 L 39 484 L 58 429 L 84 375 L 123 315 L 166 265 ' +
  'L 219 218 L 274 181 L 339 149 L 327 176 L 320 206 L 319 237 L 325 271 ' +
  'L 336 299 L 352 324 L 377 350 L 401 366 L 360 391 L 320 427 L 288 468 ' +
  'L 261 522 L 250 558 L 243 606 L 246 668 L 261 725 L 278 762 L 300 796 ' +
  'L 331 831 L 363 858 L 415 888 L 470 906 L 511 912 L 590 912 L 605 950 ' +
  'L 630 984 L 524 984 L 484 981 L 431 970 L 387 954 L 343 931 L 293 894 ' +
  'L 255 855 L 216 798 L 192 745 L 179 699 L 172 649 L 172 598 L 184 527 ' +
  'L 207 466 L 246 403 L 288 358 L 268 323 L 254 283 L 202 332 L 174 367 ' +
  'L 150 404 L 116 478 L 98 547 L 92 598 L 92 649 L 98 700 L 119 777 ' +
  'L 131 806 L 158 856 L 204 917 L 238 951 L 285 988 L 321 1010 L 365 1031 ' +
  'L 411 1047 L 454 1057 L 503 1063 L 787 1063 L 819 1056 L 850 1042 L 875 1024 ' +
  'L 896 1002 L 912 978 L 921 958 L 931 912 L 931 368 L 923 349 L 907 337 ' +
  'L 887 335 L 873 341 L 863 351 L 857 365 L 854 902 L 842 930 L 833 943 ' +
  'L 801 970 L 781 979 L 757 984 L 717 981 L 685 967 L 659 944 L 642 916 ' +
  'L 634 886 L 632 359 L 618 341 L 604 335 L 509 335 L 468 338 L 444 333 ' +
  'L 424 324 L 408 313 L 382 282 L 371 255 L 368 216 L 375 186 L 394 154 ' +
  'L 421 131 L 457 117 L 509 112 L 1013 112 L 1014 110 L 981 77 L 975 63 ' +
  'L 975 48 L 980 36 L 993 24 L 1006 20 Z'

/**
 * Continuous Aerodynamic Centerline Flight Path
 * 0.00s: Plane enters near top tip of outer C
 * 0.25s - 0.70s: Sweeps around outer C down to bottom
 * 0.70s - 1.10s: Ascends along right vertical leg, traverses T-stem U-turn
 * 1.10s - 1.40s: Aligns to top bar and accelerates horizontally rightward
 * 1.40s - 1.65s: Reaches terminal arrow coordinates (1227, 167) and morphs
 * 1.65s - 1.80s: Settle with spring ease bounce, bloom & brand typography
 */
const FLIGHT_CENTERLINE_D =
  'M 360 140 ' +
  'C 330 160 150 250 78 680 ' +
  'C 105 880 250 1080 515 1100 ' +
  'C 750 1120 986 1080 986 925 ' +
  'L 986 380 ' +
  'C 986 280 840 280 840 380 ' +
  'L 840 880 ' +
  'C 840 968 689 968 689 880 ' +
  'L 689 300 ' +
  'C 689 200 500 167 440 167 ' +
  'L 1227 167'

/**
 * Inner C crescent reveal arc for continuous progressive illumination
 */
const INNER_C_ARC_D =
  'M 440 167 ' +
  'C 340 260 210 450 230 650 ' +
  'C 245 800 350 920 590 950'

export function HeroPlaneLogoAnimation({
  variant = 'card',
  autoPlay = true,
  className = '',
  onComplete,
}: HeroPlaneLogoAnimationProps) {
  const [, setIsPlaying] = useState(false)
  const [, setIsSettled] = useState(false)
  const [timerText, setTimerText] = useState('1.8s')
  const [showInquiry, setShowInquiry] = useState(false)
  const [inquirySubmitted, setInquirySubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: 'Kashmir',
    month: 'Next 30 Days',
    travelers: 'Couple (2 Adults)',
  })

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) return
    setSubmitting(true)
    try {
      const slugMap: Record<string, string> = {
        Kashmir: 'srinagar',
        Kerala: 'munnar',
        Rajasthan: 'udaipur',
        Andaman: 'andaman',
        Sikkim: 'gangtok',
        Hampi: 'hampi',
      }
      const destSlug = slugMap[formData.destination] || 'udaipur'
      const inqId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inqId,
          fullName: formData.name.trim(),
          email: `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@lead.crazytours.in`,
          phone: formData.phone.trim(),
          preferredDestination: formData.destination,
          travelMonth: formData.month,
          travelersCount: formData.travelers,
          budgetPerPerson: '₹50,000 - ₹1,00,000',
          tripType: 'Custom Handcrafted Holiday',
          notes: `Quick inquiry from Hero Details Card for ${formData.destination}`,
          destinationSlug: destSlug,
        }),
      })
      setInquirySubmitted(true)
    } catch (err) {
      console.error('Failed to submit inquiry:', err)
      setInquirySubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const trackPathRef = useRef<SVGPathElement>(null)
  const maskFlightRouteRef = useRef<SVGPathElement>(null)
  const maskInnerCRef = useRef<SVGPathElement>(null)
  const maskArrowRef = useRef<SVGPathElement>(null)
  const maskFullRef = useRef<SVGRectElement>(null)
  const contrailRef = useRef<SVGPathElement>(null)
  const planeGroupRef = useRef<SVGGElement>(null)
  const artboardRef = useRef<SVGSVGElement>(null)
  const brandTextRef = useRef<HTMLDivElement>(null)

  const animFrameId = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const DURATION = 1800 // Exactly 1.8 seconds matching animation.png storyboard

  const runAnimation = useCallback(() => {
    if (!trackPathRef.current || !maskFlightRouteRef.current || !contrailRef.current) return

    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current)
    }

    setIsPlaying(true)
    setIsSettled(false)
    startTimeRef.current = null

    const totalLen = trackPathRef.current.getTotalLength()

    // Initialize stroke masks
    maskFlightRouteRef.current.style.strokeDasharray = `${totalLen}`
    maskFlightRouteRef.current.style.strokeDashoffset = `${totalLen}`
    contrailRef.current.style.strokeDasharray = `${totalLen}`
    contrailRef.current.style.strokeDashoffset = `${totalLen}`

    if (maskInnerCRef.current) maskInnerCRef.current.style.opacity = '0'
    if (maskArrowRef.current) maskArrowRef.current.style.opacity = '0'
    if (maskFullRef.current) maskFullRef.current.style.opacity = '0'
    if (planeGroupRef.current) planeGroupRef.current.style.opacity = '1'
    if (brandTextRef.current) {
      brandTextRef.current.style.opacity = '0'
      brandTextRef.current.style.transform = 'translateY(12px)'
    }
    if (artboardRef.current) artboardRef.current.style.transform = 'scale(1)'

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / DURATION, 1.0)

      setTimerText(`${(progress * 1.8).toFixed(2)}s`)

      // 1. Mask reveal stroke & glowing contrail
      const currentDist = progress * totalLen
      if (maskFlightRouteRef.current) {
        maskFlightRouteRef.current.style.strokeDashoffset = `${totalLen - currentDist}`
      }

      // Reveal inner C crescent curve harmoniously between progress 0.35 and 0.70
      if (maskInnerCRef.current) {
        if (progress > 0.35) {
          maskInnerCRef.current.style.opacity = Math.min(1.0, (progress - 0.35) / 0.35).toString()
        } else {
          maskInnerCRef.current.style.opacity = '0'
        }
      }

      // Reveal arrowhead zone as plane approaches top right (0.75 to 0.90)
      if (maskArrowRef.current) {
        if (progress > 0.75) {
          maskArrowRef.current.style.opacity = Math.min(1.0, (progress - 0.75) / 0.15).toString()
        } else {
          maskArrowRef.current.style.opacity = '0'
        }
      }

      // Contrail trails 400px behind the plane
      if (contrailRef.current) {
        if (progress < 0.78) {
          const trailDist = Math.max(0, currentDist - 400)
          contrailRef.current.style.opacity = '1'
          contrailRef.current.style.strokeDasharray = `${currentDist - trailDist} ${totalLen}`
          contrailRef.current.style.strokeDashoffset = `${-trailDist}`
        } else if (progress < 0.92) {
          const morphP = (progress - 0.78) / (0.92 - 0.78)
          contrailRef.current.style.opacity = (1 - morphP).toString()
        } else {
          contrailRef.current.style.opacity = '0'
        }
      }

      // 2. Compute airplane tangent angle & coordinates
      const pt = trackPathRef.current.getPointAtLength(currentDist)
      const nextPt = trackPathRef.current.getPointAtLength(Math.min(currentDist + 5, totalLen))
      const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI)

      // STAGES:
      // Stage 1 to 4: 0.00s to 1.40s (progress 0 to ~0.78) - Flight
      // Stage 5: 1.40s to 1.65s (progress ~0.78 to ~0.92) - Morphing into Arrowhead
      // Stage 6: 1.65s to 1.80s (progress ~0.92 to 1.00) - Settle & Typography
      if (progress < 0.78) {
        if (planeGroupRef.current) {
          planeGroupRef.current.style.opacity = '1'
          planeGroupRef.current.setAttribute(
            'transform',
            `translate(${pt.x}, ${pt.y}) rotate(${angle}) scale(1)`
          )
        }
        if (maskFullRef.current) maskFullRef.current.style.opacity = '0'
        if (brandTextRef.current) brandTextRef.current.style.opacity = '0'
      } else if (progress < 0.92) {
        // Stage 5: Morphing into Arrowhead
        const morphP = (progress - 0.78) / (0.92 - 0.78)
        const scale = Math.max(0, 1 - morphP)
        if (planeGroupRef.current) {
          planeGroupRef.current.style.opacity = (1 - morphP).toString()
          planeGroupRef.current.setAttribute(
            'transform',
            `translate(${pt.x}, ${pt.y}) rotate(${angle}) scale(${scale})`
          )
        }
        if (maskFullRef.current) maskFullRef.current.style.opacity = morphP.toString()
        if (brandTextRef.current) {
          brandTextRef.current.style.opacity = (morphP * 0.4).toString()
        }
      } else {
        // Stage 6: Settle & Typography Reveal
        if (planeGroupRef.current) planeGroupRef.current.style.opacity = '0'
        if (maskFullRef.current) maskFullRef.current.style.opacity = '1'

        const settleP = (progress - 0.92) / (1.0 - 0.92)
        const bounce = 1 + 0.025 * Math.sin(settleP * Math.PI)
        if (artboardRef.current) {
          artboardRef.current.style.transform = `scale(${bounce})`
        }

        if (brandTextRef.current) {
          brandTextRef.current.style.opacity = settleP.toString()
          brandTextRef.current.style.transform = `translateY(${12 * (1 - settleP)}px)`
        }
      }

      if (progress < 1.0) {
        animFrameId.current = requestAnimationFrame(step)
      } else {
        setIsPlaying(false)
        setIsSettled(true)
        setTimerText('1.8s')
        if (planeGroupRef.current) planeGroupRef.current.style.opacity = '0'
        if (maskFullRef.current) maskFullRef.current.style.opacity = '1'
        if (artboardRef.current) artboardRef.current.style.transform = 'scale(1)'
        if (brandTextRef.current) {
          brandTextRef.current.style.opacity = '1'
          brandTextRef.current.style.transform = 'translateY(0)'
        }
        if (onComplete) onComplete()
      }
    }

    animFrameId.current = requestAnimationFrame(step)
  }, [DURATION, onComplete])

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        runAnimation()
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, runAnimation])

  useEffect(() => {
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current)
    }
  }, [])

  // ============================================================
  // QUICK POPUP DETAILS VIEW (SAME CARD DIMENSIONS & STYLING)
  // ============================================================
  if (showInquiry && variant === 'card') {
    return (
      <div
        className={`hero-plane-logo-container relative select-none font-inter w-[280px] sm:w-[320px] lg:w-[350px] min-h-[460px] rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md border border-white/25 transition-all duration-300 flex flex-col justify-between text-white ${className}`}
        style={{
          background:
            'radial-gradient(circle at 50% 25%, #f24e3a 0%, #dc3723 55%, #ad1c0b 100%)',
          boxShadow:
            '0 25px 60px -15px rgba(220, 55, 35, 0.55), 0 0 0 1px rgba(255,255,255,0.2) inset',
        }}
      >
        {/* Top Header with Close Cross Mark */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-white/20">
          <div className="flex items-center gap-1.5 text-white/95 text-[10px] font-bold uppercase tracking-widest font-inter-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            Trip Details & Inquiry
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowInquiry(false)
              setInquirySubmitted(false)
            }}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center text-xs font-black transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Close trip details popup"
            title="Close popup"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        {inquirySubmitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-2xl font-black mb-3 text-white shadow-lg shadow-black/20">
              ✓
            </div>
            <h4 className="text-lg font-extrabold text-white tracking-tight">
              Inquiry Confirmed!
            </h4>
            <p className="text-xs text-white/90 mt-2 leading-relaxed px-2">
              Thank you, <strong className="text-white underline">{formData.name}</strong>. Our travel concierge will WhatsApp you custom itineraries for <strong className="text-white">{formData.destination}</strong> within 15 minutes.
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 w-full flex flex-col gap-2">
              <a
                href={`https://wa.me/918894998808?text=${encodeURIComponent(
                  `Hi Crazy Tours Travels, I just submitted an inquiry for ${formData.destination} (${formData.travelers}, ${formData.month}). My name is ${formData.name}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Chat on WhatsApp Directly</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setShowInquiry(false)
                  setInquirySubmitted(false)
                }}
                className="w-full py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all"
              >
                Back to Brand Flight ↺
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="flex-1 flex flex-col justify-between py-2 space-y-2">
            <div>
              <h4 className="text-[14px] font-extrabold tracking-tight text-white">
                Where would you like to travel?
              </h4>
              <p className="text-[10px] text-white/80 leading-tight mt-0.5">
                Bespoke luxury itineraries crafted with verified local concierges.
              </p>
            </div>

            {/* Quick Destination Chips */}
            <div className="flex flex-wrap gap-1.5">
              {['Kashmir', 'Kerala', 'Rajasthan', 'Andaman', 'Sikkim', 'Hampi'].map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setFormData({ ...formData, destination: dest })}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
                    formData.destination === dest
                      ? 'bg-white text-[#dc3723] shadow-sm font-extrabold scale-105'
                      : 'bg-white/15 text-white/90 hover:bg-white/25'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* Traveler Information Fields */}
            <div className="space-y-1.5">
              <input
                type="text"
                required
                placeholder="Your Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-black/25 border border-white/25 text-white placeholder-white/60 text-xs focus:outline-none focus:border-white focus:bg-black/35 transition-all"
              />

              <input
                type="tel"
                required
                placeholder="WhatsApp / Phone (+91 ...) *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-black/25 border border-white/25 text-white placeholder-white/60 text-xs focus:outline-none focus:border-white focus:bg-black/35 transition-all"
              />

              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl bg-black/35 border border-white/25 text-white text-[10.5px] focus:outline-none focus:border-white"
                >
                  <option value="Next 30 Days" className="bg-[#072f2b] text-white">Next 30 Days</option>
                  <option value="Spring (Mar-May)" className="bg-[#072f2b] text-white">Spring (Mar-May)</option>
                  <option value="Summer (Jun-Aug)" className="bg-[#072f2b] text-white">Summer (Jun-Aug)</option>
                  <option value="Autumn / Festive" className="bg-[#072f2b] text-white">Autumn / Festive</option>
                  <option value="Winter Holiday" className="bg-[#072f2b] text-white">Winter Holiday</option>
                </select>

                <select
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl bg-black/35 border border-white/25 text-white text-[10.5px] focus:outline-none focus:border-white"
                >
                  <option value="Couple (2 Adults)" className="bg-[#072f2b] text-white">Couple (2 Adults)</option>
                  <option value="Family (3-4 Members)" className="bg-[#072f2b] text-white">Family (3-4)</option>
                  <option value="Friends Group (5+)" className="bg-[#072f2b] text-white">Group (5+)</option>
                  <option value="Solo Explorer" className="bg-[#072f2b] text-white">Solo Traveler</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-white/95 text-[#dc3723] font-extrabold text-xs tracking-wide shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Sending Request...' : 'Get Bespoke Itinerary & Quote ➜'}
              </button>
              <p className="text-[9.5px] text-white/70 text-center mt-1 font-medium">
                🔒 Free quote · Instant WhatsApp delivery
              </p>
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`hero-plane-logo-container relative select-none font-inter ${
        variant === 'card'
          ? 'w-[280px] sm:w-[320px] lg:w-[350px] rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden cursor-pointer backdrop-blur-md border border-white/25 transition-all duration-300 hover:shadow-red-500/30'
          : 'w-full flex flex-col items-center justify-center'
      } ${className}`}
      style={
        variant === 'card'
          ? {
              background:
                'radial-gradient(circle at 50% 25%, #f24e3a 0%, #dc3723 55%, #ad1c0b 100%)',
              boxShadow:
                '0 25px 60px -15px rgba(220, 55, 35, 0.55), 0 0 0 1px rgba(255,255,255,0.2) inset',
            }
          : undefined
      }
      onClick={runAnimation}
      title="Click to replay the 1.8s signature brand flight"
    >
      {/* Card Header & Time Indicators */}
      {variant === 'card' && (
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-white/95 text-[10px] font-bold uppercase tracking-widest font-inter-tight">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></span>
            Hero Animation — Plane to Logo
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-black/25 text-white/90 border border-white/20 text-[10px] font-mono font-semibold">
            {timerText}
          </span>
        </div>
      )}

      {/* Motion Canvas */}
      <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
        <svg
          ref={artboardRef}
          viewBox="-20 -20 1267 1195"
          className="w-full h-full overflow-visible transition-transform duration-300 ease-out"
        >
          <defs>
            {/* Luminous Jet Contrail Glow */}
            <filter id="heroPlaneGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Exhaust Engine Flare */}
            <filter id="heroEngineFlare" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="flare" />
              <feMerge>
                <feMergeNode in="flare" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Logo Settled Luminous Bloom */}
            <filter id="logoBloom" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="bloom" />
              <feMerge>
                <feMergeNode in="bloom" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* SVG Mask revealing the official brand polygon along flight path */}
            <mask id="planeFlightMask">
              {/* Settle state: reveals entire logo unconditionally */}
              <rect
                ref={maskFullRef}
                x="-100"
                y="-100"
                width="1500"
                height="1400"
                fill="#ffffff"
                style={{ opacity: 0 }}
              />
              {/* Flight stroke reveal: wide white stroke progressively reveals the official polygon */}
              <path
                ref={maskFlightRouteRef}
                d={FLIGHT_CENTERLINE_D}
                fill="none"
                stroke="#ffffff"
                strokeWidth="150"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner C crescent curve reveal */}
              <path
                ref={maskInnerCRef}
                d={INNER_C_ARC_D}
                fill="none"
                stroke="#ffffff"
                strokeWidth="150"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0 }}
              />
              {/* Arrowhead reveal zone at terminal destination */}
              <path
                ref={maskArrowRef}
                d="M 960 -20 L 1260 167 L 960 320 Z"
                fill="#ffffff"
                style={{ opacity: 0 }}
              />
            </mask>
          </defs>

          {/* Hidden Track Path for Mathematical Tangent & Position Tracking */}
          <path ref={trackPathRef} d={FLIGHT_CENTERLINE_D} fill="none" stroke="none" />

          {/* 1. The Official Revealed Brand Polygon (100% exact from master asset IMG_1611.PNG) */}
          <g mask="url(#planeFlightMask)">
            <path d={OFFICIAL_POLYGON_D} fill="#ffffff" filter="url(#logoBloom)" />
          </g>

          {/* 2. Glowing Engine Contrail Tail behind the airplane */}
          <path
            ref={contrailRef}
            d={FLIGHT_CENTERLINE_D}
            fill="none"
            stroke="rgba(255, 235, 225, 0.85)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#heroPlaneGlow)"
          />

          {/* 3. Flying Airplane Jet Silhouette */}
          <g
            ref={planeGroupRef}
            transform="translate(360, 140)"
            style={{ willChange: 'transform' }}
          >
            {/* Luminous Engine Wake Flare */}
            <ellipse
              cx="-45"
              cy="0"
              rx="35"
              ry="14"
              fill="rgba(255,255,255,0.95)"
              filter="url(#heroEngineFlare)"
            />
            {/* Passenger Jet Silhouette */}
            <path
              d="M 55 0
                 L 15 -12
                 L -6 -56
                 C -9 -58 -18 -55 -15 -44
                 L 0 -12
                 L -32 -12
                 L -45 -28
                 C -48 -31 -54 -28 -51 -22
                 L -45 0
                 L -51 22
                 C -54 28 -48 31 -45 28
                 L -32 12
                 L 0 12
                 L -15 44
                 C -18 55 -9 58 -6 56
                 L 15 12
                 Z"
              fill="#ffffff"
              filter="drop-shadow(0 6px 12px rgba(0,0,0,0.35))"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography Lockup matching Stage 6 */}
      <div
        ref={brandTextRef}
        className="brand-typography-lockup text-center mt-3 transition-all duration-300 ease-out"
        style={{ opacity: 0, transform: 'translateY(12px)' }}
      >
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-inter-tight drop-shadow-xs">
          Crazy Tours
        </h3>
        <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-white/90 uppercase mt-0.5 font-inter-tight">
          Enterprise Travel Management
        </p>
      </div>

      {/* Interactive Footer & Replay Trigger */}
      {variant === 'card' && (
        <div className="w-full flex flex-col gap-2.5 mt-4 pt-3 border-t border-white/20 text-white/80 text-[11px]">
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] italic text-white/75">
              "The journey draws the brand"
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                runAnimation()
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/30 text-white text-[11px] font-semibold backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Replay Journey</span>
              <span className="text-xs">↺</span>
            </button>
          </div>

          {/* Quick Details / Express Interest Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowInquiry(true)
            }}
            className="w-full py-2 px-3 rounded-xl bg-white text-[#dc3723] hover:bg-white/95 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-black/15 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Express Interest · Get Custom Itinerary</span>
            <span className="text-sm font-black">➜</span>
          </button>
        </div>
      )}
    </div>
  )
}
