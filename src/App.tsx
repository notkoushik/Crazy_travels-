import React, { useEffect, useRef, useState } from 'react'
import { Currency, RouteName } from './types/travel'
import { allPackages, nationalDestinations } from './data/travelData'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Icon } from './components/Icon'

// Modals & Drawers
import { AuthModal } from './components/Modals/AuthModal'
import { SavedTripsDrawer } from './components/Modals/SavedTripsDrawer'
import { BookingModal } from './components/Modals/BookingModal'
import { CurrencyModal } from './components/Modals/CurrencyModal'
import { LiveChatDrawer } from './components/Modals/LiveChatDrawer'
import { StoryViewerModal } from './components/Modals/StoryViewerModal'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { TripInquiry } from './components/TripInquiry'

// Pages
import { HomePage } from './pages/HomePage'
import { PackagesPage } from './pages/PackagesPage'
import { PackageDetailPage } from './pages/PackageDetailPage'
import { DestinationPage } from './pages/DestinationPage'
import { StaysPage } from './pages/StaysPage'
import { RoadTripsPage } from './pages/RoadTripsPage'
import { StoriesPage } from './pages/StoriesPage'
import { OffersPage } from './pages/OffersPage'
import { CustomTripPage } from './pages/CustomTripPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HelpPage } from './pages/HelpPage'
import { ManageBookingPage } from './pages/ManageBookingPage'
import { LegalPage } from './pages/LegalPage'
import { AdminPage } from './pages/AdminPage'
import { useDynamicStore } from './services/dataStore'

export default function App() {
  const store = useDynamicStore()

  const getInitialRoute = (): RouteName => {
    const raw = window.location.hash.replace(/^#\/?/, '')
    if (!raw) return 'home'
    return raw as RouteName
  }

  const [route, setRoute] = useState<RouteName>(getInitialRoute)
  const [saved, setSaved] = useState<string[]>(['Udaipur', 'kashmir-tulips'])
  const [currency, setCurrency] = useState<Currency>('INR')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<string>('')

  // Express Interest / Hero Inquiry State
  const [isHeroInquiryOpen, setIsHeroInquiryOpen] = useState(true)
  const [reopenHeroInquiry, setReopenHeroInquiry] = useState(false)
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)
  const inquiryLauncherRef = useRef<HTMLButtonElement>(null)

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false)
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false)
  const [liveChatOpen, setLiveChatOpen] = useState(false)
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [activeStory, setActiveStory] = useState<any>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [bookingItem, setBookingItem] = useState<{ title: string; price: number }>({
    title: 'Custom Travel Inquiry',
    price: 36800,
  })

  const handleOpenExpressInterest = () => {
    if (route !== 'home' || !window.matchMedia('(min-width: 64rem)').matches) {
      setInquiryModalOpen(true)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || window.scrollY <= 4) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      setIsHeroInquiryOpen(true)
      return
    }

    setReopenHeroInquiry(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!reopenHeroInquiry) return
    if (route !== 'home') {
      setReopenHeroInquiry(false)
      return
    }

    const revealAtTop = () => {
      if (window.scrollY > 4) return
      setIsHeroInquiryOpen(true)
      setReopenHeroInquiry(false)
    }
    const finishScroll = () => {
      revealAtTop()
      setReopenHeroInquiry(false)
    }

    revealAtTop()
    window.addEventListener('scroll', revealAtTop, { passive: true })
    document.addEventListener('scrollend', finishScroll)
    return () => {
      window.removeEventListener('scroll', revealAtTop)
      document.removeEventListener('scrollend', finishScroll)
    }
  }, [reopenHeroInquiry, route])

  // Sync hash changes
  useEffect(() => {
    const sync = () => {
      const raw = window.location.hash.replace(/^#\/?/, '')
      setRoute((raw || 'home') as RouteName)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const navigate = (next: RouteName) => {
    window.location.hash = next === 'home' ? '/' : `/${next}`
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(''), 4500)
  }

  const toggleSaved = (id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleOpenBooking = (title: string, price: number) => {
    setBookingItem({ title, price })
    setBookingModalOpen(true)
  }

  const handleOpenStory = (story: any) => {
    setActiveStory(story)
    setStoryViewerOpen(true)
  }

  // Render current page based on route
  const renderCurrentPage = () => {
    if (route === 'admin') {
      return <AdminPage navigate={navigate} onToast={showToast} />
    }

    if (route === 'packages') {
      return (
        <PackagesPage
          navigate={navigate}
          onBook={handleOpenBooking}
          saved={saved}
          onToggleSave={toggleSaved}
          currency={currency}
        />
      )
    }

    if (route.startsWith('package/')) {
      const pkgId = route.replace('package/', '')
      const pkg = store.packages.find((p) => p.id === pkgId) || store.packages[0]
      return (
        <PackageDetailPage
          packageItem={pkg}
          navigate={navigate}
          onBook={handleOpenBooking}
          saved={saved.includes(pkg.id)}
          onToggleSave={() => toggleSaved(pkg.id)}
          currency={currency}
        />
      )
    }

    if (route.startsWith('destination/')) {
      const slug = route.replace('destination/', '')
      const dest =
        store.destinations.find((d) => d.slug === slug) ??
        nationalDestinations.find((d) => d.slug === slug) ??
        store.destinations[0] ??
        nationalDestinations[0]
      return (
        <DestinationPage
          destination={dest}
          navigate={navigate}
          onBook={handleOpenBooking}
          saved={saved.includes(dest.city)}
          onToggleSave={() => toggleSaved(dest.city)}
          currency={currency}
        />
      )
    }

    if (route === 'stays') {
      return <StaysPage navigate={navigate} onBook={handleOpenBooking} currency={currency} />
    }

    if (route === 'road-trips') {
      return <RoadTripsPage navigate={navigate} onBook={handleOpenBooking} currency={currency} />
    }

    if (route === 'stories') {
      return <StoriesPage navigate={navigate} />
    }

    if (route === 'offers') {
      return (
        <OffersPage
          navigate={navigate}
          onToast={showToast}
          onBook={handleOpenBooking}
        />
      )
    }

    if (route === 'custom-trip') {
      return <CustomTripPage navigate={navigate} onToast={showToast} />
    }

    if (route === 'about') {
      return <AboutPage navigate={navigate} />
    }

    if (route === 'contact') {
      return <ContactPage navigate={navigate} onToast={showToast} />
    }

    if (route === 'help') {
      return <HelpPage navigate={navigate} onToast={showToast} />
    }

    if (route === 'manage-booking') {
      return <ManageBookingPage navigate={navigate} onToast={showToast} />
    }

    if (route === 'terms') {
      return <LegalPage initialTab="terms" navigate={navigate} />
    }

    if (route === 'privacy') {
      return <LegalPage initialTab="privacy" navigate={navigate} />
    }

    // Default fallback to home
    return (
      <HomePage
        navigate={navigate}
        saved={saved}
        onToggleSave={toggleSaved}
        onBook={handleOpenBooking}
        currency={currency}
        onToast={showToast}
        onOpenStory={handleOpenStory}
        isHeroInquiryOpen={isHeroInquiryOpen}
        onCloseHeroInquiry={() => setIsHeroInquiryOpen(false)}
        inquiryLauncherRef={inquiryLauncherRef}
      />
    )
  }

  // Full-screen dedicated Operations Admin Layout
  if (route === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <AdminPage navigate={navigate} onToast={showToast} />
        {toastMessage && (
          <div className="global-toast animate-bounce-in flex items-center gap-3">
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage('')}
              className="p-1 rounded-full hover:bg-white/20"
              aria-label="Dismiss message"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#173631] font-sans flex flex-col justify-between selection:bg-[#ef4934] selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentRoute={route}
        navigate={navigate}
        savedCount={saved.length}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCurrency={() => setCurrencyModalOpen(true)}
        currentCurrency={currency}
        user={user}
        inlineInquiryOpen={isHeroInquiryOpen && route === 'home'}
        inquiryLauncherRef={inquiryLauncherRef}
        onOpenExpressInterest={handleOpenExpressInterest}
      />

      {/* Main Routed Page Content */}
      <div className="flex-1">{renderCurrentPage()}</div>

      {/* Global Branded Footer */}
      <Footer navigate={navigate} onToast={showToast} />

      {/* High-Quality WhatsApp Live Concierge Button */}
      <WhatsAppFloat placement={route === 'home' ? 'desktop-floating' : 'floating'} />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="global-toast animate-bounce-in flex items-center gap-3">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="p-1 rounded-full hover:bg-white/20"
            aria-label="Dismiss message"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* Auth / Account Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onLogin={setUser}
        onLogout={() => setUser(null)}
        onToast={showToast}
      />

      {/* Saved Trips Drawer */}
      <SavedTripsDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedIds={saved}
        onRemove={toggleSaved}
        onClear={() => {
          setSaved([])
          showToast('Wishlist cleared.')
        }}
        destinations={store.destinations}
        packages={store.packages}
        navigate={navigate}
        currency={currency}
        onBook={handleOpenBooking}
      />

      {/* Booking & Quote Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        itemTitle={bookingItem.title}
        basePrice={bookingItem.price}
        currency={currency}
        onToast={showToast}
      />

      {/* Currency & Language Modal */}
      <CurrencyModal
        isOpen={currencyModalOpen}
        onClose={() => setCurrencyModalOpen(false)}
        currentCurrency={currency}
        onSelectCurrency={setCurrency}
        onToast={showToast}
      />

      {/* Live Concierge Chat Drawer */}
      <LiveChatDrawer
        isOpen={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        onToast={showToast}
      />

      {/* Social Story Player Modal */}
      <StoryViewerModal
        isOpen={storyViewerOpen}
        onClose={() => setStoryViewerOpen(false)}
        story={activeStory}
      />

      <TripInquiry
        modal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        launcherRef={inquiryLauncherRef}
      />
    </div>
  )
}
