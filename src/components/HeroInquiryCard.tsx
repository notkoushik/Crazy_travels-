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

const seasons = [
  { name: 'Spring', label: 'Spring (Mar–May)', months: 'March–May' },
  { name: 'Summer', label: 'Summer (Jun–Aug)', months: 'June–August' },
  { name: 'Autumn', label: 'Autumn / festive', months: 'September–November' },
  { name: 'Winter', label: 'Winter holiday', months: 'December–February' },
]

export function HeroInquiryCard({ context, popularDestinations, onClose }: {
  context: InquiryContext
  popularDestinations: string[]
  onClose: () => void
}) {
  const [selected, setSelected] = useState('')
  const [range, setRange] = useState<TravelRange>({ start: '', end: '' })
  const [season, setSeason] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [travelers, setTravelers] = useState('Couple (2 Adults)')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const destination = context.destination || selected.trim()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current) return
    setError('')
    if (!destination) {
      setError('Enter a destination for your trip.')
      return
    }
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
    <div className="hero-inquiry-card rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#51645d]">Private trip planning</p>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#edf3ef] hover:bg-[#dfece4]"
          aria-label="Minimize trip inquiry"
        >
          <Icon name="x" size={18} />
        </button>
      </div>
      {sent ? (
        <div className="space-y-3 pb-2" role="status">
          <h2 className="text-xl font-bold">Inquiry received</h2>
          <p className="text-sm text-[#51645d]">
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
            className="rounded-lg border border-[#d5e2da] px-3 py-2 text-sm font-semibold text-[#0b4941]"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2.5">
          <div>
            <h2 className="text-xl font-medium leading-tight">{context.heading}</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#51645d]">{context.description}</p>
          </div>
          {!context.destination && popularDestinations.length > 0 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Suggested destinations">
              {popularDestinations.map((place) => (
                <button
                  key={place}
                  type="button"
                  aria-pressed={place === selected}
                  onClick={() => setSelected(place)}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${place === selected ? 'bg-[#0b4941] text-white' : 'bg-[#edf3ef] text-[#0b4941] hover:bg-[#dfece4]'}`}
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
              placeholder="Where would you like to go?"
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
            <p role="alert" className="text-xs font-semibold text-[#9b3225]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b4941] px-3 text-sm font-semibold text-white hover:bg-[#072f2b] disabled:opacity-70"
          >
            {busy ? 'Sending…' : 'Request a tailored itinerary'} <Icon name="arrow" size={16} />
          </button>
        </form>
      )}
    </div>
  )
}
