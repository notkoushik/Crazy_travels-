import { useRef, useState } from 'react'
import { Icon } from '../../../components/Icon'
import { ImageDropzone, validateCoverPhoto } from '../../../components/ImageDropzone'
import { catalogPhotoUrls, getStarterPackagePhoto } from '../../../data/catalogPhotos'
import { travellerGroups, type DestinationItem, type ItineraryDay, type PackageItem } from '../../../types/travel'
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
const sections = [
  ['package-details', 'Tour details'],
  ['package-pricing', 'Pricing & duration'],
  ['package-itinerary', 'Day-by-day itinerary'],
  ['package-inclusions', 'Inclusions & exclusions'],
  ['package-photos', 'Photos'],
  ['google-reviews', 'Google Maps reviews'],
] as const

const newDay = () => ({
  key: crypto.randomUUID(),
  day: { day: 1, title: '', description: '' } as ItineraryDay,
})

export function PackageEditor({
  pkg,
  destinations,
  onBack,
  onSave,
}: {
  pkg?: PackageItem
  destinations: DestinationItem[]
  onBack: () => void
  onSave: (pkg: PackageItem) => Promise<void>
}) {
  const [id] = useState(() => pkg?.id ?? `pkg-${crypto.randomUUID()}`)
  const [image, setImage] = useState(pkg?.image ?? '')
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState(() => catalogPhotoUrls(image, pkg?.gallery).slice(image.trim() ? 1 : 0))
  const [galleryBusy, setGalleryBusy] = useState(false)
  const [days, setDays] = useState(() =>
    pkg ? pkg.itinerary.map((day) => ({ key: crypto.randomUUID(), day })) : [newDay()]
  )
  const initialDays = useRef(days)
  const [dayCount, setDayCount] = useState(pkg?.daysCount?.toString() ?? '')
  const oldNights = pkg?.duration?.match(/(\d+)\s*nights?/i)?.[1]
  const originalPriceText = pkg?.originalPrice?.replace(/[₹,\s]/g, '') ?? ''
  const originalPrice = /^\d+$/.test(originalPriceText) ? originalPriceText : ''

  const save = async (form: FormData) => {
    const daysCount = requiredNumber(form, 'daysCount', 'Number of days', 1)
    const nights = numberValue(form, 'nights', 'Number of nights', 0, daysCount)
    const rate = requiredNumber(form, 'price', 'Starting price', 1)
    const compareAt = numberValue(form, 'originalPrice', 'Regular price', 1)
    if (compareAt !== undefined && compareAt <= rate)
      throw new Error('Regular price must be higher than the starting price.')

    const itineraryChanged = !pkg || daysCount !== pkg.daysCount || days !== initialDays.current
    if (itineraryChanged && days.length !== daysCount) {
      throw new Error(
        `The itinerary needs ${daysCount} ${daysCount === 1 ? 'day' : 'days'} to match the trip duration.`
      )
    }

    const itinerary = days.map(({ key, day }, index): ItineraryDay => ({
      ...day,
      day: itineraryChanged ? index + 1 : day.day,
      title: requiredText(form, `${key}-title`, `Day ${index + 1} title`),
      description: requiredText(form, `${key}-description`, `Day ${index + 1} plan`),
      startLocation: textValue(form, `${key}-start`),
      endLocation: textValue(form, `${key}-end`),
      hotel: textValue(form, `${key}-hotel`),
      meals: textValue(form, `${key}-meals`),
      activities: lineValues(form, `${key}-activities`),
    }))

    const duration =
      pkg && daysCount === pkg.daysCount && nights?.toString() === oldNights
        ? pkg.duration
        : `${daysCount} ${daysCount === 1 ? 'day' : 'days'}${nights ? ` / ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}`
    const discount = compareAt && compareAt > rate ? Math.floor(((compareAt - rate) / compareAt) * 100) : 0

    await onSave({
      ...pkg,
      id,
      title: requiredText(form, 'title', 'Package title'),
      place: requiredText(form, 'place', 'Destination or route'),
      state: requiredText(form, 'state', 'State or region'),
      theme: requiredText(form, 'theme', 'Travel theme') as PackageItem['theme'],
      travellerGroup: travellerGroups.find((group) => group === form.get('travellerGroup')),
      destinationSlug: textValue(form, 'destinationSlug'),
      duration,
      daysCount,
      priceNum: rate,
      price: rupees(rate),
      originalPrice: compareAt ? rupees(compareAt) : '',
      discount: discount ? `${discount}% OFF` : '',
      featured: form.has('featured'),
      rating: pkg?.rating ?? 0,
      reviewCount: pkg?.reviewCount ?? 0,
      image: await validateCoverPhoto(image, pkg?.image),
      gallery,
      overview: pkg ? textValue(form, 'overview') : requiredText(form, 'overview', 'Trip overview'),
      highlights: lineValues(form, 'highlights'),
      inclusions: lineValues(form, 'inclusions'),
      exclusions: lineValues(form, 'exclusions'),
      itinerary,
      ...googleReviews(form),
    })
  }

  return (
    <InventoryEditor
      title={pkg ? 'Edit tour package' : 'Add new package'}
      listLabel="Tour packages"
      description="Build the listing customers will see, including the per-person rate and what happens each day."
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
          placeholder="e.g. Jaipur to Udaipur Heritage Tour"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Destination or route"
            name="place"
            defaultValue={pkg?.place}
            required
            maxLength={120}
            placeholder="e.g. Jaipur, Jodhpur, Udaipur"
          />
          <Field
            label="State or region"
            name="state"
            defaultValue={pkg?.state}
            required
            maxLength={120}
            placeholder="e.g. Rajasthan"
          />
          <SelectField label="Travel theme" name="theme" value={pkg?.theme} required options={themes} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Destination page" name="destinationSlug" value={pkg?.destinationSlug}
            placeholder="Match by itinerary" options={destinations.map((d) => ({ value: d.slug, label: d.city }))} />
          <SelectField label="Traveller group" name="travellerGroup" value={pkg?.travellerGroup}
            placeholder="Use package theme" options={travellerGroups} />
        </div>
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
          placeholder={'Guided walk through Jaipur’s old city\nSunset boat ride on Lake Pichola'}
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
        description="Use whole rupees and enter the price per traveller. Add a regular price only when it is a genuine comparison."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Starting price per traveller (₹)"
            name="price"
            defaultValue={pkg?.priceNum}
            required
            placeholder="e.g. 38000"
          />
          <NumberField
            label="Regular price per traveller (₹)"
            name="originalPrice"
            defaultValue={originalPrice}
            placeholder="Optional"
          />
          <NumberField
            label="Number of days"
            name="daysCount"
            value={dayCount}
            onChange={(event) => setDayCount(event.target.value)}
            required
            placeholder="e.g. 6"
          />
          <NumberField label="Number of nights" name="nights" defaultValue={oldNights} placeholder="e.g. 5" />
        </div>
      </EditorSection>
      <EditorSection
        id="package-itinerary"
        title="Day-by-day itinerary"
        description="Add a plan for every day, including pickup and drop-off locations, overnight stays, and meals when applicable."
      >
        <p className="text-sm font-medium text-emerald-900" aria-live="polite">
          {days.length} {days.length === 1 ? 'day' : 'days'} entered
          {Number(dayCount) > 0 ? ` of ${Number(dayCount)}` : ''}
        </p>
        {days.map(({ key, day }, index) => (
          <div key={key} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Day {index + 1}</h3>
              <button
                type="button"
                onClick={() => setDays((current) => current.filter((item) => item.key !== key))}
                aria-label={`Remove day ${index + 1}`}
                className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <Field
              label={`Day ${index + 1} title`}
              name={`${key}-title`}
              defaultValue={day.title}
              placeholder="e.g. Arrival in Jaipur"
              required
            />
            <TextArea
              label={`Day ${index + 1} plan`}
              name={`${key}-description`}
              defaultValue={day.description}
              placeholder="e.g. Meet at the airport, transfer to the hotel, then visit the old city in the afternoon."
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Start or pickup location"
                name={`${key}-start`}
                defaultValue={day.startLocation}
                placeholder="e.g. Jaipur Airport arrivals hall"
              />
              <Field
                label="End or drop-off location"
                name={`${key}-end`}
                defaultValue={day.endLocation}
                placeholder="e.g. Hotel in Jaipur city centre"
              />
              <Field
                label="Overnight accommodation"
                name={`${key}-hotel`}
                defaultValue={day.hotel}
                placeholder="Hotel name or confirmed category"
              />
              <Field
                label="Included meals"
                name={`${key}-meals`}
                defaultValue={day.meals}
                placeholder="e.g. Breakfast and dinner"
              />
            </div>
            <TextArea
              label="Activities and transfers"
              name={`${key}-activities`}
              defaultValue={day.activities?.join('\n')}
              hint="One per line. Mark optional activities or extra charges explicitly."
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setDays((current) => [...current, newDay()])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
        >
          <Icon name="plus" size={16} /> Add itinerary day
        </button>
      </EditorSection>
      <EditorSection
        id="package-inclusions"
        title="Inclusions & exclusions"
        description="List one item per line. Name any mandatory costs, taxes, meals, transport, and entry fees so customers can see what the advertised rate covers."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextArea
            label="Included in the price"
            name="inclusions"
            defaultValue={pkg?.inclusions.join('\n')}
            placeholder={'Twin-share accommodation\nAirport pickup on arrival'}
          />
          <TextArea
            label="Paid separately"
            name="exclusions"
            defaultValue={pkg?.exclusions.join('\n')}
            placeholder={'Flights\nOptional excursions'}
          />
        </div>
      </EditorSection>
      <EditorSection id="package-photos" title="Photos">
        <ImageDropzone
          value={image}
          onChange={setImage}
          onUploadingChange={setUploading}
          label="Cover photo *"
        />
        <GalleryEditor cover={image} value={gallery} onChange={setGallery} onBusyChange={setGalleryBusy} starterPhoto={getStarterPackagePhoto(id)} />
      </EditorSection>
      <GoogleReviewSection
        googleRating={pkg?.googleRating}
        googleReviewsCount={pkg?.googleReviewsCount}
        googleMapsUrl={pkg?.googleMapsUrl}
      />
    </InventoryEditor>
  )
}
