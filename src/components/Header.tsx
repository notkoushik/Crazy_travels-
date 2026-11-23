import { useState } from 'react'
import type { Currency, RouteName } from '../types/travel'
import { Icon } from './Icon'
import { CrazyToursLogo } from './CrazyToursLogo'

const navigation = [
  { route: 'home', label: 'Home' },
  { route: 'packages', label: 'Holidays & Packages' },
  { route: 'stays', label: 'Stays & Resorts' },
  { route: 'road-trips', label: 'Road Trips' },
  { route: 'stories', label: 'Travel Stories' },
] as const

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
  const accountLabel = user?.name.split(' ')[0] || 'Sign In'

  const handleNav = (route: RouteName) => {
    navigate(route)
    setMobileMenuOpen(false)
  }

  const isCurrent = (route: RouteName) =>
    currentRoute === route || (route === 'packages' && currentRoute.startsWith('package/'))

  return (
    <header className="site-header">
      <div className="site-nav-row">
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="site-brand"
          aria-label="Crazy Tours Travel home"
        >
          <CrazyToursLogo />
        </button>

        <nav className="site-nav-links" aria-label="Main navigation">
          {navigation.map(({ route, label }) => (
            <button
              key={route}
              type="button"
              onClick={() => handleNav(route)}
              aria-current={isCurrent(route) ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="site-nav-actions">
          <button
            type="button"
            onClick={onOpenSaved}
            className="site-nav-action site-saved-button"
            aria-label={`${savedCount} saved trips`}
          >
            <Icon name="heart" size={19} />
            {savedCount > 0 && <span className="site-saved-count">{savedCount}</span>}
          </button>
          <button
            type="button"
            onClick={onOpenAuth}
            className="site-nav-action site-account-button"
            aria-label={user ? `Account for ${user.name}` : 'Sign in'}
          >
            <Icon name="user" size={17} />
            <span>{accountLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="site-nav-action site-menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className="site-mobile-menu" hidden={!mobileMenuOpen} aria-label="Mobile navigation">
        <div className="site-mobile-links">
          {navigation.map(({ route, label }) => (
            <button
              key={route}
              type="button"
              onClick={() => handleNav(route)}
              aria-current={isCurrent(route) ? 'page' : undefined}
            >
              {label}
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </div>
        <div className="site-mobile-tools">
          <button type="button" onClick={() => handleNav('manage-booking')}>Manage My Booking</button>
          <button type="button" onClick={() => handleNav('contact')}>Contact Us</button>
          <button type="button" onClick={() => handleNav('help')}>Help Centre</button>
          <button type="button" onClick={() => handleNav('admin')}>Admin Operations Portal</button>
          <a
            href="https://wa.me/918894998808?text=Hi%20Crazy%20Tours%20Travels,%20I%20would%20like%20to%20plan%20a%20trip"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={17} /> WhatsApp
          </a>
          <button type="button" onClick={onOpenCurrency}>
            <Icon name="globe" size={16} /> EN / {currentCurrency}
          </button>
        </div>
      </nav>
    </header>
  )
}
