import React, { useState } from 'react'
import { RouteName } from '../types/travel'
import { Icon } from './Icon'

interface FooterProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}

export function Footer({ navigate, onToast }: FooterProps) {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    onToast('Thank you! You are now subscribed to Crazy Tours Travels exclusive postcards & secret offers.')
    setEmail('')
  }

  return (
    <footer className="bg-[#072f2b] text-[#dce9e6] pt-16 pb-12 border-t border-[#0b4941]">
      <div className="shell">
        {/* Top Newsletter & Assurance Bar */}
        <div className="bg-[#0b4941]/60 rounded-3xl p-8 mb-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-[#ef4934] font-bold text-xs uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2 mb-2">
              <Icon name="sparkle" size={14} /> Secret Travel Postcards & Flash Deals
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal mb-2">
              Stay curious. Let us bring India to your inbox.
            </h3>
            <p className="text-sm text-[#dce9e6]/80">
              Unpublished itineraries, seasonal departure discounts, and slow travel notes. Never spam.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 text-sm focus:outline-none focus:border-[#ef4934]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-[#ef4934]/30 flex-none"
            >
              <span>Join Club</span>
              <Icon name="arrow" size={16} />
            </button>
          </form>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info & Accreditation */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <button onClick={() => navigate('home')} className="flex items-center gap-3 text-left group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ef4934]/40 bg-[#ef4934] p-0.5">
                <img src="/IMG_1611.PNG" alt="Crazy Tours Travels Icon" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-[22px] tracking-tight text-white group-hover:text-[#ffd0c7] transition-colors">
                  CRAZY
                </span>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#ef4934]">
                  Tours Travels
                </span>
              </div>
            </button>
            <p className="text-sm text-[#dce9e6]/75 leading-relaxed">
              Travel made genuinely human. Curated departures, verified heritage properties, private chauffeur
              transfers, and 24/7 dedicated local concierge support across India and beyond.
            </p>
            <div className="pt-2 text-xs text-[#dce9e6]/90 space-y-1.5">
              <p className="flex items-center gap-2">
                <Icon name="phone" size={14} className="text-[#ef4934]" />
                <span>Mon–Sat · 9:00–20:00 IST: <strong>+91 8047 112 112</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="mail" size={14} className="text-[#ef4934]" />
                <span>concierge@crazytourstravels.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="pin" size={14} className="text-[#ef4934]" />
                <span>Offices in Mumbai, New Delhi & Bengaluru</span>
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-md text-white/80 font-bold">
                IATA Accredited
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-md text-white/80 font-bold">
                Ministry of Tourism Certified
              </span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Discover</h4>
            <ul className="space-y-2 text-sm text-[#dce9e6]/75">
              <li>
                <button onClick={() => navigate('packages')} className="hover:text-white transition-colors">
                  All Holiday Packages
                </button>
              </li>
              <li>
                <button onClick={() => navigate('stays')} className="hover:text-white transition-colors">
                  Boutique Stays & Havelis
                </button>
              </li>
              <li>
                <button onClick={() => navigate('road-trips')} className="hover:text-white transition-colors">
                  Scenic Road Expeditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('destination/srinagar')} className="hover:text-white transition-colors">
                  Kashmir Spring Journeys
                </button>
              </li>
              <li>
                <button onClick={() => navigate('destination/udaipur')} className="hover:text-white transition-colors">
                  Royal Rajasthan Circuit
                </button>
              </li>
              <li>
                <button onClick={() => navigate('destination/andaman')} className="hover:text-white transition-colors">
                  Andaman Coral Escapes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Plan & Customize */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Plan & Design</h4>
            <ul className="space-y-2 text-sm text-[#dce9e6]/75">
              <li>
                <button onClick={() => navigate('custom-trip')} className="text-[#ffd0c7] font-semibold hover:text-white transition-colors">
                  ✦ Custom Trip Designer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('offers')} className="text-[#ef4934] font-semibold hover:underline">
                  Crazy Deals & Vouchers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('stories')} className="hover:text-white transition-colors">
                  The Travel Journal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('manage-booking')} className="hover:text-white transition-colors">
                  Manage My Booking
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Find Nearest Branch
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Company & Trust</h4>
            <ul className="space-y-2 text-sm text-[#dce9e6]/75">
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
                  About Crazy Tours Travels
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help')} className="hover:text-white transition-colors">
                  Help Centre & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
                  Booking Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#dce9e6]/50 gap-4">
          <p>© 2026 Crazy Tours Travels Co. All rights reserved. GST & Ministry of Tourism registered.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('terms')} className="hover:underline">
              Terms & Conditions
            </button>
            <button onClick={() => navigate('privacy')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => navigate('help')} className="hover:underline">
              Refund Policies
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
