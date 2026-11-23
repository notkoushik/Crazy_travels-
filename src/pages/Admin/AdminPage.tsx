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

export function AdminPage({ navigate, onToast }: AdminPageProps) {
  const store = useDynamicStore()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => store.isAdminAuthenticated())
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

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
      overview: '',
      highlights: ['Heritage stay', 'Private transfers'],
      inclusions: ['Luxury Stay', 'Breakfast & Dinner', 'Private Sightseeing'],
      exclusions: ['Flights', 'Entry Fees'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Welcome Dinner',
          description: 'Private chauffeur transfer to hotel.',
        },
      ],
      theme: 'Heritage' as any,
      featured: true,
    })
    setIsNewPackage(true)
  }

  // Handlers - Stays
  const handleSaveStay = async (stay: StayItem) => {
    try {
      await store.saveStay(stay)
      onToast(`Stay "${stay.name}" saved to PostgreSQL!`)
      setEditingStay(null)
    } catch (err: any) {
      onToast(`Failed to save stay: ${err.message}`)
    }
  }

  const handleDeleteStay = async (stay: StayItem) => {
    if (window.confirm(`Delete stay "${stay.name}" from PostgreSQL?`)) {
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
      city: 'Jaipur',
      state: 'Rajasthan',
      type: 'Heritage Stays',
      name: 'New Heritage Haveli',
      price: '₹14,500',
      priceNum: 14500,
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Private Pool', 'Courtyard Dining', 'Butler Service', 'Royal Suites'],
      description: 'Opulent suites with hand-painted frescoes and royal courtyard dining.',
    })
    setIsNewStay(true)
  }

  // Handlers - Offers
  const handleSaveOffer = async (offer: OfferItem) => {
    try {
      await store.saveOffer(offer)
      onToast(`Offer "${offer.title}" saved to PostgreSQL!`)
      setEditingOffer(null)
    } catch (err: any) {
      onToast(`Failed to save offer: ${err.message}`)
    }
  }

  const handleDeleteOffer = async (offer: OfferItem) => {
    if (window.confirm(`Delete offer "${offer.title}" (${offer.code}) from PostgreSQL?`)) {
      try {
        await store.deleteOffer(offer.id)
        onToast(`Deleted offer "${offer.title}"`)
      } catch (err: any) {
        onToast(`Failed to delete offer: ${err.message}`)
      }
    }
  }

  const handleOpenNewOffer = () => {
    setEditingOffer({
      id: `offer-${Date.now()}`,
      code: 'SUMMER25',
      title: 'Summer Getaway Discount',
      discountText: 'Flat 20% Off',
      tag: 'Seasonal Special',
      validTill: '31 Aug 2026',
      description: 'Save big on mountain retreats and luxury houseboat vacations across India.',
      minBooking: 'Min booking ₹30,000',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    })
    setIsNewOffer(true)
  }

  // Handlers - Bookings & Inquiries
  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: BookingSubmission['status'],
    paymentStatus?: BookingSubmission['paymentStatus']
  ) => {
    try {
      await store.updateBookingStatus(bookingId, status, paymentStatus)
      onToast(`Booking ${bookingId} updated in PostgreSQL to ${status}!`)
    } catch (err: any) {
      onToast(`Failed to update booking: ${err.message}`)
    }
  }

  const handleIssueVoucher = async (bookingId: string) => {
    try {
      await store.updateBookingStatus(bookingId, 'Voucher Issued', 'Fully Paid')
      onToast(`Voucher issued and marked Fully Paid for ${bookingId}!`)
      setSelectedBooking(null)
    } catch (err: any) {
      onToast(`Failed to issue voucher: ${err.message}`)
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
        onLogout={() => {
          store.adminLogout()
          setIsAuthenticated(false)
          onToast('Operations Console locked. Customer records cleared from memory.')
        }}
      />

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden">
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/70">
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
              onAddNewDestination={handleOpenNewDestination}
              onAddNewPackage={handleOpenNewPackage}
            />
          )}

          {activeTab === 'destinations' && (
            <DestinationsTab
              destinations={store.destinations}
              onEditDestination={(dest) => {
                setEditingDestination(dest)
                setIsNewDestination(false)
              }}
              onAddNewDestination={handleOpenNewDestination}
              onDeleteDestination={handleDeleteDestination}
            />
          )}

          {activeTab === 'packages' && (
            <PackagesTab
              packages={store.packages}
              onEditPackage={(pkg) => {
                setEditingPackage(pkg)
                setIsNewPackage(false)
              }}
              onAddNewPackage={handleOpenNewPackage}
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
