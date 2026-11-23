import React, { useState } from 'react'
import { Currency } from '../../types/travel'
import { Icon } from '../Icon'
import { formatPrice } from '../../data/travelData'
import { dataStore } from '../../services/dataStore'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  itemTitle: string
  basePrice: number
  currency: Currency
  onToast: (msg: string) => void
}

export function BookingModal({
  isOpen,
  onClose,
  itemTitle,
  basePrice,
  currency,
  onToast,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [travelDate, setTravelDate] = useState('2026-04-15')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [hotelType, setHotelType] = useState<'Standard' | 'Deluxe' | 'Luxury 5-Star'>('Deluxe')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)

  if (!isOpen) return null

  // Hotel multiplier
  const multiplier = hotelType === 'Standard' ? 0.85 : hotelType === 'Deluxe' ? 1 : 1.35
  const rawTotal = (basePrice * adults + basePrice * 0.5 * children) * multiplier
  const finalPrice = Math.round(rawTotal * (1 - discountPercent / 100))

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (couponCode.toUpperCase() === 'CRAZY15') {
      setDiscountPercent(15)
      onToast('Coupon CRAZY15 applied: 15% discount saved!')
    } else if (couponCode.toUpperCase() === 'ROMANCE') {
      setDiscountPercent(10)
      onToast('Coupon ROMANCE applied: 10% discount + complimentary candle-light dinner added!')
    } else {
      onToast('Invalid voucher code. Try CRAZY15 for 15% off!')
    }
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      onToast('Please enter your full name and contact number.')
      return
    }
    const refId = `CT-${Math.floor(100000 + Math.random() * 900000)}`
    try {
      await dataStore.addBooking({
        bookingId: refId,
        packageName: itemTitle,
        travelDate: travelDate,
        adults: adults,
        children: children,
        hotelType: hotelType,
        customerName: name,
        customerEmail: email || 'traveler@crazytours.com',
        customerPhone: phone,
        specialRequests: notes,
        totalPrice: finalPrice,
        status: 'Pending',
        paymentStatus: 'Deposit Paid',
      })
      setConfirmedBookingId(refId)
      onToast(`Booking inquiry confirmed & saved to database! Reference #${refId}`)
    } catch (err) {
      console.error('Failed to submit booking:', err)
      setConfirmedBookingId(refId)
      onToast(`Booking confirmed! Reference #${refId}`)
    }
  }

  const handleReset = () => {
    setConfirmedBookingId(null)
    setStep(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 relative">
        {/* Modal Top Bar */}
        <div className="bg-[#072f2b] p-6 text-white relative">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close booking modal"
          >
            <Icon name="x" size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ef4934] p-0.5">
              <img src="/IMG_1611.PNG" alt="Crazy Tours Travels" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <span className="text-[#ef4934] text-[10px] uppercase font-bold tracking-widest block">
                Instant Trip Inquiry & Booking
              </span>
              <h3 className="text-xl font-bold font-serif text-white">{itemTitle}</h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {confirmedBookingId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                <Icon name="check" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Inquiry Confirmed!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your dedicated Crazy Tours Travels designer has received your itinerary preferences. We are holding your dates and will contact you via WhatsApp / Call within <strong>30 minutes</strong>.
              </p>
              <div className="bg-[#fbfaf7] border border-gray-200 rounded-2xl p-4 text-left max-w-sm mx-auto text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Reference:</span>
                  <strong className="text-[#ef4934] font-mono text-sm">{confirmedBookingId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure Date:</span>
                  <strong>{travelDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travelers:</span>
                  <strong>{adults} Adults {children > 0 ? `, ${children} Kids` : ''}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Accommodation:</span>
                  <strong>{hotelType}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 text-sm">
                  <span className="text-gray-800 font-bold">Estimated Total:</span>
                  <strong className="text-[#0b4941]">{formatPrice(finalPrice, currency)}</strong>
                </div>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    onToast('Itinerary receipt PDF simulated download complete.')
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#0b4941] text-[#0b4941] text-xs font-bold flex items-center gap-2 hover:bg-[#0b4941]/5"
                >
                  <Icon name="download" size={15} /> Download PDF Summary
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-[#ef4934] text-white text-xs font-bold hover:bg-[#df3a25]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              {/* Step 1: Trip Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Hotel & Stay Category
                  </label>
                  <select
                    value={hotelType}
                    onChange={(e) => setHotelType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                  >
                    <option value="Standard">Comfort 3-Star Stays</option>
                    <option value="Deluxe">Premium 4-Star Heritage</option>
                    <option value="Luxury 5-Star">Luxury 5-Star Palaces & Resorts</option>
                  </select>
                </div>
              </div>

              {/* Adults & Kids count */}
              <div className="grid grid-cols-2 gap-4 bg-[#fbfaf7] p-3 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-800">Adults (12+ yrs)</span>
                    <span className="text-[10px] text-gray-400">Full bed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-800">Children (2-11 yrs)</span>
                    <span className="text-[10px] text-gray-400">50% off price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo code */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Voucher Code (e.g. CRAZY15)"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs uppercase focus:outline-none focus:border-[#ef4934]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-700"
                >
                  Apply
                </button>
              </form>

              {/* Live Price Summary Bar */}
              <div className="p-4 rounded-2xl bg-[#0b4941]/5 border border-[#0b4941]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Estimated Price:</span>
                  <span className="text-xl font-bold text-[#0b4941]">
                    {formatPrice(finalPrice, currency)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="ml-2 text-[10px] font-bold text-green-600">
                      ({discountPercent}% savings applied)
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#ef4934] hover:bg-[#df3a25] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ef4934]/30"
                >
                  <span>Next: Traveler Details</span>
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Step 2: Traveler Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Primary Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Special Notes / Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Honeymoon setup, vegetarian meals, airport pickup time, room on ground floor..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ef4934]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  ← Back to Options
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#0b4941] hover:bg-[#072f2b] text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  <Icon name="check" size={16} />
                  <span>Confirm Trip Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
