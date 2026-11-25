import React, { useEffect, useState } from 'react'
import { CatalogPhoto } from './CatalogPhoto'
import { Icon } from './Icon'
import { formatPrice } from '../data/travelData'
import type { Currency, DestinationItem, PackageCategory, PackageItem } from '../types/travel'

const DESTINATION_ALIASES: Record<string, string[]> = {
  himachal: ['himachal', 'manali', 'shimla', 'kasol', 'kullu', 'himachal pradesh'],
  manali: ['himachal', 'manali', 'shimla', 'kasol', 'kullu', 'himachal pradesh'],
  srinagar: ['srinagar', 'kashmir', 'jammu & kashmir', 'gulmarg', 'pahalgam'],
  kashmir: ['srinagar', 'kashmir', 'jammu & kashmir', 'gulmarg', 'pahalgam'],
  munnar: ['munnar', 'kerala', 'alleppey', 'thekkady', 'kochi'],
  kerala: ['munnar', 'kerala', 'alleppey', 'thekkady', 'kochi'],
  udaipur: ['udaipur', 'rajasthan', 'jaipur', 'jodhpur', 'jaisalmer'],
  rajasthan: ['udaipur', 'rajasthan', 'jaipur', 'jodhpur', 'jaisalmer'],
  gangtok: ['gangtok', 'sikkim', 'darjeeling'],
  sikkim: ['gangtok', 'sikkim', 'darjeeling'],
  andaman: ['andaman', 'andaman islands', 'andaman & nicobar islands', 'port blair', 'havelock'],
  hampi: ['hampi', 'karnataka'],
  ladakh: ['ladakh', 'leh'],
}

export function getPackageCategory(pkg: PackageItem): PackageCategory {
  if (pkg.category) return pkg.category
  if (pkg.theme === 'Honeymoon') return 'Couple'
  if (pkg.theme === 'Adventure') return 'Adventure'
  return 'Family'
}

export function getPackageDurationChip(pkg: PackageItem): string {
  const days = Number(pkg.daysCount) || 0
  const nights = pkg.nightsCount != null ? Number(pkg.nightsCount) : Math.max(0, days - 1)
  if (days > 0 && nights >= 0) {
    return `${days}D/${nights}N`
  }
  const match = pkg.duration?.match(/(\d+)\s*D(?:ays?)?\s*\/\s*(\d+)\s*N/i)
  if (match) return `${match[1]}D/${match[2]}N`
  return pkg.duration || 'Custom'
}

export function doesPackageMatchDestination(pkg: PackageItem, dest: DestinationItem): boolean {
  const destSlug = dest.slug.toLowerCase().trim()
  const aliases = DESTINATION_ALIASES[destSlug] ?? [destSlug, dest.city.toLowerCase().trim()]
  const pkgSlug = pkg.destinationSlug?.toLowerCase().trim()
  if (pkgSlug) {
    return pkgSlug === destSlug || aliases.includes(pkgSlug)
  }
  const fields = [pkg.place, pkg.state, pkg.title]
    .filter(Boolean)
    .map((v) => v.toLowerCase())
  const destTokens = [dest.city, dest.state, dest.country, ...aliases]
    .filter(Boolean)
    .map((v) => v.toLowerCase())
  return fields.some((field) =>
    destTokens.some((token) => token.length > 2 && (field.includes(token) || token.includes(field))),
  )
}

export function getPackageLowestPrice(pkg: PackageItem): { amount: number; perUnit: string } {
  const tiers = pkg.pricingTiers?.tiers ?? []
  const validTierPrices = tiers
    .flatMap((t) => [t.offSeasonPrice, t.seasonPrice])
    .filter((p) => typeof p === 'number' && p > 0)
  const amount = validTierPrices.length > 0 ? Math.min(...validTierPrices) : pkg.priceNum
  const perUnit = pkg.pricingTiers?.perUnit || (getPackageCategory(pkg) === 'Couple' ? 'Per Couple' : 'Per Person')
  return { amount, perUnit }
}

interface CategoryMeta {
  category: PackageCategory
  badge: string
  title: string
  subtitle: string
  defaultImages: readonly string[]
  icon: React.ReactNode
}

const CATEGORY_CARDS: readonly CategoryMeta[] = [
  {
    category: 'Couple',
    badge: 'COUPLE ESCAPES',
    title: 'Couple',
    subtitle: 'Romantic stays, private transfers & scenic moments for two.',
    defaultImages: [
      '/catalog-photos/groups/couple.jpg',
      '/catalog-photos/groups/Couple_3.jpg',
      '/catalog-photos/groups/Couple_4.jpg',
      '/catalog-photos/groups/Couple_2.jpg',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#e2553f] shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    category: 'Family',
    badge: 'FAMILY HOLIDAYS',
    title: 'Family',
    subtitle: 'Comfortable pacing, curated hotels & memories for every age.',
    defaultImages: [
      '/catalog-photos/groups/Family_2.jpg',
      '/catalog-photos/groups/Family.jpg',
      '/catalog-photos/groups/Family_4.jpg',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#b85032] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M22 21v-2a3.5 3.5 0 0 0-3-3.4" />
        <circle cx="17" cy="8.5" r="2.5" />
      </svg>
    ),
  },
  {
    category: 'Bachelors',
    badge: "BACHELORS' TRIPS",
    title: 'Bachelors',
    subtitle: 'High-energy routes, mountain cafés & squad-friendly stays.',
    defaultImages: [
      '/catalog-photos/groups/Friends_3.jpg',
      '/catalog-photos/groups/Frineds.jpg',
      '/catalog-photos/groups/Friends_4.jpg',
      '/catalog-photos/groups/frineds_2.jpg',
      '/catalog-photos/groups/Friends_5.jpg',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#b85032] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    category: 'Adventure',
    badge: 'ADVENTURE PICKS',
    title: 'Adventure',
    subtitle: 'High passes, treks & thrilling expeditions.',
    defaultImages: [
      '/catalog-photos/tsomgo-lake.jpg',
      '/Video/optimized/destination_ladakh_poster.jpg',
      '/Video/optimized/destination_adventure_poster.jpg',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#b85032] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
]

function CategoryCardTile({
  meta,
  images,
  packageCount,
  durations,
  variant,
  isSelected,
  staggerOffsetMs,
  onClick,
}: {
  meta: CategoryMeta
  images: readonly string[]
  packageCount: number
  durations: string[]
  variant: 'tall' | 'compact'
  isSelected: boolean
  staggerOffsetMs: number
  onClick: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = images.length

  useEffect(() => {
    if (slideCount < 2 || isPaused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let intervalId: number | undefined
    const delayTimer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
      intervalId = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % slideCount)
      }, 4600)
    }, 3400 + staggerOffsetMs)

    return () => {
      window.clearTimeout(delayTimer)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [slideCount, isPaused, staggerOffsetMs])

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Filter ${meta.title} packages (${packageCount} available)`}
      className={`custom-group-card ${variant} ${isSelected ? 'ring-3 ring-[#ef4934] ring-offset-4 ring-offset-[#fbfaf7]' : ''}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="custom-group-slides" aria-hidden="true">
        {images.map((src, idx) => (
          <CatalogPhoto
            key={`${meta.category}-${src}-${idx}`}
            src={src}
            alt={idx === 0 ? meta.title : ''}
            loading="lazy"
            className={`custom-group-slide ${idx === activeIndex ? 'is-active' : ''}`}
          />
        ))}
      </div>

      <div className="custom-group-scrim" aria-hidden="true" />

      <div className="custom-group-top">
        <span className="custom-group-pill">
          {meta.icon}
          <span>{meta.badge}</span>
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          {packageCount > 0 ? `${packageCount} ${packageCount === 1 ? 'package' : 'packages'}` : 'Custom'}
        </span>
      </div>

      <div className="custom-group-footer">
        <div className="custom-group-copy">
          <h3>{meta.title}</h3>
          <p>{meta.subtitle}</p>
          {durations.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {durations.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 text-[10.5px] font-bold text-white backdrop-blur-xs"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="custom-group-arrow" aria-hidden="true">
          <Icon name="arrow" size={16} />
        </span>
      </div>
    </article>
  )
}

interface PackageCategoryCardsProps {
  destination: DestinationItem
  packages: PackageItem[]
  currency: Currency
  onOpenPackage: (packageId: string) => void
  onPlanCustom: (category?: PackageCategory) => void
}

export function PackageCategoryCards({
  destination,
  packages,
  currency,
  onOpenPackage,
  onPlanCustom,
}: PackageCategoryCardsProps) {
  const destinationPackages = packages.filter((pkg) => doesPackageMatchDestination(pkg, destination))
  const hasAdventurePackages = destinationPackages.some((pkg) => getPackageCategory(pkg) === 'Adventure')
  const showAdventure = Boolean(destination.adventureEnabled) || hasAdventurePackages

  const visibleCategories = CATEGORY_CARDS.filter(
    (card) => card.category !== 'Adventure' || showAdventure,
  )

  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'All'>('All')
  const [selectedDuration, setSelectedDuration] = useState<string>('All')

  // Reset filters when switching destinations
  useEffect(() => {
    setSelectedCategory('All')
    setSelectedDuration('All')
  }, [destination.slug])

  const categoryFiltered =
    selectedCategory === 'All'
      ? destinationPackages
      : destinationPackages.filter((pkg) => getPackageCategory(pkg) === selectedCategory)

  const availableDurations = Array.from(
    new Set(categoryFiltered.map(getPackageDurationChip)),
  ).sort()

  const displayedPackages =
    selectedDuration === 'All'
      ? categoryFiltered
      : categoryFiltered.filter((pkg) => getPackageDurationChip(pkg) === selectedDuration)

  const handleCategorySelect = (category: PackageCategory) => {
    setSelectedCategory(category)
    setSelectedDuration('All')
    document.getElementById('destination-packages-results')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  return (
    <section className="customization-showcase scroll-mt-24 mb-16" id="packages" aria-labelledby="dest-category-heading">
      <div className="customization-topo-bg" aria-hidden="true" />
      <div className="shell section">
        <div className="customization-header">
          <div>
            <div className="customization-kicker-row">
              <span>TAILORED FOR {destination.city.toUpperCase()}</span>
              <span className="customization-kicker-line" aria-hidden="true" />
            </div>
            <h2 id="dest-category-heading" className="customization-title">
              Explore Packages by{' '}
              <span className="customization-title-accent">
                Category
                <svg
                  className="customization-brush-underline"
                  viewBox="0 0 240 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9.5C64 2.8 172 1.8 237 7.2"
                    stroke="#eab992"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="customization-subtitle">
              Choose your travel group style for {destination.city}, then pick your ideal duration chip to inspect day-by-day itineraries and pricing.
            </p>
          </div>
          <button
            type="button"
            className="customization-cta-pill"
            onClick={() => onPlanCustom(selectedCategory === 'All' ? undefined : selectedCategory)}
          >
            <span>Customize {destination.city} Trip</span>
            <Icon name="arrow" size={16} />
          </button>
        </div>

        {/* Category Bento Cards matching HomePage aesthetic */}
        {visibleCategories.length === 4 ? (
          <div className="customization-bento">
            {visibleCategories.slice(0, 2).map((meta, idx) => {
              const catPkgs = destinationPackages.filter((pkg) => getPackageCategory(pkg) === meta.category)
              const pkgImages = catPkgs.map((p) => p.image).filter(Boolean)
              const cardImages = pkgImages.length > 0 ? [...new Set([...pkgImages, ...meta.defaultImages])].slice(0, 4) : meta.defaultImages
              const durations = Array.from(new Set(catPkgs.map(getPackageDurationChip))).sort()
              return (
                <CategoryCardTile
                  key={meta.category}
                  meta={meta}
                  images={cardImages}
                  packageCount={catPkgs.length}
                  durations={durations}
                  variant="tall"
                  isSelected={selectedCategory === meta.category}
                  staggerOffsetMs={idx * 1000}
                  onClick={() => handleCategorySelect(meta.category)}
                />
              )
            })}
            <div className="customization-stack">
              {visibleCategories.slice(2, 4).map((meta, idx) => {
                const catPkgs = destinationPackages.filter((pkg) => getPackageCategory(pkg) === meta.category)
                const pkgImages = catPkgs.map((p) => p.image).filter(Boolean)
                const cardImages = pkgImages.length > 0 ? [...new Set([...pkgImages, ...meta.defaultImages])].slice(0, 4) : meta.defaultImages
                const durations = Array.from(new Set(catPkgs.map(getPackageDurationChip))).sort()
                return (
                  <CategoryCardTile
                    key={meta.category}
                    meta={meta}
                    images={cardImages}
                    packageCount={catPkgs.length}
                    durations={durations}
                    variant="compact"
                    isSelected={selectedCategory === meta.category}
                    staggerOffsetMs={(idx + 2) * 1000}
                    onClick={() => handleCategorySelect(meta.category)}
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <div className="dest-category-grid-3">
            {visibleCategories.map((meta, idx) => {
              const catPkgs = destinationPackages.filter((pkg) => getPackageCategory(pkg) === meta.category)
              const pkgImages = catPkgs.map((p) => p.image).filter(Boolean)
              const cardImages = pkgImages.length > 0 ? [...new Set([...pkgImages, ...meta.defaultImages])].slice(0, 4) : meta.defaultImages
              const durations = Array.from(new Set(catPkgs.map(getPackageDurationChip))).sort()
              return (
                <CategoryCardTile
                  key={meta.category}
                  meta={meta}
                  images={cardImages}
                  packageCount={catPkgs.length}
                  durations={durations}
                  variant="tall"
                  isSelected={selectedCategory === meta.category}
                  staggerOffsetMs={idx * 1000}
                  onClick={() => handleCategorySelect(meta.category)}
                />
              )
            })}
          </div>
        )}

        {/* Filtered Packages & Duration Chips Panel */}
        <div
          id="destination-packages-results"
          className="mt-10 rounded-[24px] border border-[#e6dfd3] bg-white/95 p-5 sm:p-7 shadow-[0_14px_38px_rgba(7,47,43,0.06)] scroll-mt-28"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#efe9de]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c25132]">
                {selectedCategory === 'All' ? 'All Curated Departures' : `${selectedCategory} Departures`}
              </span>
              <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-normal text-[#072f2b]">
                {destination.city} {selectedCategory === 'All' ? 'Packages' : `${selectedCategory} Packages`}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedDuration('All')
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#072f2b] text-white shadow-xs'
                    : 'bg-[#f4efe7] text-[#465c55] hover:bg-[#ebe3d5]'
                }`}
              >
                All ({destinationPackages.length})
              </button>
              {visibleCategories.map((meta) => {
                const count = destinationPackages.filter((pkg) => getPackageCategory(pkg) === meta.category).length
                return (
                  <button
                    key={meta.category}
                    type="button"
                    onClick={() => handleCategorySelect(meta.category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === meta.category
                        ? 'bg-[#ef4934] text-white shadow-xs'
                        : 'bg-[#f4efe7] text-[#465c55] hover:bg-[#ebe3d5]'
                    }`}
                  >
                    {meta.title} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Duration Filter Chips */}
          {availableDurations.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#51645d] mr-1">
                Durations:
              </span>
              <button
                type="button"
                onClick={() => setSelectedDuration('All')}
                className={`dest-duration-chip ${selectedDuration === 'All' ? 'is-active' : ''}`}
              >
                All Durations
              </button>
              {availableDurations.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSelectedDuration(chip)}
                  className={`dest-duration-chip ${selectedDuration === chip ? 'is-active' : ''}`}
                >
                  <Icon name="clock" size={12} />
                  <span>{chip}</span>
                </button>
              ))}
            </div>
          )}

          {/* Package Cards Grid */}
          {displayedPackages.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPackages.map((pkg) => {
                const pkgCategory = getPackageCategory(pkg)
                const durationChip = getPackageDurationChip(pkg)
                const { amount, perUnit } = getPackageLowestPrice(pkg)
                // Sibling duration variants in the same destination & category
                const siblingDurations = destinationPackages
                  .filter(
                    (other) =>
                      getPackageCategory(other) === pkgCategory &&
                      other.place.toLowerCase() === pkg.place.toLowerCase(),
                  )
                  .sort((a, b) => a.daysCount - b.daysCount)

                return (
                  <article
                    key={pkg.id}
                    className="group flex flex-col overflow-hidden rounded-[20px] border border-[#e7e2d8] bg-[#fbfaf7] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(7,47,43,0.12)]"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenPackage(pkg.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onOpenPackage(pkg.id)
                        }
                      }}
                      className="relative h-52 overflow-hidden cursor-pointer"
                    >
                      <CatalogPhoto
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#072f2b]/80 via-[#072f2b]/15 to-transparent" />
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#072f2b] shadow-sm">
                          <Icon name="clock" size={12} className="text-[#ef4934]" />
                          {durationChip}
                        </span>
                        <span className="rounded-full bg-[#072f2b]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                          {pkgCategory}
                        </span>
                      </div>
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <p className="text-[11px] font-semibold text-[#ffd0c7] uppercase tracking-wider">
                          {pkg.routeSummary || `${pkg.place} · ${pkg.state}`}
                        </p>
                        <h4 className="mt-0.5 font-serif text-xl font-medium leading-snug text-white">
                          {pkg.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs leading-relaxed text-[#51645d] line-clamp-2">
                        {pkg.summary || pkg.overview}
                      </p>

                      {/* Quick clickable Duration Chips for this route/package */}
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {(siblingDurations.length > 1 ? siblingDurations : [pkg]).map((variantPkg) => {
                          const chip = getPackageDurationChip(variantPkg)
                          const isCurrent = variantPkg.id === pkg.id
                          return (
                            <button
                              key={variantPkg.id}
                              type="button"
                              onClick={() => onOpenPackage(variantPkg.id)}
                              className={`dest-duration-chip ${isCurrent ? 'is-active' : ''}`}
                              title={`Open ${variantPkg.title} (${chip})`}
                            >
                              {chip}
                            </button>
                          )
                        })}
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#eae4d9] flex items-end justify-between gap-3">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6f817c]">
                            Starting from · {perUnit}
                          </span>
                          <strong className="font-jakarta text-xl font-bold text-[#072f2b]">
                            {formatPrice(amount, currency)}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenPackage(pkg.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#0b4941] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#ef4934]"
                        >
                          <span>View Itinerary</span>
                          <Icon name="arrow" size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#d8d0c2] bg-[#fbfaf7] p-8 text-center">
              <p className="font-serif text-xl text-[#072f2b]">
                No fixed {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : ''} departures listed for {destination.city} yet.
              </p>
              <p className="mt-1.5 text-xs text-[#51645d] max-w-md mx-auto">
                Our local travel designers craft custom {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : ''} itineraries for {destination.city} with handpicked stays and private transport.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All')
                      setSelectedDuration('All')
                    }}
                    className="rounded-full border border-[#0b4941] px-4 py-2 text-xs font-bold text-[#0b4941] hover:bg-[#0b4941]/5"
                  >
                    Show all {destination.city} packages
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onPlanCustom(selectedCategory === 'All' ? undefined : selectedCategory)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4934] px-5 py-2 text-xs font-bold text-white hover:bg-[#d83e2a]"
                >
                  <span>Request Custom {destination.city} Plan</span>
                  <Icon name="arrow" size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
