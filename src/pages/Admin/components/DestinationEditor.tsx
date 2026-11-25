import { useRef, useState } from 'react'
import { Icon } from '../../../components/Icon'
import { ImageDropzone, validateCoverPhoto } from '../../../components/ImageDropzone'
import { catalogPhotoUrls } from '../../../data/catalogPhotos'
import type { DestinationCustomizationStop, DestinationItem } from '../../../types/travel'
import { GalleryEditor } from './GalleryEditor'
import {
  EditorSection,
  Field,
  GoogleReviewSection,
  InventoryEditor,
  NumberField,
  TextArea,
  googleReviews,
  lineValues,
  numberValue,
  requiredNumber,
  requiredText,
  rupees,
  textValue,
} from './InventoryEditor'

const sections = [
  ['destination-details', 'Destination details'],
  ['destination-travel', 'Travel guidance'],
  ['destination-things-to-do', 'Things to do'],
  ['destination-customization', 'Customization add-ons'],
  ['destination-photos', 'Photos'],
  ['google-reviews', 'Google Maps reviews'],
] as const

const durationOptions = ['3D/2N', '4D/3N', '5D/4N'] as const

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15'

interface CustomizationStopDraft {
  key: string
  id: string
  name: string
  subtitle: string
  extraDays: string
  extraNights: string
  priceDelta: string
  highlightsText: string
  allowedDurations: string[]
  image: string
}

const newCustomizationStop = (): CustomizationStopDraft => ({
  key: crypto.randomUUID(),
  id: '',
  name: '',
  subtitle: '',
  extraDays: '1',
  extraNights: '1',
  priceDelta: '',
  highlightsText: '',
  allowedDurations: [],
  image: '',
})

const stopToDraft = (stop: DestinationCustomizationStop): CustomizationStopDraft => ({
  key: crypto.randomUUID(),
  id: stop.id,
  name: stop.name,
  subtitle: stop.subtitle ?? '',
  extraDays: String(stop.extraDays ?? 0),
  extraNights: String(stop.extraNights ?? 0),
  priceDelta: stop.priceDelta !== undefined ? String(stop.priceDelta) : '',
  highlightsText: (stop.highlights ?? []).join('\n'),
  allowedDurations: [...(stop.allowedDurations ?? [])],
  image: stop.image ?? '',
})

function parseHighlights(raw: string): string[] {
  const trimmed = raw.trim()
  if (!trimmed) return []
  if (/\r?\n/.test(trimmed)) {
    return trimmed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return [trimmed]
}

function parseNonNegativeInt(raw: string, label: string, fallback = 0): number {
  const trimmed = raw.trim()
  if (!trimmed) return fallback
  const value = Number(trimmed)
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a whole number of 0 or higher.`)
  }
  return value
}

function slugifyStopId(name: string, usedIds: Set<string>, existingId?: string): string {
  const trimmedExisting = existingId?.trim()
  if (trimmedExisting && !usedIds.has(trimmedExisting)) {
    usedIds.add(trimmedExisting)
    return trimmedExisting
  }
  const base =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'stop'
  let candidate = base
  let suffix = 2
  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  usedIds.add(candidate)
  return candidate
}

export function DestinationEditor({
  destination,
  onBack,
  onSave,
}: {
  destination?: DestinationItem
  onBack: () => void
  onSave: (destination: DestinationItem) => Promise<void>
}) {
  const slug = useRef(destination?.slug)
  const [image, setImage] = useState(destination?.image ?? '')
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState(() => catalogPhotoUrls(image, destination?.gallery).slice(image.trim() ? 1 : 0))
  const [galleryBusy, setGalleryBusy] = useState(false)
  const [permitRequired, setPermitRequired] = useState(destination?.permitRequired ?? false)
  const [adventureEnabled, setAdventureEnabled] = useState(destination?.adventureEnabled ?? false)
  const [customizationStops, setCustomizationStops] = useState<CustomizationStopDraft[]>(() =>
    (destination?.customizationOptions ?? []).map(stopToDraft)
  )

  const updateStop = (key: string, patch: Partial<Omit<CustomizationStopDraft, 'key'>>) => {
    setCustomizationStops((current) =>
      current.map((stop) => (stop.key === key ? { ...stop, ...patch } : stop))
    )
  }

  const toggleStopDuration = (key: string, durationLabel: string) => {
    setCustomizationStops((current) =>
      current.map((stop) => {
        if (stop.key !== key) return stop
        const exists = stop.allowedDurations.includes(durationLabel)
        return {
          ...stop,
          allowedDurations: exists
            ? stop.allowedDurations.filter((item) => item !== durationLabel)
            : [...stop.allowedDurations, durationLabel],
        }
      })
    )
  }

  const moveStop = (index: number, offset: number) => {
    setCustomizationStops((current) => {
      const target = index + offset
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return next
    })
  }

  const removeStop = (key: string) => {
    setCustomizationStops((current) => current.filter((stop) => stop.key !== key))
  }

  const save = async (form: FormData) => {
    const city = requiredText(form, 'city', 'City or destination')
    const priceNum = requiredNumber(form, 'price', 'Starting price', 1)

    const usedStopIds = new Set<string>()
    const customizationOptions: DestinationCustomizationStop[] = customizationStops.map((stop, idx) => {
      const name = stop.name.trim()
      if (!name) {
        throw new Error(`Customization add-on #${idx + 1} needs a location name.`)
      }
      const extraDays = parseNonNegativeInt(stop.extraDays, `Customization "${name}" extra days`, 0)
      const extraNights = parseNonNegativeInt(
        stop.extraNights,
        `Customization "${name}" extra nights`,
        0
      )
      const priceRaw = stop.priceDelta.trim()
      let priceDelta: number | undefined
      if (priceRaw) {
        const parsedPrice = Number(priceRaw.replace(/,/g, ''))
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
          throw new Error(`Customization "${name}" price delta must be 0 or higher.`)
        }
        priceDelta = Math.round(parsedPrice)
      }
      const subtitle = stop.subtitle.trim() || undefined
      const highlights = parseHighlights(stop.highlightsText)
      const allowedDurations = stop.allowedDurations.length ? stop.allowedDurations : undefined
      const imageUrl = stop.image.trim() || undefined

      return {
        id: slugifyStopId(name, usedStopIds, stop.id),
        name,
        ...(subtitle ? { subtitle } : {}),
        extraDays,
        extraNights,
        ...(priceDelta !== undefined ? { priceDelta } : {}),
        highlights,
        ...(allowedDurations ? { allowedDurations } : {}),
        ...(imageUrl ? { image: imageUrl } : {}),
      }
    })

    if (!slug.current) {
      const prefix = city
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 100)
      slug.current = `${prefix || 'destination'}-${crypto.randomUUID().slice(0, 8)}`
    }

    await onSave({
      ...destination,
      slug: slug.current,
      city,
      state: requiredText(form, 'state', 'State or province'),
      country: requiredText(form, 'country', 'Country'),
      region: textValue(form, 'region'),
      priceNum,
      price: rupees(priceNum),
      image: await validateCoverPhoto(image, destination?.image),
      season: textValue(form, 'season'),
      duration: requiredText(form, 'duration', 'Suggested trip length'),
      tagline: textValue(form, 'tagline'),
      videoUrl: textValue(form, 'videoUrl'),
      description: destination
        ? textValue(form, 'description')
        : requiredText(form, 'description', 'Destination overview'),
      highlights: lineValues(form, 'highlights'),
      gallery,
      bestTimeToVisit: textValue(form, 'bestTimeToVisit'),
      idealFor: textValue(form, 'idealFor'),
      isTrending: form.has('isTrending'),
      adventureEnabled,
      customizationOptions,
      displayOrder: numberValue(form, 'displayOrder', 'Display order', 0),
      nearestAirport: textValue(form, 'nearestAirport'),
      nearestRailway: textValue(form, 'nearestRailway'),
      recommendedStayDays: textValue(form, 'recommendedStayDays'),
      peakSeason: textValue(form, 'peakSeason'),
      avgTemp: textValue(form, 'avgTemp'),
      permitRequired,
      permitDetails: permitRequired
        ? requiredText(form, 'permitDetails', 'Permit details')
        : textValue(form, 'permitDetails'),
      clothingAdvice: textValue(form, 'clothingAdvice'),
      culturalNotes: textValue(form, 'culturalNotes'),
      mustTryFood: lineValues(form, 'mustTryFood'),
      keyAttractions: lineValues(form, 'keyAttractions')
        .map((line) => {
          const [name, type = ''] = line.split('|', 2)
          return { name: name.trim(), type: type.trim() }
        })
        .filter((attraction) => attraction.name),
      networkCoverage: textValue(form, 'networkCoverage'),
      ...googleReviews(form),
    })
  }

  return (
    <InventoryEditor
      title={destination ? 'Edit destination' : 'Add new destination'}
      listLabel="Destinations"
      description="Create a destination listing with a starting price, useful travel guidance, and photos."
      saveLabel="Save destination"
      sections={sections}
      onBack={onBack}
      onSave={save}
      uploading={uploading || galleryBusy}
    >
      <EditorSection id="destination-details" title="Destination details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="City or destination"
            name="city"
            defaultValue={destination?.city}
            required
            maxLength={120}
            placeholder="e.g. Udaipur"
          />
          <Field
            label="State or province"
            name="state"
            defaultValue={destination?.state}
            required
            maxLength={120}
            placeholder="e.g. Rajasthan"
          />
          <Field
            label="Country"
            name="country"
            defaultValue={destination?.country}
            required
            maxLength={120}
            placeholder="e.g. India"
          />
          <Field
            label="Region"
            name="region"
            defaultValue={destination?.region}
            maxLength={64}
            placeholder="e.g. North India"
          />
          <NumberField
            label="Starting price (₹)"
            name="price"
            defaultValue={destination?.priceNum}
            required
            placeholder="e.g. 29900"
          />
          <Field
            label="Suggested trip length"
            name="duration"
            defaultValue={destination?.duration}
            required
            maxLength={60}
            placeholder="e.g. 5 days"
          />
        </div>
        <Field
          label="Short tagline"
          name="tagline"
          defaultValue={destination?.tagline}
          placeholder="A short line for the destination card"
        />
        <Field
          label="Hero Video URL (optional MP4 or WebM)"
          name="videoUrl"
          defaultValue={destination?.videoUrl}
          placeholder="e.g. /Video/optimized/destination_kerala.mp4 or https://..."
          hint="If provided, a cinematic rolling video will play at the top of this destination's page."
        />
        <TextArea
          label="Destination overview"
          name="description"
          defaultValue={destination?.description}
          required={!destination}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Display order"
            name="displayOrder"
            defaultValue={destination?.displayOrder}
            hint="Lower numbers appear first."
          />
          <div className="space-y-2.5 self-start py-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                name="isTrending"
                type="checkbox"
                defaultChecked={destination?.isTrending ?? true}
                className="size-4 accent-emerald-800"
              />{' '}
              Show on the homepage
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                name="adventureEnabled"
                type="checkbox"
                checked={adventureEnabled}
                onChange={(event) => setAdventureEnabled(event.target.checked)}
                className="mt-0.5 size-4 accent-emerald-800"
              />
              <span>
                <span className="font-medium text-slate-800">
                  Adventure Packages Available on this Destination
                </span>
                <span className="block text-xs text-slate-500">
                  Shows the Adventure category card on this destination page.
                </span>
              </span>
            </label>
          </div>
        </div>
      </EditorSection>
      <EditorSection id="destination-travel" title="Travel guidance">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Season shown on the destination card"
            name="season"
            defaultValue={destination?.season}
            maxLength={120}
            placeholder="e.g. October to March"
          />
          <Field
            label="Best time to visit"
            name="bestTimeToVisit"
            defaultValue={destination?.bestTimeToVisit}
          />
          <Field
            label="Peak season"
            name="peakSeason"
            defaultValue={destination?.peakSeason}
            maxLength={128}
          />
          <Field
            label="Average temperature"
            name="avgTemp"
            defaultValue={destination?.avgTemp}
            maxLength={64}
          />
          <Field
            label="Nearest airport"
            name="nearestAirport"
            defaultValue={destination?.nearestAirport}
            maxLength={255}
          />
          <Field
            label="Nearest railway station"
            name="nearestRailway"
            defaultValue={destination?.nearestRailway}
            maxLength={255}
          />
          <Field
            label="Recommended stay"
            name="recommendedStayDays"
            defaultValue={destination?.recommendedStayDays}
            maxLength={64}
          />
          <Field label="Ideal for" name="idealFor" defaultValue={destination?.idealFor} />
          <Field
            label="Network coverage"
            name="networkCoverage"
            defaultValue={destination?.networkCoverage}
            maxLength={128}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={permitRequired}
            onChange={(event) => setPermitRequired(event.target.checked)}
            className="size-4 accent-emerald-800"
          />{' '}
          A permit is required
        </label>
        <TextArea
          label="Permit details"
          name="permitDetails"
          defaultValue={destination?.permitDetails}
          required={permitRequired}
          hint="Explain who needs a permit and where to get it."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextArea
            label="Clothing advice"
            name="clothingAdvice"
            defaultValue={destination?.clothingAdvice}
          />
          <TextArea label="Cultural notes" name="culturalNotes" defaultValue={destination?.culturalNotes} />
        </div>
      </EditorSection>
      <EditorSection id="destination-things-to-do" title="Things to do">
        <TextArea
          label="Highlights"
          name="highlights"
          defaultValue={destination?.highlights.join('\n')}
          hint="Enter one experience per line."
        />
        <TextArea
          label="Key attractions"
          name="keyAttractions"
          defaultValue={destination?.keyAttractions
            ?.map(({ name, type }) => (type ? `${name} | ${type}` : name))
            .join('\n')}
          hint="Enter one attraction per line. Add an optional type after a vertical bar, for example City Palace | Museum."
        />
        <TextArea
          label="Food to try"
          name="mustTryFood"
          defaultValue={destination?.mustTryFood?.join('\n')}
          hint="Enter one dish per line."
        />
      </EditorSection>
      <EditorSection
        id="destination-customization"
        title="Customization Add-On Locations (3+C / 4+C / 5+C)"
        description="Add, edit, reorder, and delete optional route add-ons (such as Dharamshala, Dalhousie, Chandigarh, Amritsar, Tosh, Shangarh, or Baralacha Pass) that travelers can append to base packages."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-emerald-900" aria-live="polite">
            {customizationStops.length}{' '}
            {customizationStops.length === 1 ? 'add-on location' : 'add-on locations'} configured
          </p>
          <button
            type="button"
            onClick={() =>
              setCustomizationStops((current) => [...current, newCustomizationStop()])
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-50"
          >
            <Icon name="plus" size={14} /> Add customization stop
          </button>
        </div>

        {!customizationStops.length && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-600">
            No customization add-on locations added yet. Click &ldquo;Add customization stop&rdquo; to
            let travelers extend 3D/2N, 4D/3N, or 5D/4N itineraries with extra locations.
          </p>
        )}

        {customizationStops.map((stop, index) => {
          const allDurationChoices = [
            ...durationOptions,
            ...stop.allowedDurations.filter(
              (item) => !durationOptions.includes(item as (typeof durationOptions)[number])
            ),
          ]
          const previewPrice = Number(stop.priceDelta.replace(/,/g, ''))
          return (
            <div
              key={stop.key}
              className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-900 px-2 py-0.5 text-xs font-bold text-white">
                    Customization {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {stop.name.trim() || `Add-On Location #${index + 1}`}
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    +{stop.extraDays || '0'}D / +{stop.extraNights || '0'}N
                    {stop.priceDelta.trim() && Number.isFinite(previewPrice) && previewPrice >= 0
                      ? ` · +₹${Math.round(previewPrice).toLocaleString('en-IN')}`
                      : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveStop(index, -1)}
                    aria-label={`Move customization ${index + 1} up`}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 disabled:opacity-35"
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    disabled={index === customizationStops.length - 1}
                    onClick={() => moveStop(index, 1)}
                    aria-label={`Move customization ${index + 1} down`}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 disabled:opacity-35"
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStop(stop.key)}
                    aria-label={`Remove customization ${index + 1}`}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid content-start gap-1.5 text-sm">
                  <span className="font-medium text-slate-800">
                    Location name <span className="text-emerald-800">*</span>
                  </span>
                  <input
                    type="text"
                    value={stop.name}
                    onChange={(event) => updateStop(stop.key, { name: event.target.value })}
                    placeholder="e.g. Dharamshala"
                    maxLength={120}
                    required
                    className={inputClass}
                  />
                </label>

                <label className="grid content-start gap-1.5 text-sm">
                  <span className="font-medium text-slate-800">Subtitle / Route note</span>
                  <input
                    type="text"
                    value={stop.subtitle}
                    onChange={(event) => updateStop(stop.key, { subtitle: event.target.value })}
                    placeholder="e.g. McLeodganj, Dalai Lama Temple & Bhagsunag"
                    maxLength={200}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid content-start gap-1.5 text-sm">
                  <span className="font-medium text-slate-800">Extra days</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={stop.extraDays}
                    onChange={(event) => updateStop(stop.key, { extraDays: event.target.value })}
                    placeholder="e.g. 1"
                    className={inputClass}
                  />
                </label>

                <label className="grid content-start gap-1.5 text-sm">
                  <span className="font-medium text-slate-800">Extra nights</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={stop.extraNights}
                    onChange={(event) => updateStop(stop.key, { extraNights: event.target.value })}
                    placeholder="e.g. 1"
                    className={inputClass}
                  />
                </label>

                <label className="grid content-start gap-1.5 text-sm">
                  <span className="font-medium text-slate-800">Price delta (₹ INR)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={stop.priceDelta}
                    onChange={(event) => updateStop(stop.key, { priceDelta: event.target.value })}
                    placeholder="e.g. 2500"
                    className={inputClass}
                  />
                </label>

                <label className="grid content-start gap-1.5 text-sm">
                  <span className="font-medium text-slate-800">Image URL (optional)</span>
                  <input
                    type="text"
                    value={stop.image}
                    onChange={(event) => updateStop(stop.key, { image: event.target.value })}
                    placeholder="/catalog-photos/... or https://..."
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="grid content-start gap-1.5 text-sm">
                <span className="font-medium text-slate-800">Highlights</span>
                <textarea
                  rows={3}
                  value={stop.highlightsText}
                  onChange={(event) =>
                    updateStop(stop.key, { highlightsText: event.target.value })
                  }
                  placeholder={
                    'McLeodganj Tibetan monastery & market walk\nBhagsunag Waterfall & Dal Lake viewpoint'
                  }
                  className={`${inputClass} resize-y`}
                />
                <span className="text-xs text-slate-600">
                  Enter one highlight per line (or comma-separated).
                </span>
              </label>

              <div className="space-y-2">
                <span className="block text-sm font-medium text-slate-800">
                  Allowed durations (optional)
                </span>
                <div className="flex flex-wrap gap-3">
                  {allDurationChoices.map((durationLabel) => {
                    const checked = stop.allowedDurations.includes(durationLabel)
                    return (
                      <label
                        key={durationLabel}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          checked
                            ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStopDuration(stop.key, durationLabel)}
                          className="size-3.5 accent-emerald-800"
                        />
                        {durationLabel}
                      </label>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-500">
                  Check specific base durations (3+C / 4+C / 5+C) or leave all unchecked to allow
                  this stop on any package duration.
                </p>
              </div>
            </div>
          )
        })}
      </EditorSection>
      <EditorSection id="destination-photos" title="Photos">
        <ImageDropzone
          value={image}
          onChange={setImage}
          onUploadingChange={setUploading}
          label="Cover photo *"
        />
        <GalleryEditor cover={image} value={gallery} onChange={setGallery} onBusyChange={setGalleryBusy} />
      </EditorSection>
      <GoogleReviewSection
        googleRating={destination?.googleRating}
        googleReviewsCount={destination?.googleReviewsCount}
        googleMapsUrl={destination?.googleMapsUrl}
      />
    </InventoryEditor>
  )
}
