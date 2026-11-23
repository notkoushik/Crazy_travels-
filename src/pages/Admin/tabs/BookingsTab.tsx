import React from 'react'
import { BookingSubmission } from '../../../types/travel'

interface BookingsTabProps {
  bookings: BookingSubmission[]
  bookingFilter: string
  setBookingFilter: (f: string) => void
  onSelectBooking: (b: BookingSubmission) => void
  onUpdateBookingStatus: (
    bookingId: string,
    status: BookingSubmission['status'],
    paymentStatus?: BookingSubmission['paymentStatus']
  ) => void
}

export function BookingsTab({
  bookings,
  bookingFilter,
  setBookingFilter,
  onSelectBooking,
  onUpdateBookingStatus,
}: BookingsTabProps) {
  const filteredBookings = bookings.filter(
    (b) => bookingFilter === 'ALL' || b.status === bookingFilter
  )

  return (
    <div className="space-y-6 max-w-7xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Customer Bookings & Operations
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Track reservation lifecycles, payment schedules, and traveler requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['ALL', 'Confirmed', 'Voucher Issued', 'Pending', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setBookingFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                bookingFilter === filter
                  ? 'bg-slate-900 text-white shadow-2xs font-inter-tight'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Roster Table */}
      <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider font-inter-tight">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Traveler</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Date & Pax</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status Workflow</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    {b.bookingId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 font-inter-tight">{b.customerName}</div>
                    <div className="text-slate-400 text-[11px]">{b.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate">
                    {b.packageName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{b.travelDate}</div>
                    <div className="text-slate-400 text-[11px]">
                      {b.adults} adults{b.children ? `, ${b.children} kids` : ''} · {b.hotelType}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 font-inter-tight">
                      {b.totalPrice ? `₹${b.totalPrice.toLocaleString('en-IN')}` : 'Quote pending'}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {b.paymentStatus || 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={b.status || 'Pending'}
                      onChange={(e) =>
                        onUpdateBookingStatus(
                          b.bookingId,
                          e.target.value as BookingSubmission['status']
                        )
                      }
                      className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1 outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Voucher Issued">Voucher Issued</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectBooking(b)}
                      className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors text-[11px]"
                    >
                      View Drawer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
