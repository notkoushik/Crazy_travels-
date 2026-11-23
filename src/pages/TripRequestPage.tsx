import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CatalogPhoto } from '../components/CatalogPhoto'
import { Icon } from '../components/Icon'
import { dateLabel, today } from '../components/TravelDatePicker'
import { formatPrice } from '../data/travelData'
import { dataStore } from '../services/dataStore'
import type { BookingSubmission, Currency, RouteName } from '../types/travel'

export interface TripRequestIntent {
  entryId: string
  title: string
  price: number
  returnTo: RouteName
  perTraveller: boolean
  image?: string
  detail?: string
}

const accommodationOptions: [BookingSubmission['hotelType'], string][] = [
  ['Flexible', 'Help me choose'],
  ['Standard', 'Comfort stays'],
  ['Deluxe', 'Boutique or heritage stays'],
  ['Luxury 5-Star', 'Luxury stays'],
]

function GuestCount({ label, value, minimum, onChange }: {
  label: string
  value: number
  minimum: number
  onChange: (value: number) => void
}) {
  return (
    <div className="quote-guest">
      <span>{label}</span>
      <div className="quote-counter">
        <button type="button" aria-label={`Remove one from ${label.toLowerCase()}`} disabled={value === minimum} onClick={() => onChange(value - 1)}>
          <Icon name="minus" size={16} />
        </button>
        <output aria-label={`${label} count`} aria-live="polite">{value}</output>
        <button type="button" aria-label={`Add one to ${label.toLowerCase()}`} onClick={() => onChange(value + 1)}>
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  )
}

export function TripRequestPage({ request, currency, navigate, onTrack }: {
  request: TripRequestIntent | undefined
  currency: Currency
  navigate: (route: RouteName) => void
  onTrack: (reference: string) => void
}) {
  const [step, setStep] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [hotelType, setHotelType] = useState<BookingSubmission['hotelType']>('Flexible')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [offerCode, setOfferCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState<string | undefined>(() => window.history.state?.tripRequestReference)
  const heading = useRef<HTMLHeadingElement>(null)
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const pending = useRef(false)
  const attempt = useRef<{ fingerprint: string; reference: string }>(undefined)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [reference])

  const backRoute = request?.returnTo ?? 'packages'
  const hasRate = !!request?.price && request.price > 0
  const estimate = request?.perTraveller && hasRate && children === 0 ? request.price * adults : 0
  const guests = `${adults} ${adults === 1 ? 'adult' : 'adults'}${children ? ` · ${children} ${children === 1 ? 'child' : 'children'}` : ''}`

  const goToStep = (next: number) => {
    setError('')
    setStep(next)
    requestAnimationFrame(() => {
      const title = stepHeading.current
      if (!title) return
      title.focus({ preventScroll: true })
      title.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    })
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!request || pending.current) return
    if (travelDate && travelDate < today()) {
      setStep(1)
      setError('Choose today or a future departure date.')
      return
    }
    if (step === 1) {
      goToStep(2)
      return
    }
    const digits = phone.replace(/\D/g, '').replace(/^91/, '').replace(/^0/, '')
    if (!name.trim() || digits.length < 6) {
      setError('Enter your name and a phone number where we can reach you.')
      return
    }
    const details = {
      packageName: request.title,
      travelDate,
      adults,
      children,
      hotelType,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      specialRequests: [notes.trim(), offerCode.trim() && `Offer code for review: ${offerCode.trim()}`].filter(Boolean).join('\n'),
      totalPrice: estimate,
    }
    const fingerprint = JSON.stringify(details)
    if (attempt.current?.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, reference: `CT-${crypto.randomUUID().slice(0, 13).replace('-', '').toUpperCase()}` }
    }
    const requestId = attempt.current.reference
    pending.current = true
    setBusy(true)
    setError('')
    try {
      const savedReference = await dataStore.addBooking({
        ...details,
        bookingId: requestId,
        submittedAt: new Date().toISOString(),
        status: 'Pending',
        paymentStatus: 'Unpaid',
      })
      if (window.location.hash === '#/trip-request' && window.history.state?.tripRequest?.entryId === request.entryId) {
        window.history.replaceState({ ...window.history.state, tripRequestReference: savedReference }, '')
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
      setReference(savedReference)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'We could not send your request. Please try again.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  if (reference) {
    return (
      <main className="quote-page">
        <div className="shell quote-receipt">
          <div className="quote-receipt-mark"><Icon name="check" size={23} /></div>
          <h1 ref={heading} tabIndex={-1}>Request received</h1>
          <p className="quote-intro-copy">Our travel team will review availability and contact you with a personalised quote.</p>
          <dl className="quote-receipt-details">
            <div><dt>Request reference</dt><dd className="quote-reference">{reference}</dd></div>
            {request && <div><dt>Journey</dt><dd>{request.title}</dd></div>}
            <div><dt>Status</dt><dd>Awaiting confirmation</dd></div>
            <div><dt>Payment</dt><dd>No payment taken</dd></div>
          </dl>
          <p className="quote-help">Keep your reference. You can check the status using this reference and the phone number you submitted.</p>
          <div className="quote-actions">
            <button className="quote-primary" type="button" onClick={() => onTrack(reference)}>Track this request <Icon name="arrow" size={17} /></button>
            <button className="quote-secondary" type="button" onClick={() => navigate(backRoute)}>Back to your journey</button>
          </div>
        </div>
      </main>
    )
  }

  if (!request) {
    return (
      <main className="quote-page">
        <div className="shell quote-receipt">
          <h1 ref={heading} tabIndex={-1}>Choose a journey</h1>
          <p className="quote-intro-copy">Select a trip to start your quote request.</p>
          <button className="quote-primary" type="button" onClick={() => navigate('packages')}>Browse holiday packages <Icon name="arrow" size={17} /></button>
        </div>
      </main>
    )
  }

  return (
    <main className="quote-page">
      <div className="shell">
        <button type="button" className="quote-back" onClick={() => navigate(backRoute)} disabled={busy}>
          <Icon name="arrow" size={16} className="rotate-180" /> Back to your journey
        </button>
        <header className="quote-page-heading">
          <h1 ref={heading} tabIndex={-1}>Request a private quote</h1>
          <p className="quote-intro-copy">Tell us how you’d like to travel. A specialist will review your details and send a quote for your group.</p>
        </header>
        <div className="quote-grid">
          <form className="quote-card" onSubmit={submit}>
            <ol className="quote-progress" aria-label="Quote request progress">
              <li aria-current={step === 1 ? 'step' : undefined}><span>1</span> Trip details</li>
              <li aria-current={step === 2 ? 'step' : undefined}><span>2</span> Contact &amp; review</li>
            </ol>
            {step === 1 ? (
              <div className="quote-fields">
                <h2 ref={stepHeading} tabIndex={-1}>Plan your departure</h2>
                <div className="quote-field-grid">
                  <label>Preferred departure <small>Optional</small>
                    <input type="date" min={today()} value={travelDate} onChange={(event) => setTravelDate(event.target.value)} />
                  </label>
                  <label>Accommodation preference
                    <select value={hotelType} onChange={(event) => setHotelType(event.target.value as BookingSubmission['hotelType'])}>
                      {accommodationOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                </div>
                <div className="quote-field-grid">
                  <GuestCount label="Adults" value={adults} minimum={1} onChange={setAdults} />
                  <GuestCount label="Children" value={children} minimum={0} onChange={setChildren} />
                </div>
              </div>
            ) : (
              <div className="quote-fields">
                <h2 ref={stepHeading} tabIndex={-1}>How should we reach you?</h2>
                <div className="quote-field-grid">
                  <label>Full name<input autoComplete="name" required maxLength={160} value={name} onChange={(event) => setName(event.target.value)} /></label>
                  <label>Phone or WhatsApp<input type="tel" autoComplete="tel" required maxLength={45} value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
                  <label>Email <small>Optional</small><input type="email" autoComplete="email" maxLength={200} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                  <label>Offer code <small>Optional</small><input maxLength={40} value={offerCode} onChange={(event) => setOfferCode(event.target.value)} /></label>
                </div>
                <label>Anything we should know? <small>Optional</small>
                  <textarea rows={3} maxLength={1200} placeholder="Room preferences, dietary needs, or a special occasion" value={notes} onChange={(event) => setNotes(event.target.value)} />
                </label>
              </div>
            )}
            {error && <p className="quote-error" role="alert">{error}</p>}
            <div className="quote-actions">
              {step === 2 && <button className="quote-secondary" type="button" onClick={() => goToStep(1)} disabled={busy}>Edit trip details</button>}
              <button className="quote-primary" type="submit" disabled={busy}>
                {busy ? 'Sending request…' : step === 1 ? 'Continue to contact details' : 'Send quote request'} <Icon name="arrow" size={17} />
              </button>
            </div>
          </form>
          <aside className="quote-summary" aria-label="Trip summary">
            {request.image && <CatalogPhoto src={request.image} alt="" className="quote-summary-photo" />}
            <div className="quote-summary-body">
              {request.detail && <p className="quote-help">{request.detail}</p>}
              <h2>{request.title}</h2>
              <dl className="quote-summary-list">
                <div><dt>Departure</dt><dd>{travelDate ? dateLabel(travelDate) : 'Flexible'}</dd></div>
                <div><dt>Travellers</dt><dd>{guests}</dd></div>
                <div><dt>Stay preference</dt><dd>{accommodationOptions.find(([value]) => value === hotelType)?.[1]}</dd></div>
              </dl>
              {hasRate && (
                <div className="quote-pricing">
                  <p>{estimate ? 'Starting estimate for your group' : request.perTraveller ? 'Listed rate per traveller' : 'Listed starting rate'}</p>
                  <strong>{formatPrice(estimate || request.price, currency)}</strong>
                </div>
              )}
              <p className="quote-help">Your specialist will confirm availability and final pricing. There’s no payment at this step.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
