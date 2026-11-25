import React, { useCallback, useEffect, useState } from 'react'
import { Currency, InstagramReelItem, RouteName } from './types/travel'
import { allPackages, heroSlides, instagramReels, nationalDestinations } from './data/travelData'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Icon } from './components/Icon'
import { shouldPlaySignatureIntro, SignatureLogoIntro } from './components/SignatureLogo'

// Modals & Drawers
import { AuthModal } from './components/Modals/AuthModal'
import { SavedTripsDrawer } from './components/Modals/SavedTripsDrawer'
import { CurrencyModal } from './components/Modals/CurrencyModal'
import { LiveChatDrawer } from './components/Modals/LiveChatDrawer'
import { StoryViewerModal } from './components/Modals/StoryViewerModal'
import { TripInquiry, type InquiryContext } from './components/TripInquiry'

// Pages
import { HomePage } from './pages/HomePage'
import { PackagesPage } from './pages/PackagesPage'
import { PackageDetailPage } from './pages/PackageDetailPage'
import { DestinationPage } from './pages/DestinationPage'
import { StaysPage } from './pages/StaysPage'
import { RoadTripsPage } from './pages/RoadTripsPage'
import { StoriesPage } from './pages/StoriesPage'
import { OffersPage } from './pages/OffersPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HelpPage } from './pages/HelpPage'
import { ManageBookingPage } from './pages/ManageBookingPage'
import { TripRequestPage, type TripRequestIntent } from './pages/TripRequestPage'
import { LegalPage } from './pages/LegalPage'
import { useDynamicStore } from './services/dataStore'

const AdminPage = React.lazy(() =>
  import('./pages/AdminPage').then((module) => ({ default: module.AdminPage }))
)

function normalizeRoute(raw: string): RouteName {
  const cleaned = raw.replace(/^#\/?/, '').trim()
  if (!cleaned) return 'home'
  if (cleaned === 'custom-trip' || cleaned.startsWith('custom-trip/')) {
    const rawSlug = cleaned.slice('custom-trip/'.length).split('?')[0].toLowerCase().trim()
    const targetSlug = !rawSlug || rawSlug === 'himachal' ? 'manali' : rawSlug
    return `destination/${targetSlug}`
  }
  if (cleaned === 'destination/himachal') {
    return 'destination/manali'
  }
  return cleaned as RouteName
}

export default function App() {
  const store = useDynamicStore()

  const getInitialRoute = (): RouteName => normalizeRoute(window.location.hash)

  const [route, setRoute] = useState<RouteName>(getInitialRoute)
  const [introStage, setIntroStage] = useState<'pending' | 'revealing' | 'done'>(
    () => shouldPlaySignatureIntro() ? 'pending' : 'done',
  )
  const revealHomepage = useCallback(() => setIntroStage('revealing'), [])
  const finishIntro = useCallback(() => setIntroStage('done'), [])
  const showIntro = route === 'home' && introStage !== 'done'
  const introPlaying = showIntro && introStage === 'pending'
  const [saved, setSaved] = useState<string[]>([])
  const [currency, setCurrency] = useState<Currency>('INR')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<string>('')

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false)
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false)
  const [liveChatOpen, setLiveChatOpen] = useState(false)
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [activeStory, setActiveStory] = useState<any>(null)
  const [activeReelIndex, setActiveReelIndex] = useState(0)
  const [activeStoryReels, setActiveStoryReels] = useState<InstagramReelItem[] | null>(null)
  const catalogPackages = store.packagesLoaded || store.isLoading ? store.packages : allPackages
  const catalogDestinations = store.destinationsLoaded || store.isLoading ? store.destinations : nationalDestinations
  const catalogReels = store.reels.length > 0 ? store.reels : instagramReels
  const packageId = route.startsWith('package/') ? route.slice(8) : undefined
  const rawDestinationId = route.startsWith('destination/') ? route.slice(12) : undefined
  const destinationId = rawDestinationId === 'himachal' ? 'manali' : rawDestinationId
  const routePackage = catalogPackages.find(({ id }) => id === packageId)
  const routeDestination = catalogDestinations.find(({ slug }) => slug === destinationId)
  const tripRequest: TripRequestIntent | undefined = route === 'trip-request' ? window.history.state?.tripRequest : undefined
  const inquiryContext: InquiryContext = routeDestination
    ? { page: route, title: routeDestination.city, destination: routeDestination.city, heading: `Plan a trip to ${routeDestination.city}`, description: `Tell us when you’d like to visit and we’ll help plan your ${routeDestination.city} itinerary.` }
    : routePackage
      ? { page: route, title: routePackage.title, destination: routePackage.place, heading: `Enquire about ${routePackage.title}`, description: 'Share your travel timing and group size for a quote on this package.' }
      : { page: route, title: route === 'packages' ? 'Holidays & Packages' : undefined, heading: route === 'packages' ? 'Find your holiday package' : 'Where would you like to travel?', description: route === 'packages' ? 'Share your destination and travel dates so we can suggest matching packages.' : 'Tell us where and when you’d like to travel for a tailored itinerary.' }
  const otherPanelOpen = authModalOpen || savedDrawerOpen || currencyModalOpen || liveChatOpen || storyViewerOpen

  // Sync hash changes
  useEffect(() => {
    const sync = () => {
      setRoute(normalizeRoute(window.location.hash))
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

  const openRequestRoute = (next: 'trip-request' | 'manage-booking', state: object) => {
    window.history.pushState(state, '', `#/${next}`)
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleOpenBooking = (title: string, price: number) => {
    const pkg = routePackage?.title === title
      ? routePackage
      : catalogPackages.find((item) => item.title === title && item.priceNum === price)
    const request: TripRequestIntent = {
      entryId: crypto.randomUUID(),
      title,
      price,
      returnTo: route,
      perTraveller: !!pkg,
      image: pkg?.image ?? routeDestination?.image,
      detail: pkg?.duration ?? routeDestination?.city,
    }
    setSavedDrawerOpen(false)
    openRequestRoute('trip-request', { tripRequest: request })
  }

  const handleOpenStory = (
    story: any,
    index?: number,
    customReels?: InstagramReelItem[],
  ) => {
    setActiveStory(story)
    setActiveStoryReels(customReels ?? null)
    if (typeof index === 'number') {
      setActiveReelIndex(index)
    } else {
      setActiveReelIndex(0)
    }
    setStoryViewerOpen(true)
  }

  // Render current page based on route
  const renderCurrentPage = () => {
    if (route === 'trip-request') {
      return <TripRequestPage key={tripRequest?.entryId} request={tripRequest} currency={currency} navigate={navigate}
        onTrack={(reference) => openRequestRoute('manage-booking', { bookingLookupReference: reference })} />
    }

    if ((packageId !== undefined && !routePackage) || (destinationId !== undefined && !routeDestination)) {
      const loading = store.isLoading && (packageId !== undefined ? !store.packagesLoaded : !store.destinationsLoaded)
      return (
        <main className="shell space-y-4 py-16">
          <h1 className="text-4xl">{loading ? 'Loading journey' : 'Journey unavailable'}</h1>
          {!loading && <button type="button" onClick={() => navigate('packages')} className="quote-primary">Browse holiday packages</button>}
        </main>
      )
    }

    if (route === 'packages') {
      return (
        <PackagesPage
          packages={catalogPackages}
          navigate={navigate}
          onBook={handleOpenBooking}
          saved={saved}
          onToggleSave={toggleSaved}
          currency={currency}
        />
      )
    }

    if (routePackage) {
      const pkg = routePackage
      return (
        <PackageDetailPage
          packageItem={pkg}
          allPackages={catalogPackages}
          destinations={catalogDestinations}
          reels={catalogReels}
          navigate={navigate}
          onBook={handleOpenBooking}
          onOpenStory={handleOpenStory}
          saved={saved.includes(pkg.id)}
          onToggleSave={() => toggleSaved(pkg.id)}
          currency={currency}
          onToast={showToast}
        />
      )
    }

    if (routeDestination) {
      const dest = routeDestination
      return (
        <DestinationPage
          destination={dest}
          packages={catalogPackages}
          reels={catalogReels}
          navigate={navigate}
          onBook={handleOpenBooking}
          onOpenStory={handleOpenStory}
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
      return <ManageBookingPage navigate={navigate} initialReference={window.history.state?.bookingLookupReference} />
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
      />
    )
  }

  // Full-screen dedicated Operations Admin Layout
  if (route === 'admin' || route.startsWith('admin/')) {
    return (
      <div className="admin-shell min-h-screen bg-slate-50 text-slate-900 font-sans">
        <React.Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
                <span className="text-xs font-semibold uppercase tracking-wider">Loading Operations Console…</span>
              </div>
            </div>
          }
        >
          <AdminPage route={route} navigate={navigate} onToast={showToast} />
        </React.Suspense>
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

  const site = introPlaying ? null : (
    <div
      className="travel-site min-h-screen bg-[#fbfaf7] text-[#173631] font-sans flex flex-col justify-between selection:bg-[#ef4934] selection:text-white"
      inert={showIntro}
    >
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
      />

      {/* Main Routed Page Content */}
      <div className="flex-1">{renderCurrentPage()}</div>

      {/* Global Branded Footer */}
      <Footer navigate={navigate} onToast={showToast} />

      {/* High-Quality WhatsApp Live Concierge Button */}

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
        onClose={() => {
          setStoryViewerOpen(false)
          setActiveStoryReels(null)
        }}
        story={activeStory}
        reels={activeStoryReels ?? catalogReels}
        currentIndex={activeReelIndex}
        onChangeIndex={setActiveReelIndex}
      />

      {route !== 'trip-request' && route !== 'manage-booking' && (
        <TripInquiry key={route} context={inquiryContext} paused={otherPanelOpen}
          destinations={store.destinations} />
      )}
    </div>
  )

  return (
    <>
      {site}
      {introPlaying && (
        <link rel="preload" as="image" href={(store.heroSlides[0] ?? heroSlides[0]).image} />
      )}
      {showIntro && <SignatureLogoIntro onReveal={revealHomepage} onFinish={finishIntro} />}
    </>
  )
}
