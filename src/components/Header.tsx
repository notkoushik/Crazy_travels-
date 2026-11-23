import React, { useState } from 'react'
import { Currency, RouteName } from '../types/travel'
import { Icon } from './Icon'
import { CrazyToursLogo } from './CrazyToursLogo'
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
  showFlightCircle?: boolean
  onOpenExpressInterest?: () => void
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
  showFlightCircle = false,
  onOpenExpressInterest,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNav = (route: RouteName) => {
    navigate(route)
    setMobileMenuOpen(false)
  }

  return (
    <header className="relative z-40 bg-white">
      {/* Main Navigation Row */}
      <div className="border-b border-[#dfe5df]/80 bg-white sticky top-0 z-30 shadow-xs">
        <div className="shell nav-row flex items-center justify-between">
          {/* Brand Logo with Official Vector Emblem */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center group text-left focus:outline-none"
            aria-label="Crazy Tours Travels Home"
          >
            <CrazyToursLogo size={40} showWordmark={true} />
          </button>

          {/* Desktop Navigation Links — Refined Typography & Balanced Spacing */}
          <nav className="desktop-nav hidden lg:flex items-center gap-7 xl:gap-9">
            <button
              onClick={() => handleNav('home')}
              className={`nav-item-link font-inter font-medium text-[15px] tracking-tight transition-colors ${
                currentRoute === 'home' ? 'active text-[#072f2b] font-semibold' : 'text-[#374e47] hover:text-[#072f2b]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('packages')}
              className={`nav-item-link font-inter font-medium text-[15px] tracking-tight transition-colors ${
                currentRoute === 'packages' || currentRoute.startsWith('package/') ? 'active text-[#072f2b] font-semibold' : 'text-[#374e47] hover:text-[#072f2b]'
              }`}
            >
              Holidays & Packages
            </button>
            <button
              onClick={() => handleNav('stays')}
              className={`nav-item-link font-inter font-medium text-[15px] tracking-tight transition-colors ${
                currentRoute === 'stays' ? 'active text-[#072f2b] font-semibold' : 'text-[#374e47] hover:text-[#072f2b]'
              }`}
            >
              Stays & Resorts
            </button>
            <button
              onClick={() => handleNav('road-trips')}
              className={`nav-item-link font-inter font-medium text-[15px] tracking-tight transition-colors ${
                currentRoute === 'road-trips' ? 'active text-[#072f2b] font-semibold' : 'text-[#374e47] hover:text-[#072f2b]'
              }`}
            >
              Road Trips
            </button>
            <button
              onClick={() => handleNav('stories')}
              className={`nav-item-link font-inter font-medium text-[15px] tracking-tight transition-colors ${
                currentRoute === 'stories' ? 'active text-[#072f2b] font-semibold' : 'text-[#374e47] hover:text-[#072f2b]'
              }`}
            >
              Travel Stories
            </button>
          </nav>

          {/* Action Buttons: Wishlist, Sign in, Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Saved Trips Heart Button */}
            <button
              onClick={onOpenSaved}
              className="relative w-10 h-10 rounded-full border border-gray-200/90 hover:border-[#ef4934] text-[#173631] hover:text-[#ef4934] transition-all bg-white shadow-xs flex items-center justify-center active:scale-95"
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
              className="h-10 px-5 rounded-full bg-[#072f2b] hover:bg-[#0b4941] text-white text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2 active:scale-95 border border-emerald-900/30"
            >
              <Icon name="user" size={15} />
              <span className="hidden sm:inline font-medium">
                {user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Flight Circle Icon Button (converts from Express Interest card when closed) */}
            {showFlightCircle && (
              <button
                type="button"
                onClick={onOpenExpressInterest}
                className="group relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#ef4934] to-[#d83520] hover:from-[#f2523d] hover:to-[#e23b25] text-white shadow-md hover:shadow-xl hover:shadow-[#ef4934]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/30 cursor-pointer animate-in fade-in zoom-in-75"
                title="Plan Custom Trip · Express Interest (Verified Concierge)"
                aria-label="Open Trip Inquiry / Express Interest"
              >
                {/* Live Emerald Pulse Dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white shadow-xs"></span>
                </span>

                {/* Sleek Aerodynamic Flight SVG Vector */}
                <svg
                  className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 drop-shadow-xs"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 16.2L12.8 12.8V3.5C12.8 2.67 12.13 2 11.3 2C10.47 2 9.8 2.67 9.8 3.5V12.8L1.6 15.8V17.8L9.8 15.3V20.5L7.5 22V23.5L11.3 22.5L15.1 23.5V22L12.8 20.5V15.3L22 18.2V16.2Z" />
                </svg>
              </button>
            )}

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
                href="https://wa.me/918894998808?text=Hi%20Crazy%20Tours%20Travels,%20I%20would%20like%20to%20plan%20a%20trip"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-green-700 font-semibold"
              >
                <Icon name="whatsapp" size={18} /> WhatsApp: +91 88949 98808
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
