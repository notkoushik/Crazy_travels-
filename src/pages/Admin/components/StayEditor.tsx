import { useState } from 'react'
import { ImageDropzone, validateCoverPhoto } from '../../../components/ImageDropzone'
import { stayTypes } from '../../../data/travelData'
import type { StayItem } from '../../../types/travel'
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

const sections = [
  ['stay-property', 'Property details'],
  ['stay-rates', 'Nightly rate'],
  ['stay-guest-info', 'Guest information'],
  ['stay-photos', 'Cover photo'],
  ['google-reviews', 'Google Maps reviews'],
] as const

export function StayEditor({
  stay,
  onBack,
  onSave,
}: {
  stay?: StayItem
  onBack: () => void
  onSave: (stay: StayItem) => Promise<void>
}) {
  const [id] = useState(() => stay?.id ?? `stay-${crypto.randomUUID()}`)
  const [image, setImage] = useState(stay?.image ?? '')
  const [uploading, setUploading] = useState(false)

  const save = async (form: FormData) => {
    const priceNum = requiredNumber(form, 'price', 'Price per night', 1)
    const rating = numberValue(form, 'rating', 'Internal score', 1, 5)

    await onSave({
      ...stay,
      id,
      name: requiredText(form, 'name', 'Property name'),
      type: requiredText(form, 'type', 'Property type'),
      city: requiredText(form, 'city', 'City'),
      state: requiredText(form, 'state', 'State'),
      priceNum,
      price: rupees(priceNum),
      rating: rating ?? 0,
      image: await validateCoverPhoto(image, stay?.image),
      description: stay
        ? textValue(form, 'description')
        : requiredText(form, 'description', 'Guest description'),
      amenities: lineValues(form, 'amenities'),
      ...googleReviews(form),
    })
  }

  return (
    <InventoryEditor
      title={stay ? 'Edit hotel or stay' : 'Add new hotel'}
      listLabel="Stays & hotels"
      description="List a hotel, haveli, resort, or other property with its starting nightly rate and the details guests need."
      saveLabel="Save hotel"
      sections={sections}
      onBack={onBack}
      onSave={save}
      uploading={uploading}
    >
      <EditorSection id="stay-property" title="Property details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Property name"
            name="name"
            defaultValue={stay?.name}
            required
            maxLength={255}
            placeholder="e.g. Lakeview Heritage Haveli"
          />
          <SelectField label="Property type" name="type" value={stay?.type} options={stayTypes} required />
          <Field
            label="City"
            name="city"
            defaultValue={stay?.city}
            required
            maxLength={120}
            placeholder="e.g. Udaipur"
          />
          <Field
            label="State"
            name="state"
            defaultValue={stay?.state}
            required
            maxLength={120}
            placeholder="e.g. Rajasthan"
          />
        </div>
      </EditorSection>
      <EditorSection id="stay-rates" title="Nightly rate">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Price per night (₹)"
            name="price"
            defaultValue={stay?.priceNum}
            required
            placeholder="e.g. 14500"
            hint="Starting rate for one room, in whole rupees."
          />
          <NumberField
            label="Internal score"
            name="rating"
            defaultValue={stay?.rating || undefined}
            decimal
            placeholder="e.g. 4.8"
            hint="Optional score from 1 to 5 for your team."
          />
        </div>
      </EditorSection>
      <EditorSection id="stay-guest-info" title="Guest information">
        <TextArea
          label="Guest description"
          name="description"
          rows={5}
          defaultValue={stay?.description}
          required={!stay}
          hint="Describe the room covered by the rate, standard occupancy, and any important check-in, meal, tax, or cancellation terms."
        />
        <TextArea
          label="Amenities"
          name="amenities"
          defaultValue={stay?.amenities.join('\n')}
          placeholder={'Wi-Fi\nBreakfast available\nAirport pickup on request'}
          hint="Enter one facility or service per line. Specify when it costs extra."
        />
      </EditorSection>
      <EditorSection id="stay-photos" title="Cover photo">
        <ImageDropzone
          value={image}
          onChange={setImage}
          onUploadingChange={setUploading}
          label="Property photo *"
        />
      </EditorSection>
      <GoogleReviewSection
        googleRating={stay?.googleRating}
        googleReviewsCount={stay?.googleReviewsCount}
        googleMapsUrl={stay?.googleMapsUrl}
      />
    </InventoryEditor>
  )
}
