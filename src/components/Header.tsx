import React, { useState } from 'react'
import { Currency, RouteName } from '../types/travel'
import { Icon } from './Icon'
import { services } from '../data/travelData'

interface HeaderProps {
  currentRoute: RouteName
  navigate: (route: RouteName) => void
  savedCount: number
  onOpenSaved: () => void
  onOpenAuth: () => void
  onOpenCurrency: () => void
  currentCurrency: Currency
  user: { name: string; email: string } | null
}

export function Header({
  currentRoute,
  navigate,
  savedCount,
  onOpenSaved,
  onOpenAuth,
  onOpenCurrency,
  currentCurrency,
  user,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNav = (route: RouteName) => {
    navigate(route)
    setMobileMenuOpen(false)
  }

  return (
    <header className="relative z-40 bg-white">
      {/* Top Utility Bar */}
      <div className="utility-bar bg-[#072f2b] text-[#dce9e6] py-1.5 border-b border-[#0b4941]/40 text-xs">
        <div className="shell flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#ffd0c7]">
              <Icon name="shield" size={13} />
              24/7 Verified Travel Concierge
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <button
              onClick={() => handleNav('contact')}
              className="hidden md:inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Icon name="pin" size={13} /> Our Stores & Offices
            </button>
            <span className="hidden lg:inline text-white/40">|</span>
            <button
              onClick={() => handleNav('manage-booking')}
              className="hidden lg:inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Icon name="search" size={13} /> Manage My Booking
            </button>
            <span className="hidden sm:inline text-white/40">|</span>
            <button
              onClick={() => handleNav('admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ef4934]/25 hover:bg-[#ef4934] text-[#ffd0c7] hover:text-white border border-[#ef4934]/40 text-[11px] font-bold transition-all shadow-xs"
              title="Open Admin Operations Command Center"
            >
              <Icon name="settings" size={12} />
              <span>Admin Portal</span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="tel:+918047112112"
              className="flex items-center gap-1.5 font-semibold text-white hover:text-[#ffd0c7] transition-colors"
            >
              <Icon name="phone" size={13} />
              <span className="hidden sm:inline">Call Toll-Free:</span> +91 8047 112 112
            </a>
            <button
              onClick={onOpenCurrency}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white transition-colors"
              aria-label="Change currency or language"
            >
              <Icon name="globe" size={13} />
              <span>EN / {currentCurrency}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="border-b border-[#dfe5df]/80 bg-white sticky top-0 z-30 shadow-xs">
        <div className="shell nav-row flex items-center justify-between">
          {/* Brand Logo with User Assets */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            aria-label="Crazy Tours Travels Home"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-none border border-emerald-950/15 bg-[#072f2b] p-0.5 group-hover:scale-105 transition-all">
              <img
                src="/IMG_1611.PNG"
                alt="Crazy Tours Travels Icon"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[22px] tracking-[-0.03em] text-[#072f2b] group-hover:text-[#0b4941] transition-colors">
                  CRAZY
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4934]"></span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#ef4934] mt-0.5">
                Tours & Travels
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav hidden lg:flex items-center gap-6">
            <button
              onClick={() => handleNav('home')}
              className={`nav-item-link ${currentRoute === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('packages')}
              className={`nav-item-link ${
                currentRoute === 'packages' || currentRoute.startsWith('package/') ? 'active' : ''
              }`}
            >
              Holidays & Packages
            </button>
            <button
              onClick={() => handleNav('stays')}
              className={`nav-item-link ${currentRoute === 'stays' ? 'active' : ''}`}
            >
              Stays & Resorts
            </button>
            <button
              onClick={() => handleNav('road-trips')}
              className={`nav-item-link ${currentRoute === 'road-trips' ? 'active' : ''}`}
            >
              Road Trips
            </button>
            <button
              onClick={() => handleNav('stories')}
              className={`nav-item-link ${currentRoute === 'stories' ? 'active' : ''}`}
            >
              Travel Stories
            </button>
            <button
              onClick={() => handleNav('offers')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                currentRoute === 'offers'
                  ? 'bg-[#ef4934] text-white shadow-sm shadow-[#ef4934]/30'
                  : 'bg-rose-50 text-[#ef4934] border border-[#ef4934]/25 hover:bg-[#ef4934] hover:text-white hover:border-[#ef4934]'
              }`}
            >
              <Icon name="tag" size={13} />
              <span>Crazy Offers</span>
              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider ${
                currentRoute === 'offers' ? 'bg-white text-[#ef4934]' : 'bg-[#ef4934] text-white'
              }`}>
                Hot
              </span>
            </button>
          </nav>

          {/* Action Buttons: Wishlist, Custom Plan CTA, Sign in, Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('custom-trip')}
              className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-gradient-to-r from-[#ef4934] to-[#f46a58] hover:from-[#df3924] hover:to-[#ef4934] text-white text-xs font-bold tracking-wide transition-all shadow-md shadow-[#ef4934]/20 hover:shadow-lg hover:shadow-[#ef4934]/30 active:scale-95"
            >
              <Icon name="sparkle" size={14} />
              <span>Plan Custom Trip</span>
            </button>

            {/* Saved Trips Heart Button */}
            <button
              onClick={onOpenSaved}
              className="relative w-10 h-10 rounded-full border border-gray-200 hover:border-[#ef4934] text-[#173631] hover:text-[#ef4934] transition-all bg-white shadow-sm flex items-center justify-center active:scale-95"
              aria-label={`${savedCount} saved trips`}
            >
              <Icon name="heart" size={18} />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 bg-[#ef4934] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {savedCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Button */}
            <button
              onClick={onOpenAuth}
              className="h-10 px-4 rounded-full bg-[#072f2b] hover:bg-[#0b4941] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Icon name="user" size={15} />
              <span className="hidden sm:inline font-medium">
                {user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 text-[#173631] hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-white z-50 overflow-y-auto border-t border-gray-200 p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b">
              Explore Journeys
            </div>
            <button
              onClick={() => handleNav('home')}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#ef4934]"
            >
              <span>Home</span>
              <Icon name="chevron" size={18} />
            </button>
            <button
              onClick={() => handleNav('packages')}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#ef4934]"
            >
              <span>Holiday Packages</span>
              <Icon name="chevron" size={18} />
            </button>
            <button
              onClick={() => handleNav('stays')}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#ef4934]"
            >
              <span>Luxury Stays & Resorts</span>
              <Icon name="chevron" size={18} />
            </button>
            <button
              onClick={() => handleNav('road-trips')}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#ef4934]"
            >
              <span>Scenic Road Trips</span>
              <Icon name="chevron" size={18} />
            </button>
            <button
              onClick={() => handleNav('stories')}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-800 hover:text-[#ef4934]"
            >
              <span>Travel Stories & Field Notes</span>
              <Icon name="chevron" size={18} />
            </button>
            <button
              onClick={() => handleNav('offers')}
              className="w-full flex items-center justify-between text-base font-semibold text-[#ef4934]"
            >
              <span className="flex items-center gap-2">
                <Icon name="tag" size={16} /> Crazy Offers & Deals
              </span>
              <Icon name="chevron" size={18} />
            </button>
            <button
              onClick={() => handleNav('custom-trip')}
              className="w-full py-3 mt-2 rounded-xl bg-[#ef4934] text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-[#ef4934]/30"
            >
              <Icon name="sparkle" size={18} /> Design a Custom Itinerary
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="w-full py-2.5 mt-2 rounded-xl bg-[#072f2b] text-white font-semibold text-center flex items-center justify-center gap-2 border border-[#0d3f38]"
            >
              <Icon name="settings" size={16} /> Open Admin Operations Portal
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <button onClick={() => handleNav('manage-booking')} className="hover:text-[#ef4934]">
                Manage My Booking
              </button>
              <button onClick={() => handleNav('contact')} className="hover:text-[#ef4934]">
                Contact Us
              </button>
              <button onClick={() => handleNav('help')} className="hover:text-[#ef4934]">
                Help Centre
              </button>
            </div>
            <div className="flex items-center justify-between pt-2">
              <a
                href="https://wa.me/918047112112"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-green-700 font-semibold"
              >
                <Icon name="whatsapp" size={18} /> WhatsApp Concierge
              </a>
              <button onClick={onOpenCurrency} className="flex items-center gap-1 font-semibold text-gray-700">
                <Icon name="globe" size={16} /> EN / {currentCurrency}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
