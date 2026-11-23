import React, { useEffect, useState } from 'react'
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
import { SettingsTab } from './tabs/SettingsTab'

// Modals
import { DestinationModal } from './modals/DestinationModal'
import { PackageModal } from './modals/PackageModal'
import { StayModal } from './modals/StayModal'
import { OfferModal } from './modals/OfferModal'

// Drawers
import { BookingDrawer } from './drawers/BookingDrawer'
import { InquiryDrawer } from './drawers/InquiryDrawer'

function AdminDashboardContent({
  navigate,
  onToast,
  onLogout,
}: {
  navigate: AdminPageProps['navigate']
  onToast: AdminPageProps['onToast']
  onLogout: () => void
}) {
  const store = useDynamicStore()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

  // Modals state for editing
  const [editingDestination, setEditingDestination] = useState<DestinationItem | null>(null)
  const [isNewDestination, setIsNewDestination] = useState(false)

  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null)
  const [isNewPackage, setIsNewPackage] = useState(false)

  const [editingStay, setEditingStay] = useState<StayItem | null>(null)
  const [isNewStay, setIsNewStay] = useState(false)
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
    try {
      await store.saveDestination(dest)
      onToast(`Destination "${dest.city}" saved to PostgreSQL!`)
      setEditingDestination(null)
    } catch (err: any) {
      onToast(`Failed to save destination: ${err.message}`)
    }
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

  const handleOpenNewDestination = () => {
    setEditingDestination({
      slug: `destination-${Date.now()}`,
      city: '',
      country: 'Rajasthan',
      state: 'Rajasthan',
      price: '₹29,900',
      priceNum: 29900,
      image:
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
      season: 'October to March',
      duration: '5 days',
      tagline: 'Palaces, lakes and living royal history',
      description: 'A deep journey through historic quarters and serene waterways.',
      highlights: ['Private heritage walk', 'Sunset boat safari'],
      gallery: [],
      bestTimeToVisit: 'September to March',
      idealFor: 'Couples & Culture Seekers',
    })
    setIsNewDestination(true)
  }

  // Handlers - Packages
  const handleSavePackage = async (pkg: PackageItem) => {
    try {
      await store.savePackage(pkg)
      onToast(`Package "${pkg.title}" saved to PostgreSQL!`)
      setEditingPackage(null)
    } catch (err: any) {
      onToast(`Failed to save package: ${err.message}`)
    }
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

  const handleOpenNewPackage = () => {
    setEditingPackage({
      id: `pkg-${Date.now()}`,
      title: '',
      place: '',
      state: '',
      duration: '6 Days / 5 Nights',
      daysCount: 6,
      price: '₹38,000',
      priceNum: 38000,
      originalPrice: '₹45,000',
      discount: '15% OFF',
      rating: 4.9,
      reviewCount: 15,
      image:
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
      overview: 'Experience the royal heritage and majestic forts of Rajasthan.',
      highlights: ['Heritage walk', 'Desert sunset', 'Palace dinner'],
      inclusions: ['4-Star Stays', 'Breakfast & Dinner', 'Private Cab', 'Sightseeing Guide'],
      exclusions: ['Flight / Train tickets', 'Personal expenses', 'Entry fees at monuments'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Royal Welcome',
          description: 'Arrival at airport/station, transfer to heritage hotel, evening lake walk.',
        },
      ],
      theme: 'Heritage',
      featured: true,
    })
    setIsNewPackage(true)
  }

  // Handlers - Stays
  const handleSaveStay = async (stay: StayItem) => {
    try {
      await store.saveStay(stay)
      onToast(`Stay "${stay.name}" saved!`)
      setEditingStay(null)
    } catch (err: any) {
      onToast(`Failed to save stay: ${err.message}`)
    }
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

  const handleOpenNewStay = () => {
    setEditingStay({
      id: `stay-${Date.now()}`,
      city: 'Udaipur',
      state: 'Rajasthan',
      type: 'Heritage Stays',
      name: '',
      price: '₹14,500',
      priceNum: 14500,
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=88',
      amenities: ['Pool', 'Spa', 'Heritage Dining', 'Wi-Fi', 'Lake View'],
      description: 'Restored royal residence offering authentic hospitality and palatial suites.',
    })
    setIsNewStay(true)
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
      await store.updateBookingStatus(booking.bookingId, 'Voucher Issued', 'Deposit Paid')
      onToast(`Official Trip Voucher issued and sent for #${booking.bookingId}!`)
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

  return (
    <div className="admin-panel-root min-h-screen bg-slate-50 text-slate-900 flex flex-col font-inter antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Admin Header */}
      <AdminHeader
        navigate={navigate}
        isDatabaseConnected={store.isDatabaseConnected}
        onLogout={onLogout}
      />

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Modular Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          bookingsCount={store.bookings.length}
          inquiriesCount={newInquiriesCount}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardTab
              stats={store.stats}
              totalRevenue={totalRevenue}
              confirmedBookingsCount={confirmedBookingsCount}
              newInquiriesCount={newInquiriesCount}
              bookings={store.bookings}
              inquiries={store.inquiries}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectBooking={setSelectedBooking}
              onSelectInquiry={setSelectedInquiry}
            />
          )}

          {activeTab === 'destinations' && (
            <DestinationsTab
              destinations={store.destinations}
              onAddNew={handleOpenNewDestination}
              onEdit={(dest) => {
                setEditingDestination(dest)
                setIsNewDestination(false)
              }}
              onDelete={handleDeleteDestination}
            />
          )}

          {activeTab === 'packages' && (
            <PackagesTab
              packages={store.packages}
              onAddNewPackage={handleOpenNewPackage}
              onEditPackage={(pkg) => {
                setEditingPackage(pkg)
                setIsNewPackage(false)
              }}
              onDeletePackage={handleDeletePackage}
            />
          )}

          {activeTab === 'stays' && (
            <StaysTab
              stays={store.stays}
              stayFilter={stayFilter}
              setStayFilter={setStayFilter}
              onAddNewStay={handleOpenNewStay}
              onEditStay={(stay) => {
                setEditingStay(stay)
                setIsNewStay(false)
              }}
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
      {editingDestination && (
        <DestinationModal
          destination={editingDestination}
          isNew={isNewDestination}
          onClose={() => setEditingDestination(null)}
          onSave={handleSaveDestination}
          onChange={setEditingDestination}
        />
      )}

      {editingPackage && (
        <PackageModal
          pkg={editingPackage}
          isNew={isNewPackage}
          onClose={() => setEditingPackage(null)}
          onSave={handleSavePackage}
          onChange={setEditingPackage}
        />
      )}

      {editingStay && (
        <StayModal
          stay={editingStay}
          isNew={isNewStay}
          onClose={() => setEditingStay(null)}
          onSave={handleSaveStay}
          onChange={setEditingStay}
        />
      )}

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
          onIssueVoucher={handleIssueVoucher}
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

export function AdminPage({ navigate, onToast }: AdminPageProps) {
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
