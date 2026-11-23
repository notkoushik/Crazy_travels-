import { useRef, useState, type FormEvent } from 'react'
import { dataStore } from '../services/dataStore'
import { Icon } from './Icon'
import {
  TravelDatePicker,
  addDays,
  dateLabel,
  dateSeason,
  monthLabel,
  today,
  type TravelRange,
} from './TravelDatePicker'
import type { InquiryContext } from './TripInquiry'

const destinations = ['Kashmir', 'Kerala', 'Rajasthan', 'Andaman', 'Sikkim', 'Hampi']
const seasons = [
  { name: 'Spring', label: 'Spring (Mar–May)', months: 'March–May' },
  { name: 'Summer', label: 'Summer (Jun–Aug)', months: 'June–August' },
  { name: 'Autumn', label: 'Autumn / festive', months: 'September–November' },
  { name: 'Winter', label: 'Winter holiday', months: 'December–February' },
]

export function HeroInquiryCard({ context, onClose }: { context: InquiryContext; onClose: () => void }) {
  const [selected, setSelected] = useState('Kashmir')
  const [range, setRange] = useState<TravelRange>({ start: '', end: '' })
  const [season, setSeason] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [travelers, setTravelers] = useState('Couple (2 Adults)')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const destination = context.destination || selected

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current) return
    setError('')
    if (!name.trim() || !phone.trim()) {
      setError('Enter your name and phone number.')
      return
    }
    if (range.start && (!range.end || range.start < today())) {
      setError(range.end ? 'Choose travel dates from today onward.' : 'Choose an end date for your trip.')
      return
    }
    const preference = seasons.find(({ name }) => name === season)
    const periodStart = range.start || (season === 'soon' ? today() : '')
    const periodEnd = range.end || (season === 'soon' ? addDays(periodStart, 30) : '')
    const travelMonth = periodStart
      ? [...new Set([monthLabel(periodStart), monthLabel(periodEnd)])].join(' – ')
      : preference?.months || 'Flexible'
    const travelSeason =
      preference?.name ||
      (periodStart ? [...new Set([dateSeason(periodStart), dateSeason(periodEnd)])].join(' – ') : 'Flexible')
    pending.current = true
    setBusy(true)
    try {
      await dataStore.addInquiry({
        id: `INQ-${crypto.randomUUID()}`,
        fullName: name.trim(),
        phone: phone.trim(),
        email: '',
        preferredDestination: destination,
        travelMonth,
        travelSeason,
        travelStart: range.start || undefined,
        travelEnd: range.end || undefined,
        sourcePage: context.page,
        sourceTitle: context.title,
        travelersCount: travelers,
        budgetPerPerson: '',
        tripType: 'Trip inquiry',
        status: 'New',
        createdAt: new Date().toISOString(),
      })
      setSent(true)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not send your inquiry. Try again.')
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  return (
    <div className="hero-inquiry-card rounded-2xl p-4 text-white">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/90">Trip details & inquiry</p>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25"
          aria-label="Minimize trip inquiry"
        >
          <Icon name="x" size={18} />
        </button>
      </div>
      {sent ? (
        <div className="space-y-3 pb-2" role="status">
          <h2 className="text-xl font-bold">Inquiry received</h2>
          <p className="text-sm text-white/90">
            Our team has your trip details for {destination}
            {range.start ? ` from ${dateLabel(range.start)} to ${dateLabel(range.end)}` : ''}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false)
              setName('')
              setPhone('')
            }}
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#ab3526]"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2.5">
          <div>
            <h2 className="text-lg font-bold leading-tight">{context.heading}</h2>
            <p className="mt-1 text-xs leading-normal text-white/90">{context.description}</p>
          </div>
          {!context.destination && (
            <div className="flex flex-wrap gap-1.5" aria-label="Popular destinations">
              {destinations.map((place) => (
                <button
                  key={place}
                  type="button"
                  aria-pressed={place === selected}
                  onClick={() => setSelected(place)}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${place === selected ? 'bg-white text-[#ab3526]' : 'bg-white/15 hover:bg-white/25'}`}
                >
                  {place}
                </button>
              ))}
            </div>
          )}
          {!context.destination && (
            <input
              aria-label="Destination"
              className="inquiry-field"
              value={selected}
              placeholder="Destination"
              maxLength={180}
              required
              onChange={(event) => setSelected(event.target.value)}
            />
          )}
          <input
            aria-label="Your full name"
            className="inquiry-field"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            maxLength={160}
            required
            onChange={(event) => setName(event.target.value)}
          />
          <input
            aria-label="WhatsApp or phone number"
            className="inquiry-field"
            type="tel"
            autoComplete="tel"
            placeholder="WhatsApp or phone number"
            value={phone}
            maxLength={45}
            required
            onChange={(event) => setPhone(event.target.value)}
          />
          <TravelDatePicker range={range} onChange={setRange} />
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Preferred season"
              className="inquiry-field"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
            >
              <option value="">Flexible season</option>
              <option value="soon">Next 30 days</option>
              {seasons.map(({ name, label }) => (
                <option key={name} value={name}>
                  {label}
                </option>
              ))}
            </select>
            <select
              aria-label="Travellers"
              className="inquiry-field"
              value={travelers}
              onChange={(event) => setTravelers(event.target.value)}
            >
              {['Couple (2 Adults)', 'Family (3–4)', 'Friends group (5+)', 'Solo traveller'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          {error && (
            <p role="alert" className="text-xs font-semibold text-white">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-bold text-[#ab3526] hover:bg-orange-50 disabled:opacity-70"
          >
            {busy ? 'Sending…' : 'Request my itinerary'} <Icon name="arrow" size={16} />
          </button>
        </form>
      )}
    </div>
  )
}
