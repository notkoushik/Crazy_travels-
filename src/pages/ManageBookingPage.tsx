import React, { useState } from 'react'
import { RouteName } from '../types/travel'
import { Icon } from '../components/Icon'

interface ManageBookingPageProps {
  navigate: (route: RouteName) => void
  onToast: (msg: string) => void
}

export function ManageBookingPage({ navigate, onToast }: ManageBookingPageProps) {
  const [bookingId, setBookingId] = useState('')
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)
  const [bookingData, setBookingData] = useState<{
    id: string
    title: string
    dates: string
    travelers: string
    hotel: string
    status: string
    payment: string
    assignedSpecialist: string
  } | null>(null)

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingId && !phone) {
      onToast('Please enter your Booking Reference or registered Phone number.')
      return
    }

    setSearched(true)
    setBookingData({
      id: bookingId ? bookingId.toUpperCase() : 'CT-748921',
      title: 'Tulips, Houseboats & High Meadows (Kashmir)',
      dates: '15 April 2026 — 21 April 2026 (6 Days / 5 Nights)',
      travelers: '2 Adults (Primary: Rahul Sharma)',
      hotel: 'Mascot Cedar Houseboat & Grand Mumtaz Gulmarg',
      status: 'Confirmed & Voucher Dispatched',
      payment: '25% Deposit Paid · Balance due on arrival',
      assignedSpecialist: 'Aamir Mir (Regional Kashmir Concierge)',
    })
    onToast('Booking record found!')
  }

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-6">
      {/* Banner */}
      <section className="shell-wide mb-12">
        <div className="bg-[#072f2b] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl text-center">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="text-[#ffd0c7] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Icon name="search" size={16} /> Traveler Self-Service
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal">
              Manage Your Booking & Itinerary
            </h1>
            <p className="text-[#dce9e6] text-sm leading-relaxed">
              Check trip status, download verified hotel vouchers, request date changes, or connect with your designated travel concierge.
            </p>
          </div>
        </div>
      </section>

      {/* Lookup Box & Results */}
      <section className="shell max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-gray-900">
              Find Your Reservation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Booking Reference ID
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. CT-748921"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm uppercase focus:outline-none focus:border-[#ef4934]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Or Registered Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Icon name="search" size={16} />
              <span>Search Reservation</span>
            </button>
          </form>

          {/* Results card */}
          {searched && bookingData && (
            <div className="pt-6 border-t border-gray-100 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Booking Reference
                  </span>
                  <strong className="text-xl font-mono text-[#0b4941]">{bookingData.id}</strong>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                  <Icon name="check" size={14} /> {bookingData.status}
                </span>
              </div>

              <div className="bg-[#fbfaf7] p-5 rounded-2xl border border-gray-100 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Curated Journey:</span>
                  <strong className="text-gray-900">{bookingData.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates:</span>
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
                  <strong className="text-green-700">{bookingData.payment}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Designated Concierge:</span>
                  <strong className="text-[#ef4934]">{bookingData.assignedSpecialist}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onToast('Itinerary and Hotel Vouchers downloaded as PDF.')}
                  className="py-3 px-4 rounded-xl bg-[#0b4941] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#072f2b] shadow-sm"
                >
                  <Icon name="download" size={15} />
                  <span>Download Voucher PDF</span>
                </button>
                <button
                  onClick={() =>
                    onToast('Modification request submitted! Your concierge will call you to reconfirm dates.')
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
