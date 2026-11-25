import { useRef, useState } from 'react'
import { Icon } from '../../../components/Icon'
import { ImageDropzone, validateCoverPhoto } from '../../../components/ImageDropzone'
import { catalogPhotoUrls, getStarterPackagePhoto } from '../../../data/catalogPhotos'
import { useDynamicStore } from '../../../services/dataStore'
import type {
  DestinationItem,
  ItineraryDay,
  PackageCategory,
  PackageItem,
  PackagePricingTier,
  PackagePricingTiers,
} from '../../../types/travel'
import { GalleryEditor } from './GalleryEditor'
import {
  EditorSection,
  Field,
  GoogleReviewSection,
  InventoryEditor,
  NumberField,
  SelectField,
  TextArea,
  googleReviews,
  lineValues,
  numberValue,
  requiredNumber,
  requiredText,
  rupees,
  textValue,
} from './InventoryEditor'

const themes = ['Heritage', 'Honeymoon', 'Family', 'Adventure', 'Scenic', 'Wildlife'] as const
const categories: readonly PackageCategory[] = ['Couple', 'Family', 'Bachelors', 'Adventure']
const perUnitOptions = ['Per Couple', 'Per Person'] as const
const durationPresets = [
  { label: '3D / 2N', days: 3, nights: 2 },
  { label: '4D / 3N', days: 4, nights: 3 },
  { label: '5D / 4N', days: 5, nights: 4 },
  { label: '6D / 5N', days: 6, nights: 5 },
  { label: '7D / 6N', days: 7, nights: 6 },
] as const

const defaultTierRows = (): TierDraft[] => [
  { key: crypto.randomUUID(), name: 'Standard', offSeasonPrice: '', seasonPrice: '' },
  { key: crypto.randomUUID(), name: 'Standard Plus', offSeasonPrice: '', seasonPrice: '' },
  { key: crypto.randomUUID(), name: 'Premium', offSeasonPrice: '', seasonPrice: '' },
]

const sections = [
  ['package-details', 'Tour details'],
  ['package-pricing', 'Pricing & tiers'],
  ['package-itinerary', 'Day-by-day planner'],
  ['package-inclusions', 'Inclusions & policies'],
  ['package-photos', 'Location gallery'],
  ['google-reviews', 'Google Maps reviews'],
] as const

interface TierDraft {
  key: string
  name: string
  offSeasonPrice: string
  seasonPrice: string
}

interface DayDraft {
  key: string
  day: ItineraryDay
}

const newDay = (dayNum = 1): DayDraft => ({
  key: crypto.randomUUID(),
  day: { day: dayNum, title: '', description: '' },
})

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15'

export function PackageEditor({
  pkg,
  destinations: providedDestinations,
  onBack,
  onSave,
}: {
  pkg?: PackageItem
  destinations?: DestinationItem[]
  onBack: () => void
  onSave: (pkg: PackageItem) => Promise<void>
}) {
  const store = useDynamicStore()
  const destinations = [...(providedDestinations ?? store.destinations)].sort((a, b) =>
    a.city.localeCompare(b.city)
  )

  const [id] = useState(() => pkg?.id ?? `pkg-${crypto.randomUUID()}`)
  const [image, setImage] = useState(pkg?.image ?? '')
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState(() =>
    catalogPhotoUrls(image, pkg?.gallery).slice(image.trim() ? 1 : 0)
  )
  const [galleryBusy, setGalleryBusy] = useState(false)

  const [destinationSlug, setDestinationSlug] = useState(pkg?.destinationSlug ?? '')
  const [place, setPlace] = useState(pkg?.place ?? '')
  const [stateName, setStateName] = useState(pkg?.state ?? '')

  const oldNights = pkg?.duration?.match(/(\d+)\s*nights?/i)?.[1]
  const [dayCount, setDayCount] = useState(pkg?.daysCount?.toString() ?? '')
  const [nightsCount, setNightsCount] = useState(
    pkg?.nightsCount !== undefined
      ? String(pkg.nightsCount)
      : oldNights ?? (pkg?.daysCount ? String(Math.max(0, pkg.daysCount - 1)) : '')
  )

  const [startingPrice, setStartingPrice] = useState(pkg?.priceNum ? String(pkg.priceNum) : '')
  const originalPriceText = pkg?.originalPrice?.replace(/[₹,\s]/g, '') ?? ''
  const originalPrice = /^\d+$/.test(originalPriceText) ? originalPriceText : ''

  // Dynamic Pricing Tiers state
  const [tiersEnabled, setTiersEnabled] = useState(() => Boolean(pkg?.pricingTiers?.tiers?.length))
  const [perUnit, setPerUnit] = useState(pkg?.pricingTiers?.perUnit ?? 'Per Couple')
  const [minPax, setMinPax] = useState(
    pkg?.pricingTiers?.minPax !== undefined ? String(pkg.pricingTiers.minPax) : ''
  )
  const [offSeasonDates, setOffSeasonDates] = useState(pkg?.pricingTiers?.offSeasonDates ?? '')
  const [seasonDates, setSeasonDates] = useState(pkg?.pricingTiers?.seasonDates ?? '')
  const [tiers, setTiers] = useState<TierDraft[]>(() =>
    pkg?.pricingTiers?.tiers?.length
      ? pkg.pricingTiers.tiers.map((tier) => ({
          key: crypto.randomUUID(),
          name: tier.name,
          offSeasonPrice: tier.offSeasonPrice ? String(tier.offSeasonPrice) : '',
          seasonPrice: tier.seasonPrice ? String(tier.seasonPrice) : '',
        }))
      : defaultTierRows()
  )

  // Dynamic Day-by-Day Planner state
  const [days, setDays] = useState<DayDraft[]>(() =>
    pkg?.itinerary?.length
      ? pkg.itinerary.map((day) => ({ key: crypto.randomUUID(), day }))
      : [newDay(1)]
  )
  const initialDays = useRef(days)

  const handleDestinationChange = (nextSlug: string) => {
    setDestinationSlug(nextSlug)
    const match = destinations.find((d) => d.slug === nextSlug)
    if (!match) return
    if (!place.trim()) setPlace(match.city)
    if (!stateName.trim()) setStateName(match.state)
  }

  const applyDurationPreset = (presetDays: number, presetNights: number) => {
    setDayCount(String(presetDays))
    setNightsCount(String(presetNights))
  }

  const syncItineraryDays = () => {
    const target = Number(dayCount)
    if (!Number.isInteger(target) || target < 1) return
    setDays((current) => {
      if (current.length === target) return current
      if (current.length < target) {
        const extra = Array.from({ length: target - current.length }, (_, idx) =>
          newDay(current.length + idx + 1)
        )
        return [...current, ...extra]
      }
      return current.slice(0, target)
    })
  }

  const moveDay = (index: number, offset: number) => {
    setDays((current) => {
      const target = index + offset
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return next
    })
  }

  const updateTier = (key: string, patch: Partial<Omit<TierDraft, 'key'>>) => {
    setTiers((current) => current.map((tier) => (tier.key === key ? { ...tier, ...patch } : tier)))
  }

  const lowestTierPrice = () => {
    const prices = tiers
      .flatMap((tier) => [Number(tier.offSeasonPrice), Number(tier.seasonPrice)])
      .filter((val) => Number.isFinite(val) && val > 0)
    return prices.length ? Math.min(...prices) : undefined
  }

  const parseNonNegativeInt = (raw: string, label: string): number => {
    const trimmed = raw.trim()
    if (!trimmed) return 0
    const parsed = Number(trimmed)
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`${label} must be a valid non-negative amount.`)
    }
    return Math.round(parsed)
  }

  const save = async (form: FormData) => {
    const daysCount = requiredNumber(form, 'daysCount', 'Number of days', 1)
    const parsedNights = numberValue(form, 'nightsCount', 'Number of nights', 0, daysCount)
    const resolvedNightsCount = parsedNights ?? Math.max(0, daysCount - 1)

    const rate = requiredNumber(form, 'price', 'Starting price', 1)
    const compareAt = numberValue(form, 'originalPrice', 'Regular price', 1)
    if (compareAt !== undefined && compareAt <= rate) {
      throw new Error('Regular price must be higher than the starting price.')
    }

    let pricingTiersPayload: PackagePricingTiers | undefined
    if (tiersEnabled) {
      const parsedTiers: PackagePricingTier[] = tiers.map((tier, idx) => {
        const name = tier.name.trim()
        if (!name) throw new Error(`Pricing tier #${idx + 1} needs a tier name.`)
        return {
          name,
          offSeasonPrice: parseNonNegativeInt(tier.offSeasonPrice, `${name} off-season price`),
          seasonPrice: parseNonNegativeInt(tier.seasonPrice, `${name} season price`),
        }
      })

      if (!parsedTiers.length || !parsedTiers.some((t) => t.offSeasonPrice > 0 || t.seasonPrice > 0)) {
        throw new Error(
          'Enter at least one tier price (Off-Season or Season), or uncheck tiered seasonal pricing.'
        )
      }

      const trimmedMinPax = minPax.trim()
      const parsedMinPax = trimmedMinPax ? Number(trimmedMinPax) : undefined
      if (parsedMinPax !== undefined && (!Number.isInteger(parsedMinPax) || parsedMinPax < 1)) {
        throw new Error('Minimum passengers (minPax) must be a whole number of at least 1.')
      }

      pricingTiersPayload = {
        perUnit: perUnit.trim() || 'Per Couple',
        ...(parsedMinPax !== undefined ? { minPax: parsedMinPax } : {}),
        ...(offSeasonDates.trim() ? { offSeasonDates: offSeasonDates.trim() } : {}),
        ...(seasonDates.trim() ? { seasonDates: seasonDates.trim() } : {}),
        tiers: parsedTiers,
      }
    }

    const itineraryChanged =
      !pkg || daysCount !== pkg.daysCount || days !== initialDays.current
    if (itineraryChanged && days.length !== daysCount) {
      throw new Error(
        `The itinerary needs ${daysCount} ${daysCount === 1 ? 'day' : 'days'} to match the trip duration.`
      )
    }

    const itinerary = days.map(({ key, day }, index): ItineraryDay => {
      const hotelRatingVal = numberValue(
        form,
        `${key}-hotelRating`,
        `Day ${index + 1} hotel rating`,
        1,
        5
      )
      const transfer = textValue(form, `${key}-transfer`)
      const hotelLocation = textValue(form, `${key}-hotelLocation`)
      const seasonalNote = textValue(form, `${key}-seasonalNote`)

      return {
        ...day,
        day: itineraryChanged ? index + 1 : day.day,
        title: requiredText(form, `${key}-title`, `Day ${index + 1} title`),
        description: requiredText(form, `${key}-description`, `Day ${index + 1} plan`),
        transfer: transfer || undefined,
        startLocation: textValue(form, `${key}-start`) || undefined,
        endLocation: textValue(form, `${key}-end`) || undefined,
        hotel: textValue(form, `${key}-hotel`) || undefined,
        hotelLocation: hotelLocation || undefined,
        hotelRating: hotelRatingVal,
        meals: textValue(form, `${key}-meals`) || undefined,
        activities: lineValues(form, `${key}-activities`),
        seasonalNote: seasonalNote || undefined,
      }
    })

    const duration =
      pkg && daysCount === pkg.daysCount && String(resolvedNightsCount) === oldNights
        ? pkg.duration
        : `${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}${
            resolvedNightsCount > 0
              ? ` / ${resolvedNightsCount} ${resolvedNightsCount === 1 ? 'Night' : 'Nights'}`
              : ''
          }`

    const discount =
      compareAt && compareAt > rate ? Math.floor(((compareAt - rate) / compareAt) * 100) : 0

    const summaryText = textValue(form, 'summary')
    const overviewInput = textValue(form, 'overview')
    const overview =
      overviewInput ||
      summaryText ||
      (pkg ? '' : requiredText(form, 'overview', 'Trip overview'))

    const categoryValue = textValue(form, 'category') as PackageCategory | ''
    const routeSummaryValue = textValue(form, 'routeSummary')
    const brochurePdfValue = textValue(form, 'brochurePdfUrl')

    await onSave({
      ...pkg,
      id,
      title: requiredText(form, 'title', 'Package title'),
      place: requiredText(form, 'place', 'Destination or route'),
      state: requiredText(form, 'state', 'State or region'),
      theme: requiredText(form, 'theme', 'Travel theme') as PackageItem['theme'],
      category: categoryValue || undefined,
      travellerGroup:
        categoryValue === 'Couple'
          ? 'Couples'
          : categoryValue === 'Family'
            ? 'Families'
            : categoryValue === 'Bachelors'
              ? 'Friends & bachelors'
              : pkg?.travellerGroup,
      destinationSlug: destinationSlug.trim() || undefined,
      duration,
      daysCount,
      nightsCount: resolvedNightsCount,
      routeSummary: routeSummaryValue || undefined,
      summary: summaryText || undefined,
      brochurePdfUrl: brochurePdfValue || undefined,
      pricingTiers: pricingTiersPayload,
      priceNum: rate,
      price: rupees(rate),
      originalPrice: compareAt ? rupees(compareAt) : '',
      discount: discount ? `${discount}% OFF` : '',
      featured: form.has('featured'),
      rating: pkg?.rating ?? 0,
      reviewCount: pkg?.reviewCount ?? 0,
      image: await validateCoverPhoto(image, pkg?.image),
      gallery,
      overview,
      highlights: lineValues(form, 'highlights'),
      inclusions: lineValues(form, 'inclusions'),
      exclusions: lineValues(form, 'exclusions'),
      thingsToCarry: lineValues(form, 'thingsToCarry'),
      cancellationPolicy: lineValues(form, 'cancellationPolicy'),
      itinerary,
      ...googleReviews(form),
    })
  }

  return (
    <InventoryEditor
      title={pkg ? 'Edit tour package' : 'Add new package'}
      listLabel="Tour packages"
      description="Configure category, destination link, duration & seasonal tiers, day-by-day planner, policies, and location gallery."
      saveLabel="Save package"
      sections={sections}
      onBack={onBack}
      onSave={save}
      uploading={uploading || galleryBusy}
    >
      <EditorSection id="package-details" title="Tour details">
        <Field
          label="Package title"
          name="title"
          defaultValue={pkg?.title}
          required
          maxLength={255}
          placeholder="e.g. Kullu Manali Romantic Escape"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid content-start gap-1.5 min-w-0 text-sm">
            <span className="font-medium text-slate-800">Linked destination</span>
            <select
              name="destinationSlug"
              value={destinationSlug}
              onChange={(event) => handleDestinationChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
            >
              <option value="">Select destination (optional)</option>
              {destinationSlug && !destinations.some((d) => d.slug === destinationSlug) && (
                <option value={destinationSlug}>{destinationSlug}</option>
              )}
              {destinations.map((dest) => (
                <option key={dest.slug} value={dest.slug}>
                  {dest.city} ({dest.state})
                </option>
              ))}
            </select>
            <span className="text-xs leading-relaxed text-slate-600">
              Connects this package to the Destination storefront page.
            </span>
          </label>

          <SelectField
            label="Package category"
            name="category"
            value={pkg?.category}
            options={categories}
          />

          <SelectField
            label="Travel theme"
            name="theme"
            value={pkg?.theme}
            required
            options={themes}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Destination or route"
            name="place"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            required
            maxLength={120}
            placeholder="e.g. Shimla Manali & Kasol"
          />
          <Field
            label="State or region"
            name="state"
            value={stateName}
            onChange={(event) => setStateName(event.target.value)}
            required
            maxLength={120}
            placeholder="e.g. Himachal Pradesh"
          />
          <Field
            label="Route night split"
            name="routeSummary"
            defaultValue={pkg?.routeSummary}
            maxLength={255}
            placeholder="e.g. 2N Manali • 1N Kasol • 1N Shimla"
            hint="Displayed as the route pill strip on the package detail page."
          />
          <Field
            label="Brochure PDF URL"
            name="brochurePdfUrl"
            defaultValue={pkg?.brochurePdfUrl}
            maxLength={500}
            placeholder="e.g. /Packages/HONEYMOON MANALI 3D-2N.pdf"
            hint="Relative /Packages/... path or external PDF download link."
          />
        </div>
        <TextArea
          label="Package summary"
          name="summary"
          defaultValue={pkg?.summary}
          placeholder="Concise 2–3 sentence summary of the route, stays, and ideal travelers."
          hint="Shown in the Package Summary tab alongside the full pricing table."
        />
        <TextArea
          label="Trip overview"
          name="overview"
          defaultValue={pkg?.overview}
          required={!pkg}
          hint="Explain the route, who the tour suits, and its main experiences."
        />

        <TextArea
          label="Highlights"
          name="highlights"
          defaultValue={pkg?.highlights.join('\n')}
          placeholder={'Solang Valley snow activities & Atal Tunnel drive\nHadimba Temple & Old Manali cafe walk'}
          hint="Enter one highlight per line."
        />

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={pkg?.featured ?? false}
            className="size-4 accent-emerald-800"
          />{' '}
          Prioritize on the homepage
        </label>
      </EditorSection>

      <EditorSection
        id="package-pricing"
        title="Pricing & duration"
        description="Set the trip days & nights, starting price, and optional Off-Season / Season tier rates."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Quick duration presets:</span>
          {durationPresets.map((preset) => {
            const active =
              Number(dayCount) === preset.days && Number(nightsCount) === preset.nights
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyDurationPreset(preset.days, preset.nights)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            label="Number of days"
            name="daysCount"
            value={dayCount}
            onChange={(event) => setDayCount(event.target.value)}
            required
            placeholder="e.g. 4"
          />
          <NumberField
            label="Number of nights"
            name="nightsCount"
            value={nightsCount}
            onChange={(event) => setNightsCount(event.target.value)}
            placeholder="e.g. 3"
          />
          <NumberField
            label="Starting price (₹)"
            name="price"
            value={startingPrice}
            onChange={(event) => setStartingPrice(event.target.value)}
            required
            placeholder="e.g. 18999"
          />
          <NumberField
            label="Regular price (₹)"
            name="originalPrice"
            defaultValue={originalPrice}
            placeholder="Optional"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <input
                type="checkbox"
                checked={tiersEnabled}
                onChange={(event) => setTiersEnabled(event.target.checked)}
                className="size-4 accent-emerald-800"
              />
              Enable Dynamic Pricing Tiers (Off-Season & Season)
            </label>
            {tiersEnabled && (
              <div className="flex flex-wrap items-center gap-2">
                {lowestTierPrice() !== undefined && (
                  <button
                    type="button"
                    onClick={() => setStartingPrice(String(lowestTierPrice()))}
                    className="rounded-md border border-emerald-700/30 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                  >
                    Sync starting price (₹{lowestTierPrice()?.toLocaleString('en-IN')})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setTiers(defaultTierRows())}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Reset Standard / Plus / Premium
                </button>
              </div>
            )}
          </div>

          {tiersEnabled && (
            <div className="space-y-4 pt-1">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid content-start gap-1 text-xs">
                  <span className="font-semibold text-slate-700">Pricing unit</span>
                  <select
                    value={perUnit}
                    onChange={(event) => setPerUnit(event.target.value)}
                    className={inputClass}
                  >
                    {!perUnitOptions.includes(perUnit as (typeof perUnitOptions)[number]) && (
                      <option value={perUnit}>{perUnit}</option>
                    )}
                    {perUnitOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid content-start gap-1 text-xs">
                  <span className="font-semibold text-slate-700">Minimum pax (optional)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minPax}
                    onChange={(event) => setMinPax(event.target.value)}
                    placeholder="e.g. 6"
                    className={inputClass}
                  />
                </label>

                <label className="grid content-start gap-1 text-xs">
                  <span className="font-semibold text-slate-700">Off-Season dates</span>
                  <input
                    type="text"
                    value={offSeasonDates}
                    onChange={(event) => setOffSeasonDates(event.target.value)}
                    placeholder="e.g. Jul 1 – Sep 30 & Jan – Mar"
                    className={inputClass}
                  />
                </label>

                <label className="grid content-start gap-1 text-xs">
                  <span className="font-semibold text-slate-700">Peak Season dates</span>
                  <input
                    type="text"
                    value={seasonDates}
                    onChange={(event) => setSeasonDates(event.target.value)}
                    placeholder="e.g. Apr 15 – Jun 30 & Dec 15 – Jan 5"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <div className="hidden sm:grid sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <span>Tier name</span>
                  <span>Off-Season Price (₹)</span>
                  <span>Season Price (₹)</span>
                  <span className="w-8" />
                </div>
                {tiers.map((tier, idx) => (
                  <div
                    key={tier.key}
                    className="grid gap-2.5 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center rounded-lg border border-slate-200 bg-white p-2.5 sm:p-2"
                  >
                    <input
                      type="text"
                      aria-label={`Tier ${idx + 1} name`}
                      value={tier.name}
                      onChange={(event) => updateTier(tier.key, { name: event.target.value })}
                      placeholder="Standard / Standard Plus / Premium"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`${tier.name || `Tier ${idx + 1}`} off-season price`}
                      value={tier.offSeasonPrice}
                      onChange={(event) =>
                        updateTier(tier.key, { offSeasonPrice: event.target.value })
                      }
                      placeholder="Off-Season ₹"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`${tier.name || `Tier ${idx + 1}`} season price`}
                      value={tier.seasonPrice}
                      onChange={(event) =>
                        updateTier(tier.key, { seasonPrice: event.target.value })
                      }
                      placeholder="Season ₹"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      disabled={tiers.length <= 1}
                      onClick={() =>
                        setTiers((current) => current.filter((item) => item.key !== tier.key))
                      }
                      aria-label={`Remove ${tier.name || `tier ${idx + 1}`}`}
                      className="grid size-8 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setTiers((current) => [
                    ...current,
                    { key: crypto.randomUUID(), name: '', offSeasonPrice: '', seasonPrice: '' },
                  ])
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                <Icon name="plus" size={14} /> Add pricing tier
              </button>
            </div>
          )}
        </div>
      </EditorSection>

      <EditorSection
        id="package-itinerary"
        title="Day-by-day planner"
        description="Dynamically add, reorder, remove, and edit Day 1..N with transfers, sightseeing spots, stays, meals, and seasonal alerts."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-emerald-900" aria-live="polite">
            {days.length} {days.length === 1 ? 'day' : 'days'} entered
            {Number(dayCount) > 0 ? ` of ${Number(dayCount)}` : ''}
          </p>
          {Number(dayCount) > 0 && days.length !== Number(dayCount) && (
            <button
              type="button"
              onClick={syncItineraryDays}
              className="rounded-lg border border-emerald-700/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
            >
              Sync planner to {Number(dayCount)} {Number(dayCount) === 1 ? 'day' : 'days'}
            </button>
          )}
        </div>

        {days.map(({ key, day }, index) => (
          <div key={key} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-900 px-2 py-0.5 text-xs font-bold text-white">
                  Day {index + 1}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  {day.title || `Itinerary Day ${index + 1}`}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveDay(index, -1)}
                  aria-label={`Move day ${index + 1} up`}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 disabled:opacity-35"
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={index === days.length - 1}
                  onClick={() => moveDay(index, 1)}
                  aria-label={`Move day ${index + 1} down`}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 disabled:opacity-35"
                >
                  Move down
                </button>
                <button
                  type="button"
                  disabled={days.length <= 1}
                  onClick={() => setDays((current) => current.filter((item) => item.key !== key))}
                  aria-label={`Remove day ${index + 1}`}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-35"
                >
                  Remove
                </button>
              </div>
            </div>

            <Field
              label={`Day ${index + 1} title`}
              name={`${key}-title`}
              defaultValue={day.title}
              placeholder="e.g. Arrival in Manali & Local Sightseeing"
              required
            />

            <TextArea
              label={`Day ${index + 1} plan description`}
              name={`${key}-description`}
              defaultValue={day.description}
              placeholder="e.g. Meet at pickup point, transfer to hotel, freshen up and explore Hadimba Temple & Mall Road."
              required
            />

            <Field
              label="Transfer note"
              name={`${key}-transfer`}
              defaultValue={day.transfer}
              placeholder="e.g. Overnight Semi-Sleeper Volvo / Private Cab from Chandigarh"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Hotel stay"
                name={`${key}-hotel`}
                defaultValue={day.hotel}
                placeholder="e.g. 3-Star Riverside Resort / Confirmed Category"
              />
              <Field
                label="Meals"
                name={`${key}-meals`}
                defaultValue={day.meals}
                placeholder="e.g. Breakfast & Dinner"
              />
              <Field
                label="Hotel location (optional)"
                name={`${key}-hotelLocation`}
                defaultValue={day.hotelLocation}
                placeholder="e.g. Old Manali"
              />
              <NumberField
                label="Hotel star rating (1–5, optional)"
                name={`${key}-hotelRating`}
                defaultValue={day.hotelRating}
                placeholder="e.g. 3"
              />
              <Field
                label="Start / pickup location (optional)"
                name={`${key}-start`}
                defaultValue={day.startLocation}
                placeholder="e.g. Delhi Majnu Ka Tila"
              />
              <Field
                label="End / drop-off location (optional)"
                name={`${key}-end`}
                defaultValue={day.endLocation}
                placeholder="e.g. Manali Hotel"
              />
            </div>

            <TextArea
              label="Sightseeing spots"
              name={`${key}-activities`}
              defaultValue={day.activities?.join('\n')}
              placeholder={'Hadimba Devi Temple\nVashisht Hot Springs\nMall Road'}
              hint="Enter one sightseeing spot per line."
            />

            <TextArea
              label="Seasonal note (optional)"
              name={`${key}-seasonalNote`}
              defaultValue={day.seasonalNote}
              placeholder="e.g. Jan 10 to Mar 15: Atal Tunnel & Sissu access subject to snow clearance."
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => setDays((current) => [...current, newDay(current.length + 1)])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
        >
          <Icon name="plus" size={16} /> Add itinerary day
        </button>
      </EditorSection>

      <EditorSection
        id="package-inclusions"
        title="Inclusions, exclusions & policies"
        description="List one item per line so travelers clearly see what is included, excluded, recommended to pack, and cancellation terms."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextArea
            label="Included in the price"
            name="inclusions"
            defaultValue={pkg?.inclusions.join('\n')}
            placeholder={'Accommodation on twin/double sharing\nDaily breakfast & dinner\nPrivate sightseeing transfers'}
          />
          <TextArea
            label="Paid separately (Exclusions)"
            name="exclusions"
            defaultValue={pkg?.exclusions.join('\n')}
            placeholder={'Flight or train tickets\nRohtang Pass permit & adventure sports\nPersonal expenses'}
          />
          <TextArea
            label="Things to carry"
            name="thingsToCarry"
            defaultValue={pkg?.thingsToCarry?.join('\n')}
            placeholder={'Original Govt Photo ID\nWarm thermals & waterproof jacket\nComfortable trekking shoes'}
          />
          <TextArea
            label="Cancellation policy"
            name="cancellationPolicy"
            defaultValue={pkg?.cancellationPolicy?.join('\n')}
            placeholder={'30+ days before departure: 15% retention\n15–29 days before departure: 50% retention\nUnder 15 days: Non-refundable'}
          />
        </div>
      </EditorSection>

      <EditorSection
        id="package-photos"
        title="Location gallery photos"
        description="Upload a cover image and curated location photos shown in the Package Detail photo mosaic."
      >
        <ImageDropzone
          value={image}
          onChange={setImage}
          onUploadingChange={setUploading}
          label="Cover photo *"
        />
        <GalleryEditor
          cover={image}
          value={gallery}
          onChange={setGallery}
          onBusyChange={setGalleryBusy}
          starterPhoto={getStarterPackagePhoto(id)}
        />
      </EditorSection>

      <GoogleReviewSection
        googleRating={pkg?.googleRating}
        googleReviewsCount={pkg?.googleReviewsCount}
        googleMapsUrl={pkg?.googleMapsUrl}
      />
    </InventoryEditor>
  )
}
