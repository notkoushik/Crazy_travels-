import React, { useState } from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { dataStore } from '../services/dataStore'

interface ManageBookingPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}

export function ManageBookingPage({ navigate, onToast }: ManageBookingPageProps) {
  const [bookingId, setBookingId] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [bookingData, setBookingData] = useState<{
    id: string
    title: string
    dates: string
    travelers: string
    hotel: string
    status: string
    payment: string
    assignedSpecialist: string
    emailMasked?: string
    phoneMasked?: string
  } | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setBookingData(null)

    if (!bookingId.trim() || !phone.trim()) {
      setErrorMessage('Both Booking Reference ID and registered Phone number are required for privacy verification.')
      return
    }

    setIsLoading(true)

    try {
      const result = await dataStore.lookupBooking(bookingId.trim(), phone.trim())
      setBookingData({
        id: result.bookingId,
        title: result.packageName,
        dates: result.travelDate,
        travelers: `${result.adults} Adults${result.children > 0 ? `, ${result.children} Children` : ''} (Primary: ${result.customerName})`,
        hotel: `${result.hotelType} Category`,
        status: result.status || 'Confirmed',
        payment: result.paymentStatus || 'Verified',
        assignedSpecialist: 'Dedicated Crazy Tours Concierge',
        emailMasked: result.customerEmailMasked,
        phoneMasked: result.customerPhoneMasked,
      })
      onToast('Reservation record verified and loaded successfully!')
    } catch (err: any) {
      setErrorMessage(
        err.message || 'No reservation matching this Booking Reference and registered Phone number was found.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6 font-inter">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl text-center">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Icon name="shield" size={16} /> Traveler Privacy & Self-Service
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal">
              Manage Your Booking & Itinerary
            </h1>
            <p className="text-[#dce9e6] text-sm leading-relaxed">
              Verify trip status, download verified hotel vouchers, request date changes, or connect with your designated travel concierge securely.
            </p>
          </div>
        </div>
      </section>

      {/* Lookup Box & Results */}
      <section className="shell max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold font-serif text-gray-900">
                Find Your Reservation
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Icon name="shield" size={12} />
                <span>Dual-Factor Verified</span>
              </span>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2.5 animate-shake">
                <Icon name="help" size={16} className="text-amber-700 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1 font-inter-tight">
                  Booking Reference ID *
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => {
                    setBookingId(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="e.g. CT-748921"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#0b4941] focus:border-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1 font-inter-tight">
                  Registered Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setErrorMessage('')
                  }}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4941] focus:border-transparent"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              For traveler privacy protection, reservations can only be retrieved by matching both the Booking Reference ID and the registered contact number.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 font-inter-tight"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Icon name="search" size={16} />
                  <span>Search & Verify Reservation</span>
                </>
              )}
            </button>
          </form>

          {/* Results card */}
          {bookingData && (
            <div className="pt-6 border-t border-gray-100 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Booking Reference
                  </span>
                  <strong className="text-xl font-mono text-[#0b4941]">{bookingData.id}</strong>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <Icon name="check" size={14} /> {bookingData.status}
                </span>
              </div>

              <div className="bg-[#fbfaf7] p-5 rounded-2xl border border-gray-100 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Curated Journey:</span>
                  <strong className="text-gray-900">{bookingData.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure Date:</span>
                  <strong>{bookingData.dates}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travelers:</span>
                  <strong>{bookingData.travelers}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stays Reserved:</span>
                  <strong>{bookingData.hotel}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <strong className="text-emerald-700">{bookingData.payment}</strong>
                </div>
                {bookingData.emailMasked && (
                  <div className="flex justify-between pt-1 border-t border-gray-200/60">
                    <span className="text-gray-500">Encrypted Traveler Contact:</span>
                    <strong className="text-slate-600 font-mono text-[11px]">
                      {bookingData.emailMasked} · {bookingData.phoneMasked}
                    </strong>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Designated Concierge:</span>
                  <strong className="text-[#ef4934]">{bookingData.assignedSpecialist}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onToast('Itinerary and Hotel Vouchers downloaded as PDF.')}
                  className="py-3 px-4 rounded-xl bg-[#0b4941] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#072f2b] shadow-sm transition-colors"
                >
                  <Icon name="download" size={15} />
                  <span>Download Voucher PDF</span>
                </button>
                <button
                  onClick={() =>
                    onToast('Modification request submitted! Your concierge will call you within 30 minutes.')
                  }
                  className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
                >
                  Request Date Change
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
