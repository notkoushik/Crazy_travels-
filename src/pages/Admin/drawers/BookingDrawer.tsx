import React from 'react'
import { BookingSubmission } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface BookingDrawerProps {
  booking: BookingSubmission
  onClose: () => void
  onIssueVoucher: (bookingId: string) => void
}

export function BookingDrawer({ booking, onClose, onIssueVoucher }: BookingDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end font-inter">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="font-mono text-xs font-semibold text-slate-500">
              {booking.bookingId}
            </span>
            <h2 className="text-base font-bold text-slate-900 font-inter-tight">
              Booking Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-slate-400 font-medium font-inter-tight">Customer Information</div>
            <div className="text-slate-900 font-bold text-sm font-inter-tight">{booking.customerName}</div>
            <div className="text-slate-600">{booking.customerEmail}</div>
            <div className="text-slate-600 font-mono">{booking.customerPhone}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-slate-400 font-medium font-inter-tight">Journey Information</div>
            <div className="text-slate-900 font-bold text-sm font-inter-tight">{booking.packageName}</div>
            <div className="text-slate-600">Travel Date: {booking.travelDate}</div>
            <div className="text-slate-600">
              Guests: {booking.adults} Adults, {booking.children} Kids
            </div>
            <div className="text-slate-600">Hotel Tier: {booking.hotelType}</div>
          </div>

          {booking.specialRequests && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-slate-400 font-medium font-inter-tight">Special Requests</div>
              <div className="text-slate-700 italic">{booking.specialRequests}</div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 flex items-center justify-between">
            <span className="font-semibold text-slate-700 font-inter-tight">Total Price</span>
            <span className="font-mono font-bold text-slate-900 text-base font-inter-tight">
              ₹{booking.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2.5">
            <button
              onClick={() => onIssueVoucher(booking.bookingId)}
              className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center shadow-xs"
            >
              Issue Voucher
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
