import { useRef, useState } from 'react'
import { ImageDropzone } from '../../../components/ImageDropzone'
import type { DestinationItem } from '../../../types/travel'
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
  ['destination-photos', 'Photos'],
  ['google-reviews', 'Google Maps reviews'],
] as const

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
  const [permitRequired, setPermitRequired] = useState(destination?.permitRequired ?? false)

  const save = async (form: FormData) => {
    const city = requiredText(form, 'city', 'City or destination')
    const priceNum = requiredNumber(form, 'price', 'Starting price', 1)
    if (!image.trim()) throw new Error('Add a cover photo before saving the destination.')

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
      image: image.trim(),
      season: textValue(form, 'season'),
      duration: requiredText(form, 'duration', 'Suggested trip length'),
      tagline: textValue(form, 'tagline'),
      description: destination
        ? textValue(form, 'description')
        : requiredText(form, 'description', 'Destination overview'),
      highlights: lineValues(form, 'highlights'),
      gallery: lineValues(form, 'gallery'),
      bestTimeToVisit: textValue(form, 'bestTimeToVisit'),
      idealFor: textValue(form, 'idealFor'),
      isTrending: form.has('isTrending'),
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
      uploading={uploading}
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
          <label className="flex items-center gap-2 self-start py-2 text-sm text-slate-700">
            <input
              name="isTrending"
              type="checkbox"
              defaultChecked={destination?.isTrending ?? true}
              className="size-4 accent-emerald-800"
            />{' '}
            Show on the homepage
          </label>
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
      <EditorSection id="destination-photos" title="Photos">
        <ImageDropzone
          value={image}
          onChange={setImage}
          onUploadingChange={setUploading}
          label="Cover photo *"
        />
        <TextArea
          label="Gallery image URLs"
          name="gallery"
          defaultValue={destination?.gallery.join('\n')}
          hint="Enter one image URL per line."
        />
      </EditorSection>
      <GoogleReviewSection
        googleRating={destination?.googleRating}
        googleReviewsCount={destination?.googleReviewsCount}
        googleMapsUrl={destination?.googleMapsUrl}
      />
    </InventoryEditor>
  )
}
