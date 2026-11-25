import { catalogPhotoUrls } from '../data/catalogPhotos'
import { formatPrice } from '../data/travelData'
import { travellerGroups, type Currency, type DestinationItem, type IconName, type PackageItem, type TravellerGroup } from '../types/travel'
import { CatalogPhotoCarousel } from './CatalogPhotoCarousel'
import { Icon } from './Icon'

const customTrips: Record<TravellerGroup, {
  title: string
  description: string
  preferences: [IconName, string][]
}> = {
  Couples: {
    title: 'A getaway for two',
    description: 'Leave room for slow mornings, time together and a stay you both love.',
    preferences: [['bed', 'Stay style'], ['calendar', 'Travel dates'], ['compass', 'Experiences']],
  },
  Families: {
    title: 'A holiday for the whole family',
    description: 'Plan around school holidays, shorter travel days and the ages in your family.',
    preferences: [['hotel', 'Family stays'], ['car', 'Transfers'], ['clock', 'Daily pace']],
  },
  'Friends & bachelors': {
    title: 'A trip with your friends',
    description: 'Bring the group together around shared adventures, downtime and a budget that works for everyone.',
    preferences: [['car', 'Transport'], ['bed', 'Stay style'], ['compass', 'Activities']],
  },
}

function visitsDestination(pkg: PackageItem, destination: DestinationItem) {
  if (pkg.destinationSlug) return pkg.destinationSlug === destination.slug
  const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
  const city = normalize(destination.city)
  const stops = [pkg.place, ...pkg.itinerary.flatMap((day) => [day.startLocation, day.endLocation, day.title])]
  return !!city && stops.some((stop) => stop && ` ${normalize(stop)} `.includes(` ${city} `))
}

function audience(pkg: PackageItem) {
  if (pkg.travellerGroup) return pkg.travellerGroup
  if (pkg.theme === 'Honeymoon') return 'Couples'
  if (pkg.theme === 'Family') return 'Families'
  return undefined
}

const inclusionTypes: [RegExp, IconName, string][] = [
  [/\b(airfare|flights?)\b/i, 'flight', 'Flights'],
  [/\b(stays?|hotels?|accommodation|lodging)\b/i, 'hotel', 'Stays'],
  [/\b(transfers?|chauffeur|transport|vehicle|suv|innova)\b/i, 'car', 'Transport'],
  [/\b(breakfast|lunch|dinner|meals?)\b/i, 'meals', 'Meals'],
  [/\bsightseeing\b/i, 'compass', 'Sightseeing'],
]

function PackageCard({ destination, currency, group, pkg }: {
  destination: DestinationItem
  currency: Currency
  group?: TravellerGroup
  pkg?: PackageItem
}) {
  const custom = group ? customTrips[group] : undefined
  const title = pkg?.title ?? custom!.title
  const photos = catalogPhotoUrls(pkg?.image || destination.image, pkg?.gallery ?? (pkg ? [] : destination.gallery))
  // Give each custom itinerary a different opening view from the destination's own gallery.
  const first = !pkg && group && photos.length ? travellerGroups.indexOf(group) % photos.length : 0
  const ordered = [...photos.slice(first), ...photos.slice(0, first)]
  const stops = [...new Set(pkg?.itinerary.flatMap((day) => [day.startLocation, day.endLocation]).filter(Boolean))]
  const features: [IconName, string][] = pkg ? inclusionTypes
    .filter(([pattern]) => pkg.inclusions.some((item) => pattern.test(item) && !/\b(optional|extra|excluded|not included)\b/i.test(item)))
    .map(([, icon, label]) => [icon, label]) : custom!.preferences
  const regularPrice = Number(pkg?.originalPrice?.replace(/[^\d.]/g, ''))
  const discounted = !!pkg && regularPrice > pkg.priceNum
  const href = pkg ? `#/package/${pkg.id}` : `#/custom-trip/${encodeURIComponent(destination.slug)}?group=${encodeURIComponent(group!)}`

  return (
    <article className="destination-package-card">
      <CatalogPhotoCarousel title={title} cover={ordered[0] || ''} gallery={ordered.slice(1)} card
        className="destination-package-gallery" frameClassName="aspect-[2/1]">
        <span className="destination-group-label">{group ?? 'All travellers'}</span>
      </CatalogPhotoCarousel>
      <div className="destination-package-tags">
        <span>{pkg?.duration || 'Flexible dates'}</span>
        <span>{pkg?.theme || 'Custom itinerary'}</span>
        {pkg && pkg.rating > 0 && pkg.reviewCount > 0 && (
          <small aria-label={`${pkg.rating} out of 5 from ${pkg.reviewCount} reviews`}>
            <Icon name="star" size={14} /> {pkg.rating} ({pkg.reviewCount})
          </small>
        )}
      </div>
      <h3><a href={href}>{title}</a></h3>
      <p className="destination-package-route">{pkg ? stops.join(' · ') || pkg.place : custom!.description}</p>
      {features.length > 0 && (
        <ul className="destination-package-features" aria-label={pkg ? 'Package inclusions' : 'Preferences to customise'}>
          {features.map(([icon, label]) => <li key={label}><Icon name={icon} size={21} />{label}</li>)}
        </ul>
      )}
      <div className="destination-package-rate">
        <div>
          {discounted && <div className="destination-package-offer"><s>{formatPrice(regularPrice, currency)}</s>{pkg.discount && <span>{pkg.discount}</span>}</div>}
          {pkg ? <><strong>{formatPrice(pkg.priceNum, currency)}</strong><small>Starting price per traveller</small></>
            : <><strong>Tailored quote</strong><small>For your group</small></>}
        </div>
        <a href={href} aria-label={`${pkg ? 'View package' : 'Plan a trip'} – ${title} in ${destination.city}`}>
          {pkg ? 'View package' : 'Plan trip'} <Icon name="arrow" size={15} />
        </a>
      </div>
    </article>
  )
}

export function DestinationPackages({ destination, packages, currency }: {
  destination: DestinationItem
  packages: PackageItem[]
  currency: Currency
}) {
  const matches = packages.filter((pkg) => visitsDestination(pkg, destination))
  const firstByGroup = travellerGroups.map((group) => matches.find((pkg) => audience(pkg) === group))

  return (
    <section id="destination-packages" className="shell mb-16 scroll-mt-40" aria-labelledby="destination-packages-title">
      <h2 id="destination-packages-title" className="destination-packages-title">{destination.city} trip packages</h2>
      <div className="destination-package-grid">
        {travellerGroups.map((group, i) => <PackageCard key={firstByGroup[i]?.id ?? group}
          group={group} pkg={firstByGroup[i]} destination={destination} currency={currency} />)}
        {matches.filter((pkg) => !firstByGroup.includes(pkg)).map((pkg) => <PackageCard
          key={pkg.id} group={audience(pkg)} pkg={pkg} destination={destination} currency={currency} />)}
      </div>
    </section>
  )
}
