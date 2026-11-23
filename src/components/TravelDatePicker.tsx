import { useId, useState } from 'react'
import { Icon } from './Icon'

export interface TravelRange {
  start: string
  end: string
}
const parse = (value: string) => new Date(`${value}T12:00:00Z`)
const iso = (value: Date) => value.toISOString().slice(0, 10)
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
export const addDays = (value: string, days: number) =>
  iso(new Date(parse(value).getTime() + days * 86_400_000))
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parse(value))
export const monthLabel = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parse(value))
export const dateSeason = (value: string) =>
  ['Winter', 'Spring', 'Summer', 'Autumn'][Math.floor(((parse(value).getUTCMonth() + 1) % 12) / 3)]

export function TravelDatePicker({
  range,
  onChange,
}: {
  range: TravelRange
  onChange: (range: TravelRange) => void
}) {
  const id = useId()
  const minimum = today()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => `${(range.start || minimum).slice(0, 7)}-01`)
  const monthDate = parse(month)
  const year = monthDate.getUTCFullYear()
  const index = monthDate.getUTCMonth()
  const count = new Date(Date.UTC(year, index + 1, 0)).getUTCDate()
  const offset = (monthDate.getUTCDay() + 6) % 7
  const move = (by: number) => setMonth(iso(new Date(Date.UTC(year, index + by, 1))))
  const label = range.start
    ? `${dateLabel(range.start)}${range.end ? ` – ${dateLabel(range.end)}` : ''}`
    : 'Select travel dates'

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="inquiry-field flex min-h-10 items-center gap-2 text-left"
      >
        <Icon name="calendar" size={18} /> {label}
      </button>
      {open && (
        <div id={id} className="mt-2 rounded-xl bg-white p-2.5 text-slate-900">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              disabled={month.slice(0, 7) <= minimum.slice(0, 7)}
              onClick={() => move(-1)}
              className="grid size-8 place-items-center rounded-lg hover:bg-slate-100 disabled:opacity-30"
            >
              <Icon name="chevron" size={16} className="rotate-180" />
            </button>
            <strong aria-live="polite" className="text-xs">
              {monthLabel(month)}
            </strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => move(1)}
              className="grid size-8 place-items-center rounded-lg hover:bg-slate-100"
            >
              <Icon name="chevron" size={16} />
            </button>
          </div>
          <p aria-live="polite" className="mb-2 text-center text-[11px] text-slate-600">
            {range.start && !range.end ? 'Choose your end date' : 'Choose your start date'}
          </p>
          <div className="grid grid-cols-7 gap-y-0.5 text-center text-[11px]">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <span key={day} className="py-1 text-slate-500">
                {day}
              </span>
            ))}
            {Array.from({ length: offset }, (_, index) => (
              <span key={`blank-${index}`} />
            ))}
            {Array.from({ length: count }, (_, day) => {
              const date = `${month.slice(0, 7)}-${String(day + 1).padStart(2, '0')}`
              const selected = date === range.start || date === range.end
              return (
                <button
                  key={date}
                  type="button"
                  aria-label={dateLabel(date)}
                  aria-pressed={selected}
                  disabled={date < minimum}
                  onClick={() => {
                    if (!range.start || range.end) onChange({ start: date, end: '' })
                    else {
                      onChange(
                        date < range.start
                          ? { start: date, end: range.start }
                          : { start: range.start, end: date }
                      )
                      setOpen(false)
                    }
                  }}
                  className={`h-8 rounded-md hover:bg-orange-100 disabled:text-slate-300 ${selected ? 'bg-[#ab3526] font-bold text-white hover:bg-[#ab3526]' : range.end && date > range.start && date < range.end ? 'bg-orange-50' : ''}`}
                >
                  {day + 1}
                </button>
              )
            })}
          </div>
          {range.start && (
            <button
              type="button"
              onClick={() => onChange({ start: '', end: '' })}
              className="mt-2 text-xs font-medium text-[#ab3526] underline"
            >
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  )
}
