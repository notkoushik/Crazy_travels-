import { useState, type FormEvent } from 'react'
import type { BookingSubmission, RouteName } from '../types/travel'
import { Icon } from '../components/Icon'
import { dataStore } from '../services/dataStore'

type BookingLookup = Pick<BookingSubmission,
  'bookingId' | 'packageName' | 'travelDate' | 'adults' | 'children' | 'hotelType' | 'status' | 'paymentStatus'
>

export function ManageBookingPage({ navigate, initialReference }: {
  navigate: (route: RouteName) => void
  initialReference?: string
}) {
  const [bookingId, setBookingId] = useState(initialReference ?? '')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [record, setRecord] = useState<BookingLookup>()

  const lookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    setError('')
    setRecord(undefined)
    setBusy(true)
    try {
      setRecord(await dataStore.lookupBooking(bookingId.trim(), phone.trim()))
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'We could not find that request.')
    } finally {
      setBusy(false)
    }
  }

  const status = !record?.status || record.status === 'Pending' ? 'Awaiting confirmation' : record.status

  return (
    <main className="quote-page">
      <div className="shell quote-receipt">
        <h1>Track your trip</h1>
        <p className="quote-intro-copy">Enter your reference and the phone number you provided to check your quote request or booking.</p>
        <form className="quote-card quote-lookup" onSubmit={lookup}>
          <div className="quote-fields">
            <div className="quote-field-grid">
              <label>Request or booking reference
                <input autoCapitalize="characters" required value={bookingId} maxLength={60} onChange={(event) => setBookingId(event.target.value)} />
              </label>
              <label>Phone or WhatsApp
                <input type="tel" autoComplete="tel" required value={phone} maxLength={60} onChange={(event) => setPhone(event.target.value)} />
              </label>
            </div>
            {error && <p className="quote-error" role="alert">{error}</p>}
            <button className="quote-primary" type="submit" disabled={busy}>
              {busy ? 'Checking status…' : 'Check status'} <Icon name="arrow" size={17} />
            </button>
          </div>
        </form>
        {record && (
          <section className="quote-card quote-lookup" aria-label="Current booking status" aria-live="polite">
            <h2>{record.packageName}</h2>
            <dl className="quote-summary-list">
              <div><dt>Reference</dt><dd className="quote-reference">{record.bookingId}</dd></div>
              <div><dt>Status</dt><dd>{status}</dd></div>
              <div><dt>Payment status</dt><dd>{record.paymentStatus || 'Unpaid'}</dd></div>
              <div><dt>Departure</dt><dd>{record.travelDate || 'Flexible'}</dd></div>
              <div><dt>Travellers</dt><dd>{record.adults} {record.adults === 1 ? 'adult' : 'adults'}{record.children > 0 ? `, ${record.children} ${record.children === 1 ? 'child' : 'children'}` : ''}</dd></div>
            </dl>
            <button className="quote-secondary" type="button" onClick={() => navigate('contact')}>Contact our travel team</button>
          </section>
        )}
      </div>
    </main>
  )
}
