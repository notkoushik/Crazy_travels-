import {
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { Icon } from '../../../components/Icon'
import { isGoogleMapsLink } from '../../../components/GoogleVerifiedBadge'

const inputStyle =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15'

interface LabelProps {
  label: string
  hint?: string
}

function LabeledField({
  label,
  hint,
  required,
  children,
}: LabelProps & { required?: boolean; children: ReactNode }) {
  return (
    <label className="grid content-start gap-1.5 min-w-0 text-sm">
      <span className="font-medium text-slate-800">
        {label}
        {required && <span className="text-emerald-800"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs leading-relaxed text-slate-600">{hint}</span>}
    </label>
  )
}

export function Field({ label, hint, ...input }: LabelProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <LabeledField label={label} hint={hint} required={input.required}>
      <input className={inputStyle} {...input} />
    </LabeledField>
  )
}

export function NumberField({
  decimal = false,
  ...input
}: LabelProps & InputHTMLAttributes<HTMLInputElement> & { decimal?: boolean }) {
  return (
    <Field
      {...input}
      type="text"
      inputMode={decimal ? 'decimal' : 'numeric'}
      pattern={input.pattern ?? (decimal ? '[0-9]+([.,][0-9]{1,2})?' : '[0-9]+')}
    />
  )
}

export function TextArea({
  label,
  hint,
  ...input
}: LabelProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <LabeledField label={label} hint={hint} required={input.required}>
      <textarea rows={3} className={`${inputStyle} resize-y`} {...input} />
    </LabeledField>
  )
}

export function SelectField({
  label,
  name,
  value,
  options,
  required,
}: {
  label: string
  name: string
  value?: string
  options: readonly string[]
  required?: boolean
}) {
  return (
    <LabeledField label={label} required={required}>
      <select className={inputStyle} name={name} defaultValue={value ?? ''} required={required}>
        <option value="">Select {label.toLowerCase()}</option>
        {value && !options.includes(value) && <option>{value}</option>}
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </LabeledField>
  )
}

export function EditorSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white shadow-2xs"
    >
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
        <h2 id={`${id}-heading`} className="text-base font-semibold text-slate-950">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>}
      </div>
      <div className="space-y-5 p-4 sm:p-6">{children}</div>
    </section>
  )
}

export function GoogleReviewSection({
  googleRating,
  googleReviewsCount,
  googleMapsUrl,
}: {
  googleRating?: number
  googleReviewsCount?: number
  googleMapsUrl?: string
}) {
  return (
    <EditorSection
      id="google-reviews"
      title="Google Maps reviews"
      description="Copy the rating, review count, and share link from the same Maps listing. Leave these blank if you don’t have a source."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Google rating"
          name="googleRating"
          decimal
          pattern="[0-9]+([.,][0-9])?"
          defaultValue={googleRating}
          placeholder="e.g. 4.6"
          hint="From 1 to 5, with up to one decimal place."
        />
        <NumberField
          label="Google review count"
          name="googleReviewsCount"
          defaultValue={googleReviewsCount}
          placeholder="e.g. 124"
        />
      </div>
      <Field
        label="Google Maps share link"
        name="googleMapsUrl"
        type="url"
        defaultValue={googleMapsUrl}
        placeholder="https://maps.app.goo.gl/…"
      />
    </EditorSection>
  )
}

export function InventoryEditor({
  title,
  listLabel,
  description,
  saveLabel,
  sections,
  onBack,
  onSave,
  uploading,
  children,
}: {
  title: string
  listLabel: string
  description: string
  saveLabel: string
  sections: readonly (readonly [string, string])[]
  onBack: () => void
  onSave: (form: FormData) => Promise<void>
  uploading: boolean
  children: ReactNode
}) {
  const submitting = useRef(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current || uploading) return
    const form = event.currentTarget
    const values = new FormData(form)
    submitting.current = true
    setSaving(true)
    setError('')
    try {
      await onSave(values)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save the listing. Please try again.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6 border-b border-slate-200 pb-5 sm:mb-7 sm:pb-6">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900 hover:underline disabled:opacity-50"
        >
          <Icon name="arrow" size={16} className="rotate-180" /> {listLabel}
        </button>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
      </header>
      <form onSubmit={submit} className="min-w-0">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_200px]">
          <fieldset disabled={saving} className="min-w-0 space-y-5">
            {children}
          </fieldset>
          <nav
            aria-label="Editor sections"
            className="order-first flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-2 xl:sticky xl:top-20 xl:order-none xl:grid"
          >
            {sections.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => document.getElementById(id)?.scrollIntoView({ block: 'start' })}
                className="rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 sm:text-sm"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="sticky bottom-0 z-10 mt-5 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          {error && (
            <p role="alert" className="w-full text-sm font-medium text-red-700 sm:mr-auto sm:w-auto">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#10493f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a382f] disabled:opacity-60"
          >
            <Icon name="check" size={16} /> {saving ? 'Saving…' : uploading ? 'Uploading photo…' : saveLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export const textValue = (form: FormData, name: string) => String(form.get(name) ?? '').trim()

export function requiredText(form: FormData, name: string, label: string) {
  const value = textValue(form, name)
  if (!value) throw new Error(`${label} is required.`)
  return value
}

export const lineValues = (form: FormData, name: string) =>
  textValue(form, name)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

export function numberValue(
  form: FormData,
  name: string,
  label: string,
  min: number,
  max = 2_147_483_647
): number | undefined {
  const raw = textValue(form, name)
  if (!raw) return undefined
  const value = Number(raw.replace(',', '.'))
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max.toLocaleString('en-IN')}.`)
  }
  return value
}

export function requiredNumber(form: FormData, name: string, label: string, min: number, max?: number) {
  const value = numberValue(form, name, label, min, max)
  if (value === undefined) throw new Error(`${label} is required.`)
  return value
}

export const rupees = (value: number) => `₹${value.toLocaleString('en-IN')}`

export function googleReviews(form: FormData) {
  const googleMapsUrl = textValue(form, 'googleMapsUrl')
  if (googleMapsUrl && !isGoogleMapsLink(googleMapsUrl))
    throw new Error('Enter a Google Maps share link or leave the field blank.')

  return {
    googleRating: numberValue(form, 'googleRating', 'Google rating', 1, 5),
    googleReviewsCount: numberValue(form, 'googleReviewsCount', 'Google review count', 0),
    googleMapsUrl,
  }
}
