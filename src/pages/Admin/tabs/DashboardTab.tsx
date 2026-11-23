import React from 'react'
import { AdminTab } from '../types'
import { BookingSubmission, InquirySubmission } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface DashboardTabProps {
  totalRevenue: number
  confirmedBookingsCount: number
  newInquiriesCount: number
  destinationsCount: number
  bookings: BookingSubmission[]
  inquiries: InquirySubmission[]
  setActiveTab: (tab: AdminTab) => void
  setSelectedBooking: (b: BookingSubmission) => void
  setSelectedInquiry: (inq: InquirySubmission) => void
  onAddNewDestination: () => void
  onAddNewPackage: () => void
}

export function DashboardTab({
  totalRevenue,
  confirmedBookingsCount,
  newInquiriesCount,
  destinationsCount,
  bookings,
  inquiries,
  setActiveTab,
  setSelectedBooking,
  setSelectedInquiry,
  onAddNewDestination,
  onAddNewPackage,
}: DashboardTabProps) {
  return (
    <div className="space-y-8 max-w-7xl font-inter">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Executive Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time operational summary across packages, live customer reservations, and CRM inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddNewDestination}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Icon name="plus" size={14} className="text-slate-500" /> Add Destination
          </button>
          <button
            onClick={onAddNewPackage}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Icon name="plus" size={14} /> Add Tour Package
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Booked Volume</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Icon name="wallet" size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight tabular-nums font-inter-tight">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <Icon name="trendingUp" size={14} /> +28.4% monthly growth
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Active Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Icon name="calendar" size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight tabular-nums font-inter-tight">
            {bookings.length} reservations
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {confirmedBookingsCount} confirmed & voucher issued
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Custom Trip Leads</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Icon name="messageSquare" size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight tabular-nums font-inter-tight">
            {inquiries.length} inquiries
          </div>
          <div className="text-xs text-blue-600 mt-2 font-medium">
            {newInquiriesCount} new leads awaiting callback
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Featured Destinations</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Icon name="map" size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight tabular-nums font-inter-tight">
            {destinationsCount} active
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Rajasthan Fort Arch shape featured
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Box */}
        <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 font-inter-tight">
                Recent Customer Bookings
              </h2>
              <p className="text-xs text-slate-500">Latest reservation departures</p>
            </div>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold"
            >
              View All ({bookings.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.bookingId}
                className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900">{b.bookingId}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        b.status === 'Confirmed' || b.status === 'Voucher Issued'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-slate-800 font-medium mt-1">{b.customerName}</div>
                  <div className="text-slate-500 text-[11px]">{b.packageName}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm tabular-nums font-inter-tight">
                    ₹{b.totalPrice.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="mt-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries Box */}
        <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900 font-inter-tight">
                Custom Trip Leads (CRM)
              </h2>
              <p className="text-xs text-slate-500">Incoming tailor-made tour requests</p>
            </div>
            <button
              onClick={() => setActiveTab('inquiries')}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold"
            >
              Manage Leads ({inquiries.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {inquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{inq.fullName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        inq.status === 'New'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium mt-1">
                    {inq.preferredDestination} · {inq.travelMonth}
                  </div>
                  <div className="text-slate-400 text-[11px]">{inq.phone}</div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block font-mono">
                    {inq.budgetPerPerson}
                  </span>
                  <button
                    onClick={() => setSelectedInquiry(inq)}
                    className="mt-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium underline"
                  >
                    View Lead
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
