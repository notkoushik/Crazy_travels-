import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  BookingSubmission,
  DestinationItem,
  InquirySubmission,
  OfferItem,
  PackageItem,
  StayItem,
} from '../../types/travel'
import { useDynamicStore } from '../../services/dataStore'
import { AdminPageProps, AdminTab } from './types'

// Components
import { AdminHeader } from './components/AdminHeader'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminLoginScreen } from './components/AdminLoginScreen'

// Tabs
import { DashboardTab } from './tabs/DashboardTab'
import { DestinationsTab } from './tabs/DestinationsTab'
import { PackagesTab } from './tabs/PackagesTab'
import { StaysTab } from './tabs/StaysTab'
import { BookingsTab } from './tabs/BookingsTab'
import { InquiriesTab } from './tabs/InquiriesTab'
import { OffersTab } from './tabs/OffersTab'
import { ReelsTab } from './tabs/ReelsTab'
import { SettingsTab } from './tabs/SettingsTab'
import { StorefrontStudioPage } from './tabs/StorefrontStudioPage'

import { DestinationEditor } from './components/DestinationEditor'
import { PackageEditor } from './components/PackageEditor'
import { StayEditor } from './components/StayEditor'
import { OfferModal } from './modals/OfferModal'

// Drawers
import { BookingDrawer } from './drawers/BookingDrawer'
import { InquiryDrawer } from './drawers/InquiryDrawer'

const adminTabs = {
  dashboard: 'Dashboard',
  destinations: 'Destinations',
  packages: 'Tour packages',
  stays: 'Stays & hotels',
  bookings: 'Bookings',
  inquiries: 'Inquiries',
  offers: 'Offers',
  reels: 'Instagram Reels',
  storefront: 'Storefront Studio',
  settings: 'Database sync',
} satisfies Record<AdminTab, string>

function AdminDashboardContent({
  route,
  navigate,
  onToast,
  onLogout,
}: {
  route: AdminPageProps['route']
  navigate: AdminPageProps['navigate']
  onToast: AdminPageProps['onToast']
  onLogout: () => void
}) {
  const store = useDynamicStore()
  const [, tab, mode, recordId] = route.split('/')
  const activeTab = (Object.keys(adminTabs) as AdminTab[]).find((item) => item === tab) ?? 'dashboard'
  const editorOpen = (mode === 'new' || mode === 'edit') && ['packages', 'stays', 'destinations'].includes(activeTab)
  const setActiveTab = (next: AdminTab) => navigate(next === 'dashboard' ? 'admin' : `admin/${next}`)
  const closeEditor = () => setActiveTab(activeTab)
  const workArea = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    workArea.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  const [stayFilter, setStayFilter] = useState('All')

  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null)
  const [isNewOffer, setIsNewOffer] = useState(false)

  // Drawers state
  const [selectedBooking, setSelectedBooking] = useState<BookingSubmission | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<InquirySubmission | null>(null)

  // Booking status filter
  const [bookingFilter, setBookingFilter] = useState<string>('ALL')

  // Computed statistics
  const totalRevenue = store.bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  const confirmedBookingsCount = store.bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Voucher Issued'
  ).length
  const newInquiriesCount = store.inquiries.filter((inq) => inq.status === 'New').length

  // Handlers - Destinations
  const handleSaveDestination = async (dest: DestinationItem) => {
    await store.saveDestination(dest)
    onToast(`Destination “${dest.city}” saved.`)
    if (window.location.hash.replace(/^#\/?/, '') === route) closeEditor()
  }

  const handleDeleteDestination = async (dest: DestinationItem) => {
    if (window.confirm(`Delete destination "${dest.city}" from PostgreSQL?`)) {
      try {
        await store.deleteDestination(dest.slug)
        onToast(`Deleted destination "${dest.city}"`)
      } catch (err: any) {
        onToast(`Failed to delete: ${err.message}`)
      }
    }
  }

  // Handlers - Packages
  const handleSavePackage = async (pkg: PackageItem) => {
    await store.savePackage(pkg)
    onToast(`Package “${pkg.title}” saved.`)
    if (window.location.hash.replace(/^#\/?/, '') === route) closeEditor()
  }

  const handleDeletePackage = async (pkg: PackageItem) => {
    if (window.confirm(`Delete package "${pkg.title}"?`)) {
      try {
        await store.deletePackage(pkg.id)
        onToast(`Deleted package "${pkg.title}"`)
      } catch (err: any) {
        onToast(`Failed to delete package: ${err.message}`)
      }
    }
  }

  // Handlers - Stays
  const handleSaveStay = async (stay: StayItem) => {
    await store.saveStay(stay)
    onToast(`Property “${stay.name}” saved.`)
    if (window.location.hash.replace(/^#\/?/, '') === route) closeEditor()
  }

  const handleDeleteStay = async (stay: StayItem) => {
    if (window.confirm(`Delete stay "${stay.name}"?`)) {
      try {
        await store.deleteStay(stay.id)
        onToast(`Deleted stay "${stay.name}"`)
      } catch (err: any) {
        onToast(`Failed to delete stay: ${err.message}`)
      }
    }
  }

  // Handlers - Offers
  const handleSaveOffer = async (offer: OfferItem) => {
    try {
      await store.saveOffer(offer)
      onToast(`Promotion "${offer.code}" saved to database!`)
      setEditingOffer(null)
    } catch (err: any) {
      onToast(`Failed to save offer: ${err.message}`)
    }
  }

  const handleDeleteOffer = async (offer: OfferItem) => {
    if (window.confirm(`Delete promo code "${offer.code}"?`)) {
      try {
        await store.deleteOffer(offer.id)
        onToast(`Deleted offer "${offer.code}"`)
      } catch (err: any) {
        onToast(`Failed to delete offer: ${err.message}`)
      }
    }
  }

  const handleOpenNewOffer = () => {
    setEditingOffer({
      id: `offer-${Date.now()}`,
      code: 'ROYAL15',
      title: 'Summer Palace Retreat',
      discountText: '15% Off Heritage Bookings',
      tag: 'Limited Time',
      validTill: '31 Aug 2026',
      description: 'Exclusive seasonal concession for couples and family departures.',
      minBooking: 'Min. Booking ₹40,000',
      image:
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
    })
    setIsNewOffer(true)
  }

  // Handlers - Bookings & Inquiries Status
  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: BookingSubmission['status']
  ) => {
    try {
      await store.updateBookingStatus(bookingId, status)
      onToast(`Booking ${bookingId} updated to "${status}"`)
    } catch (err: any) {
      onToast(`Failed to update booking: ${err.message}`)
    }
  }

  const handleIssueVoucher = async (booking: BookingSubmission) => {
    try {
      await store.updateBookingStatus(booking.bookingId, 'Voucher Issued')
      onToast(`Voucher status updated for #${booking.bookingId}.`)
      setSelectedBooking(null)
    } catch (err: any) {
      onToast(`Error issuing voucher: ${err.message}`)
    }
  }

  const handleUpdateInquiryStatus = async (id: string, status: InquirySubmission['status']) => {
    try {
      await store.updateInquiryStatus(id, status)
      onToast(`Inquiry ${id} updated in PostgreSQL as ${status}!`)
    } catch (err: any) {
      onToast(`Failed to update inquiry: ${err.message}`)
    }
  }

  const handleResetData = async () => {
    if (
      window.confirm(
        'Reload and sync all destinations, packages, stays, bookings and inquiries directly from PostgreSQL 18?'
      )
    ) {
      await store.refresh()
      onToast('Synced latest data from PostgreSQL 18.')
    }
  }

  const renderInventoryEditor = () => {
    const isNew = mode === 'new'
    const matchesId = (id: string) => encodeURIComponent(id) === recordId

    if (activeTab === 'destinations') {
      const destination = store.destinations.find(({ slug }) => matchesId(slug))
      if (isNew || destination) return <DestinationEditor key={route} destination={destination} onBack={closeEditor} onSave={handleSaveDestination} />
    }
    if (activeTab === 'packages') {
      const pkg = store.packages.find(({ id }) => matchesId(id))
      if (isNew || pkg) return <PackageEditor key={route} pkg={pkg} onBack={closeEditor} onSave={handleSavePackage} />
    }
    if (activeTab === 'stays') {
      const stay = store.stays.find(({ id }) => matchesId(id))
      if (isNew || stay) return <StayEditor key={route} stay={stay} onBack={closeEditor} onSave={handleSaveStay} />
    }

    return (
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-semibold">{store.isLoading ? 'Loading listing…' : 'Listing unavailable'}</h1>
        <button type="button" onClick={closeEditor} className="mt-3 text-sm font-semibold text-emerald-900 hover:underline">Back to list</button>
      </div>
    )
  }

  return (
    <div className="admin-panel-root flex h-dvh flex-col overflow-hidden bg-slate-50 text-slate-900 font-inter antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Admin Header */}
      <AdminHeader
        navigate={navigate}
        isDatabaseConnected={store.isDatabaseConnected}
        onLogout={onLogout}
      />

      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2 md:hidden">
        <select aria-label="Admin section" value={activeTab} onChange={(event) => setActiveTab(event.target.value as AdminTab)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800">
          {Object.entries(adminTabs).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </div>

      {/* Main Admin Workspace */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Modular Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          destinationsCount={store.destinations.length}
          packagesCount={store.packages.length}
          staysCount={store.stays.length}
          bookingsCount={store.bookings.length}
          newInquiriesCount={newInquiriesCount}
          offersCount={store.offers.length}
        />

        {/* Dynamic Center Work Area */}
        <main ref={workArea} className="min-w-0 flex-1 overflow-y-auto scroll-pb-24 p-4 sm:p-6 lg:p-8">
          {editorOpen && renderInventoryEditor()}

          {activeTab === 'dashboard' && (
            <DashboardTab
              totalRevenue={totalRevenue}
              confirmedBookingsCount={confirmedBookingsCount}
              newInquiriesCount={newInquiriesCount}
              destinationsCount={store.destinations.length}
              bookings={store.bookings}
              inquiries={store.inquiries}
              setActiveTab={setActiveTab}
              setSelectedBooking={setSelectedBooking}
              setSelectedInquiry={setSelectedInquiry}
              onAddNewDestination={() => navigate('admin/destinations/new')}
              onAddNewPackage={() => navigate('admin/packages/new')}
            />
          )}

          {activeTab === 'destinations' && !editorOpen && (
            <DestinationsTab
              destinations={store.destinations}
              onAddNewDestination={() => navigate('admin/destinations/new')}
              onEditDestination={(dest) => navigate(`admin/destinations/edit/${encodeURIComponent(dest.slug)}`)}
              onDeleteDestination={handleDeleteDestination}
            />
          )}

          {activeTab === 'packages' && !editorOpen && (
            <PackagesTab
              packages={store.packages}
              onAddNewPackage={() => navigate('admin/packages/new')}
              onEditPackage={(pkg) => navigate(`admin/packages/edit/${encodeURIComponent(pkg.id)}`)}
              onDeletePackage={handleDeletePackage}
            />
          )}

          {activeTab === 'stays' && !editorOpen && (
            <StaysTab
              stays={store.stays}
              stayFilter={stayFilter}
              setStayFilter={setStayFilter}
              onAddNewStay={() => navigate('admin/stays/new')}
              onEditStay={(stay) => navigate(`admin/stays/edit/${encodeURIComponent(stay.id)}`)}
              onDeleteStay={handleDeleteStay}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={store.bookings}
              bookingFilter={bookingFilter}
              setBookingFilter={setBookingFilter}
              onSelectBooking={setSelectedBooking}
              onUpdateBookingStatus={handleUpdateBookingStatus}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={store.inquiries}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onSelectInquiry={setSelectedInquiry}
            />
          )}

          {activeTab === 'offers' && (
            <OffersTab
              offers={store.offers}
              onAddNewOffer={handleOpenNewOffer}
              onEditOffer={(offer) => {
                setEditingOffer(offer)
                setIsNewOffer(false)
              }}
              onDeleteOffer={handleDeleteOffer}
            />
          )}

          {activeTab === 'reels' && (
            <ReelsTab
              reels={store.reels}
              onSaveReel={store.saveReel}
              onDeleteReel={store.deleteReel}
              onToast={onToast}
            />
          )}

          {activeTab === 'storefront' && (
            <StorefrontStudioPage
              storefront={store.storefront}
              destinations={store.destinations}
              packages={store.packages}
              stays={store.stays}
              reviews={store.reviews}
              onSaveSpecial={store.saveSpecial}
              onSaveBoardFeature={store.saveBoardFeature}
              onSaveBrandPillars={store.saveBrandPillars}
              onSaveTrustStats={store.saveTrustStats}
              onSaveSectionHeader={store.saveSectionHeader}
              onSaveCuratedSelection={store.saveCuratedSelection}
              onToast={onToast}
              navigate={navigate}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              isDatabaseConnected={store.isDatabaseConnected}
              destinationsCount={store.destinations.length}
              packagesCount={store.packages.length}
              staysCount={store.stays.length}
              bookingsCount={store.bookings.length}
              inquiriesCount={store.inquiries.length}
              offersCount={store.offers.length}
              onRefresh={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {editingOffer && (
        <OfferModal
          offer={editingOffer}
          isNew={isNewOffer}
          onClose={() => setEditingOffer(null)}
          onSave={handleSaveOffer}
          onChange={setEditingOffer}
        />
      )}

      {/* Drawers */}
      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onIssueVoucher={() => handleIssueVoucher(selectedBooking)}
        />
      )}

      {selectedInquiry && (
        <InquiryDrawer
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdateStatus={handleUpdateInquiryStatus}
        />
      )}
    </div>
  )
}

export function AdminPage({ route, navigate, onToast }: AdminPageProps) {
  const store = useDynamicStore()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => store.isAdminAuthenticated())

  // Synchronize admin customer data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      store.fetchAdminData().catch((err) => {
        console.warn('Initial admin data hydration:', err)
      })
    }
  }, [isAuthenticated])

  // If not authenticated, render secure Authorization Gate
  if (!isAuthenticated) {
    return (
      <AdminLoginScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true)
          store.fetchAdminData().catch(console.error)
        }}
        navigate={navigate}
        onToast={onToast}
      />
    )
  }

  return (
    <AdminDashboardContent
      route={route}
      navigate={navigate}
      onToast={onToast}
      onLogout={() => {
        store.adminLogout()
        setIsAuthenticated(false)
        onToast('Operations Console locked. Customer records cleared from memory.')
      }}
    />
  )
}
