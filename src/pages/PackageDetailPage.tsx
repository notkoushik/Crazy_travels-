import React, { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CatalogPhoto } from '../components/CatalogPhoto'
import { GoogleVerifiedBadge } from '../components/GoogleVerifiedBadge'
import { Icon } from '../components/Icon'
import {
  CategoryVideoReviews,
  doesPackageMatchDestination,
  getPackageCategory,
  getPackageDurationChip,
} from '../components/PackageCategoryCards'
import { catalogPhotoUrls } from '../data/catalogPhotos'
import {
  allPackages as staticPackages,
  formatPrice,
  instagramReels,
} from '../data/travelData'
import { dataStore, useDynamicStore } from '../services/dataStore'
import type {
  Currency,
  DestinationCustomizationStop,
  DestinationItem,
  InstagramReelItem,
  PackageItem,
  RouteName,
} from '../types/travel'

const DETAIL_TABS = [
  { id: 'itinerary', label: 'Itinerary', icon: 'map' },
  { id: 'inclusions', label: 'Inclusions', icon: 'check' },
  { id: 'summary', label: 'Summary', icon: 'layers' },
] as const

type DetailTabId = (typeof DETAIL_TABS)[number]['id']

interface PackageDetailPageProps {
  packageItem: PackageItem
  allPackages?: PackageItem[]
  destinations?: DestinationItem[]
  reels?: InstagramReelItem[]
  navigate: (route: RouteName) => void
  onBook: (title: string, price: number) => void
  onOpenStory?: (
    story: InstagramReelItem,
    index?: number,
    filteredReels?: InstagramReelItem[],
  ) => void
  saved: boolean
  onToggleSave: () => void
  currency: Currency
  onToast?: (msg: string) => void
}

const FEATURE_STRIP = [
  { label: 'Transport', sub: 'Private cab / Volvo', icon: 'car' as const },
  { label: 'Hotels', sub: 'Handpicked stays', icon: 'hotel' as const },
  { label: 'Sightseeing', sub: 'Curated local spots', icon: 'compass' as const },
  { label: 'Meals', sub: 'Breakfast & dinner', icon: 'sparkle' as const },
  { label: '24/7 Telugu CC', sub: 'Dedicated support', icon: 'phone' as const },
]

export function PackageDetailPage({
  packageItem,
  allPackages = staticPackages,
  destinations = [],
  reels,
  navigate,
  onBook,
  onOpenStory,
  saved,
  onToggleSave,
  currency,
  onToast,
}: PackageDetailPageProps) {
  const store = useDynamicStore()
  const [activeTab, setActiveTab] = useState<DetailTabId>('itinerary')
  const [activeDay, setActiveDay] = useState<number>(packageItem.itinerary[0]?.day ?? 1)
  const [selectedCustomIds, setSelectedCustomIds] = useState<string[]>([])
  const [activeCustomStopId, setActiveCustomStopId] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<'offSeason' | 'season'>('offSeason')
  const [selectedTierName, setSelectedTierName] = useState<string>(
    packageItem.pricingTiers?.tiers?.[0]?.name || 'Standard',
  )

  // Callback form state
  const [callbackName, setCallbackName] = useState('')
  const [callbackPhone, setCallbackPhone] = useState('')
  const [callbackBusy, setCallbackBusy] = useState(false)
  const [callbackSent, setCallbackSent] = useState(false)
  const [callbackError, setCallbackError] = useState('')
  const [shareCopied, setShareCopied] = useState(false)

  // Sync state when switching package duration variants
  useEffect(() => {
    setActiveDay(packageItem.itinerary[0]?.day ?? 1)
    setSelectedCustomIds([])
    setActiveCustomStopId(null)
    setSelectedTierName(packageItem.pricingTiers?.tiers?.[0]?.name || 'Standard')
    setLightboxIndex(null)
    setCallbackSent(false)
    setCallbackError('')
  }, [packageItem.id, packageItem.itinerary, packageItem.pricingTiers])

  const category = getPackageCategory(packageItem)
  const durationChip = getPackageDurationChip(packageItem)
  const availableDestinations = destinations.length > 0 ? destinations : store.destinations
  const displayReels =
    reels && reels.length > 0
      ? reels
      : store.reels.length > 0
        ? store.reels
        : instagramReels

  const matchedDestination = useMemo(() => {
    return availableDestinations.find((d) => doesPackageMatchDestination(packageItem, d))
  }, [availableDestinations, packageItem])

  // Compatible customization stops for this destination & duration
  const compatibleCustomizations = useMemo<DestinationCustomizationStop[]>(() => {
    const options = matchedDestination?.customizationOptions ?? []
    return options.filter((opt) => {
      if (!opt.allowedDurations || opt.allowedDurations.length === 0) return true
      return opt.allowedDurations.some(
        (d) => d.trim().toUpperCase() === durationChip.trim().toUpperCase(),
      )
    })
  }, [matchedDestination, durationChip])

  const selectedCustomStops = useMemo<DestinationCustomizationStop[]>(() => {
    return selectedCustomIds
      .map((id) => compatibleCustomizations.find((opt) => opt.id === id))
      .filter((opt): opt is DestinationCustomizationStop => Boolean(opt))
  }, [selectedCustomIds, compatibleCustomizations])

  const activeCustomStop = activeCustomStopId
    ? selectedCustomStops.find((stop) => stop.id === activeCustomStopId) ?? null
    : null
  const activeCustomStopIndex = activeCustomStop
    ? selectedCustomStops.findIndex((stop) => stop.id === activeCustomStop.id)
    : -1

  const toggleCustomStop = (stopId: string) => {
    setSelectedCustomIds((prev) => {
      if (prev.includes(stopId)) {
        if (activeCustomStopId === stopId) {
          setActiveCustomStopId(null)
        }
        return prev.filter((id) => id !== stopId)
      }
      return [...prev, stopId]
    })
  }

  // Sibling packages for the same destination & category (for interactive duration/route switching)
  const siblingVariants = useMemo(() => {
    const matches = allPackages.filter((candidate) => {
      if (getPackageCategory(candidate) !== category) return false
      if (matchedDestination) {
        return doesPackageMatchDestination(candidate, matchedDestination)
      }
      if (packageItem.destinationSlug && candidate.destinationSlug) {
        return candidate.destinationSlug.toLowerCase() === packageItem.destinationSlug.toLowerCase()
      }
      return (
        candidate.state.toLowerCase() === packageItem.state.toLowerCase() ||
        candidate.place.toLowerCase() === packageItem.place.toLowerCase()
      )
    })
    const unique = new Map<string, PackageItem>()
    for (const item of [packageItem, ...matches]) {
      unique.set(item.id, item)
    }
    return [...unique.values()].sort(
      (a, b) => a.daysCount - b.daysCount || a.title.localeCompare(b.title),
    )
  }, [allPackages, category, matchedDestination, packageItem])

  // Build 4-photo mosaic gallery (enriched with destination gallery if package has <4 photos)
  const mosaicPhotos = useMemo(() => {
    const destExtras = matchedDestination
      ? [matchedDestination.image, ...(matchedDestination.gallery ?? [])]
      : []
    const combined = catalogPhotoUrls(packageItem.image, [
      ...(packageItem.gallery ?? []),
      ...destExtras,
    ])
    return combined.length > 0 ? combined : [packageItem.image].filter(Boolean)
  }, [packageItem.image, packageItem.gallery, matchedDestination])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
      } else if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % mosaicPhotos.length,
        )
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + mosaicPhotos.length) % mosaicPhotos.length,
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, mosaicPhotos.length])

  const tiers = packageItem.pricingTiers?.tiers ?? []
  const activeTier =
    tiers.find((t) => t.name === selectedTierName) ?? tiers[0] ?? null
  const activePrice = activeTier
    ? selectedSeason === 'season'
      ? activeTier.seasonPrice || activeTier.offSeasonPrice
      : activeTier.offSeasonPrice || activeTier.seasonPrice
    : packageItem.priceNum
  const perUnitLabel =
    packageItem.pricingTiers?.perUnit ||
    (category === 'Couple' ? 'Per Couple' : 'Per Person')
  const minPax = packageItem.pricingTiers?.minPax

  // Live customized duration & price calculation
  const baseDays = Number(packageItem.daysCount) || packageItem.itinerary.length || 3
  const baseNights =
    packageItem.nightsCount != null ? Number(packageItem.nightsCount) : Math.max(0, baseDays - 1)
  const extraDays = selectedCustomStops.reduce((sum, s) => sum + (Number(s.extraDays) || 0), 0)
  const extraNights = selectedCustomStops.reduce((sum, s) => sum + (Number(s.extraNights) || 0), 0)
  const totalDays = baseDays + extraDays
  const totalNights = baseNights + extraNights
  const totalDurationLabel = `${totalDays}D/${totalNights}N`
  const extraPriceDelta = selectedCustomStops.reduce(
    (sum, s) => sum + (Number(s.priceDelta) || 0),
    0,
  )
  const finalPrice = activePrice + extraPriceDelta
  const notepadFormula =
    selectedCustomStops.length > 0
      ? `${durationChip} + ${selectedCustomStops.map((s) => s.name).join(' + ')}`
      : durationChip
  const customizedBookingTitle =
    selectedCustomStops.length > 0
      ? `${packageItem.title} (${notepadFormula} → ${totalDurationLabel})`
      : packageItem.title

  const whatsappInquiryUrl = useMemo(() => {
    const seasonLabel = selectedSeason === 'season' ? 'Peak Season' : 'Off-Season'
    const customLine =
      selectedCustomStops.length > 0
        ? `\nCustom Route: ${notepadFormula} (${totalDurationLabel})`
        : `\nDuration: ${durationChip}`
    const msg = `Hi Crazy Tours Travels! I'm interested in:\nPackage: ${packageItem.title} (${category})${customLine}\nTier: ${activeTier?.name || 'Standard'} (${seasonLabel})\nEstimated Price: ${formatPrice(finalPrice, currency)} ${perUnitLabel}`
    return `https://wa.me/918894998808?text=${encodeURIComponent(msg)}`
  }, [
    selectedSeason,
    selectedCustomStops.length,
    notepadFormula,
    totalDurationLabel,
    durationChip,
    packageItem.title,
    category,
    activeTier?.name,
    finalPrice,
    currency,
    perUnitLabel,
  ])

  const currentDayObj =
    packageItem.itinerary.find((d) => d.day === activeDay) ??
    packageItem.itinerary[0]

  const currentDayIndex = packageItem.itinerary.findIndex(
    (d) => d.day === currentDayObj?.day,
  )

  const scrollToItinerary = () => {
    setActiveTab('itinerary')
    window.setTimeout(() => {
      document.getElementById('itinerary')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 40)
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${packageItem.title} · Crazy Tours Travel`,
          text: `${packageItem.title} (${notepadFormula})`,
          url: shareUrl,
        })
        return
      }
    } catch {
      // Fallback to clipboard copy
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      onToast?.('Package link copied to clipboard.')
      window.setTimeout(() => setShareCopied(false), 2600)
    } catch {
      onToast?.('Copy the address bar URL to share this itinerary.')
    }
  }

  const handleCallbackSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (callbackBusy) return
    setCallbackError('')
    const trimmedPhone = callbackPhone.trim()
    if (trimmedPhone.length < 7) {
      setCallbackError('Please enter a valid 10-digit phone or WhatsApp number.')
      return
    }
    setCallbackBusy(true)
    try {
      await dataStore.addInquiry({
        id: `INQ-${crypto.randomUUID()}`,
        fullName: callbackName.trim() || 'Callback Request',
        phone: trimmedPhone,
        email: '',
        preferredDestination: packageItem.place || packageItem.state,
        travelMonth:
          selectedSeason === 'season'
            ? packageItem.pricingTiers?.seasonDates || 'Peak Season'
            : packageItem.pricingTiers?.offSeasonDates || 'Off-Season',
        travelSeason: selectedSeason === 'season' ? 'Season' : 'Off-Season',
        sourcePage: `package/${packageItem.id}`,
        sourceTitle: customizedBookingTitle,
        travelersCount: minPax ? `${minPax}+ Pax (${perUnitLabel})` : perUnitLabel,
        budgetPerPerson: formatPrice(finalPrice, currency),
        tripType: `${category} · Package Callback`,
        notes: `Package: ${packageItem.title} | Route: ${notepadFormula} (${totalDurationLabel}) | Tier: ${activeTier?.name || 'Standard'} | Season: ${selectedSeason === 'season' ? 'Season' : 'Off-Season'} | Est. Price: ${formatPrice(finalPrice, currency)}`,
        status: 'New',
        createdAt: new Date().toISOString(),
      })
      setCallbackSent(true)
      setCallbackPhone('')
      setCallbackName('')
      onToast?.('Callback requested! Our Telugu travel desk will reach out shortly.')
    } catch (err) {
      setCallbackError(
        err instanceof Error ? err.message : 'Unable to submit callback request.',
      )
    } finally {
      setCallbackBusy(false)
    }
  }

  const slot0 = mosaicPhotos[0] || packageItem.image
  const slot1 = mosaicPhotos[1] || slot0
  const slot2 = mosaicPhotos[2] || slot1
  const slot3 = mosaicPhotos[3] || slot0

  return (
    <main className="bg-[#fbfaf7] pb-24 pt-5 font-inter">
      {/* Breadcrumb Navigation: Home / Destinations / Place / Category / Title */}
      <nav
        aria-label="Breadcrumb"
        className="shell mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[#51645d]"
      >
        <button
          type="button"
          onClick={() => navigate('home')}
          className="hover:text-[#ef4934] font-medium"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => navigate('packages')}
          className="hover:text-[#ef4934] font-medium"
        >
          Destinations
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() =>
            matchedDestination
              ? navigate(`destination/${matchedDestination.slug}`)
              : navigate('packages')
          }
          className="hover:text-[#ef4934] font-medium"
        >
          {packageItem.place || matchedDestination?.city || packageItem.state}
        </button>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-[#0b4941]">{category}</span>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-[#072f2b] line-clamp-1">
          {packageItem.title}
        </span>
      </nav>

      {/* Top Location Photo Mosaic Gallery */}
      <section className="shell mb-8" aria-label="Destination photo gallery">
        <div className="pkg-mosaic-grid">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="pkg-mosaic-tile pkg-mosaic-lead group"
            aria-label={`Open ${packageItem.title} gallery photo 1`}
          >
            <CatalogPhoto
              src={slot0}
              alt={`${packageItem.title} main view`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="pkg-mosaic-overlay-badge">
              <Icon name="camera" size={13} />
              <span>{mosaicPhotos.length} Photos</span>
            </span>
          </button>

          <div className="pkg-mosaic-right">
            <button
              type="button"
              onClick={() => setLightboxIndex(Math.min(1, mosaicPhotos.length - 1))}
              className="pkg-mosaic-tile pkg-mosaic-wide group"
              aria-label={`Open ${packageItem.title} gallery photo 2`}
            >
              <CatalogPhoto
                src={slot1}
                alt={`${packageItem.place} landscape`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>

            <div className="pkg-mosaic-bottom-pair">
              <button
                type="button"
                onClick={() => setLightboxIndex(Math.min(2, mosaicPhotos.length - 1))}
                className="pkg-mosaic-tile group"
                aria-label={`Open ${packageItem.title} gallery photo 3`}
              >
                <CatalogPhoto
                  src={slot2}
                  alt={`${packageItem.place} highlights`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>

              <button
                type="button"
                onClick={() => setLightboxIndex(Math.min(3, mosaicPhotos.length - 1))}
                className="pkg-mosaic-tile group relative"
                aria-label={`View all ${mosaicPhotos.length} photos`}
              >
                <CatalogPhoto
                  src={slot3}
                  alt={`${packageItem.place} experiences`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-[#072f2b]/45 text-xs font-bold text-white backdrop-blur-[1px] transition-colors group-hover:bg-[#072f2b]/60">
                  + View Gallery ({mosaicPhotos.length})
                </span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSave}
            className={`absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full shadow-lg backdrop-blur-md transition-colors ${
              saved
                ? 'bg-[#ef4934] text-white'
                : 'bg-white/90 text-[#072f2b] hover:bg-white'
            }`}
            aria-label={saved ? 'Remove from saved trips' : 'Save this package'}
            aria-pressed={saved}
          >
            <Icon name="heart" size={19} className={saved ? 'fill-current' : ''} />
          </button>
        </div>
      </section>

      {/* Package Header Block */}
      <section className="shell mb-8">
        <div className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(7,47,43,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#072f2b] px-3.5 py-1 text-xs font-bold text-white">
                <Icon name="clock" size={13} className="text-[#ffd0c7]" />
                {totalDurationLabel}
                {selectedCustomStops.length > 0 ? ` (Base ${durationChip})` : ` · ${packageItem.duration}`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f3e9d8] px-3.5 py-1 text-xs font-bold text-[#0b4941]">
                {category} Package
              </span>
              {packageItem.discount && (
                <span className="rounded-full bg-[#ef4934] px-3 py-1 text-xs font-bold text-white">
                  {packageItem.discount}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {packageItem.rating > 0 && packageItem.reviewCount > 0 && (
                <span className="text-xs font-bold text-[#072f2b]">
                  ★ {packageItem.rating} ({packageItem.reviewCount} reviews)
                </span>
              )}
              <GoogleVerifiedBadge
                rating={packageItem.googleRating}
                reviewsCount={packageItem.googleReviewsCount}
                mapsUrl={packageItem.googleMapsUrl}
                size="sm"
              />
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.1] text-[#072f2b]">
            {packageItem.title}
          </h1>

          {/* Route Night Summary */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#c25132]">
            <Icon name="pin" size={16} className="shrink-0" />
            <span>
              {packageItem.routeSummary || `${packageItem.place} · ${packageItem.state}`}
              {selectedCustomStops.length > 0 &&
                ` + ${selectedCustomStops.map((s) => s.name).join(' + ')}`}
            </span>
          </div>

          {/* Interactive Duration & Route Variant Switcher */}
          {siblingVariants.length > 1 && (
            <div className="mt-6 pt-5 border-t border-[#efe9de]">
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#51645d] mb-2.5">
                Switch Duration / Route Variant ({category} ·{' '}
                {matchedDestination?.city || packageItem.state})
              </span>
              <div className="flex flex-wrap gap-2">
                {siblingVariants.map((variant) => {
                  const chip = getPackageDurationChip(variant)
                  const isActive = variant.id === packageItem.id
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => navigate(`package/${variant.id}`)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? 'border-[#072f2b] bg-[#072f2b] text-white shadow-sm'
                          : 'border-[#ddd5c7] bg-[#fbfaf7] text-[#173631] hover:border-[#ef4934] hover:text-[#ef4934]'
                      }`}
                    >
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          isActive
                            ? 'bg-[#ef4934] text-white'
                            : 'bg-[#f3e9d8] text-[#072f2b]'
                        }`}
                      >
                        {chip}
                      </span>
                      <span className="truncate max-w-[200px]">
                        {variant.routeSummary || variant.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Feature Strip */}
          <div className="mt-6 pt-5 border-t border-[#efe9de] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {FEATURE_STRIP.map((feat) => (
              <div
                key={feat.label}
                className="flex items-center gap-2.5 rounded-2xl border border-[#ece6da] bg-[#fbfaf7] px-3.5 py-2.5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0b4941]/10 text-[#0b4941]">
                  <Icon name={feat.icon} size={15} />
                </span>
                <div className="min-w-0">
                  <strong className="block text-xs font-bold text-[#072f2b]">
                    {feat.label}
                  </strong>
                  <span className="block truncate text-[11px] text-[#51645d]">
                    {feat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content + Right Sticky Pricing/Callback Sidebar */}
      <div className="shell grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start mb-16">
        {/* Left Column: Tab Bar + Active Tab Body */}
        <div id="itinerary" className="min-w-0 space-y-6 scroll-mt-28">
          {/* Tab Bar + Share & Brochure PDF Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e6dfd3] bg-white p-2.5 shadow-xs">
            <nav className="flex flex-wrap items-center gap-1.5" aria-label="Package sections">
              {DETAIL_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#072f2b] text-white shadow-sm'
                        : 'text-[#465c55] hover:bg-[#f4efe7] hover:text-[#072f2b]'
                    }`}
                  >
                    <Icon name={tab.icon} size={15} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#ddd5c7] bg-[#fbfaf7] px-3 py-2 text-xs font-bold text-[#072f2b] hover:border-[#0b4941]"
              >
                <Icon name="share" size={14} />
                <span>{shareCopied ? 'Copied!' : 'Share'}</span>
              </button>

              {packageItem.brochurePdfUrl && (
                <a
                  href={packageItem.brochurePdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#f3e9d8] px-3.5 py-2 text-xs font-bold text-[#072f2b] hover:bg-[#ef4934] hover:text-white transition-colors"
                >
                  <Icon name="download" size={14} />
                  <span>Brochure PDF</span>
                </a>
              )}
            </div>
          </div>

          {/* TAB 1: ITINERARY + CUSTOMIZATION NOTEPAD BUILDER */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Notepad-style Live Trip Summary Strip */}
              <section
                aria-label="Live trip notepad summary"
                className="rounded-[24px] border-2 border-dashed border-[#d8cbb6] bg-[#fbfaf7] p-5 sm:p-6 shadow-[0_10px_26px_rgba(7,47,43,0.05)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#e8dfd1]">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#072f2b] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ffd0c7]">
                      <Icon name="edit" size={12} />
                      <span>Trip Notepad · Live Builder</span>
                    </span>
                    <h2 className="mt-2 font-serif text-xl sm:text-2xl font-medium text-[#072f2b]">
                      {notepadFormula}
                      <span className="ml-2 inline-flex items-center rounded-full bg-[#ef4934] px-2.5 py-0.5 font-sans text-xs font-bold text-white align-middle">
                        {totalDurationLabel}
                      </span>
                    </h2>
                    <p className="mt-1 text-xs text-[#51645d]">
                      {selectedCustomStops.length > 0
                        ? `Base ${durationChip} + ${selectedCustomStops.length} custom ${
                            selectedCustomStops.length === 1 ? 'stop' : 'stops'
                          } (+${extraDays}D / +${extraNights}N). Click any stop in the Day Selector to view highlights.`
                        : `Start with ${durationChip} (${packageItem.routeSummary || packageItem.place}) and add extra Customization Locations below.`}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#51645d]">
                      Estimated Total ({perUnitLabel})
                    </span>
                    <strong className="font-jakarta text-2xl font-bold text-[#072f2b]">
                      {formatPrice(finalPrice, currency)}
                    </strong>
                    {extraPriceDelta > 0 && (
                      <span className="block text-[11px] font-semibold text-[#c25132]">
                        Base {formatPrice(activePrice, currency)} +{' '}
                        {formatPrice(extraPriceDelta, currency)} add-ons
                      </span>
                    )}
                  </div>
                </div>

                {/* Removable Chips & Quick Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#072f2b] px-3 py-1 text-xs font-bold text-white">
                      <Icon name="clock" size={12} className="text-[#ffd0c7]" />
                      {durationChip} Base
                    </span>

                    {selectedCustomStops.map((stop, idx) => (
                      <span
                        key={stop.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#ef4934]/40 bg-white px-3 py-1 text-xs font-bold text-[#072f2b] shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveCustomStopId(stop.id)}
                          className="hover:text-[#ef4934] transition-colors"
                        >
                          + {idx + 1}. {stop.name} (+{stop.extraDays}D/{stop.extraNights}N)
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCustomStop(stop.id)}
                          aria-label={`Remove ${stop.name}`}
                          className="grid size-4 place-items-center rounded-full bg-[#f4efe7] text-[#c25132] hover:bg-[#ef4934] hover:text-white transition-colors"
                        >
                          <Icon name="x" size={10} />
                        </button>
                      </span>
                    ))}

                    {selectedCustomStops.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomIds([])
                          setActiveCustomStopId(null)
                        }}
                        className="text-xs font-bold text-[#c25132] hover:underline ml-1"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {selectedCustomStops.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onBook(customizedBookingTitle, finalPrice)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4934] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#d83e2a] shadow-xs"
                      >
                        <span>Book {totalDurationLabel}</span>
                        <Icon name="arrow" size={13} />
                      </button>
                      <a
                        href={whatsappInquiryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#0b4941] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0b4941] hover:bg-[#0b4941] hover:text-white transition-colors"
                      >
                        <Icon name="whatsapp" size={13} />
                        <span>WhatsApp Route</span>
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Day 1..N + Added Custom Stops Selector & Detail Card */}
              <div className="grid grid-cols-1 md:grid-cols-[235px_minmax(0,1fr)] gap-5 items-start">
                {/* Left Vertical Day List */}
                <div
                  className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:sticky md:top-[calc(var(--site-nav-height)+1.25rem)]"
                  role="tablist"
                  aria-label="Itinerary days and custom stops"
                >
                  {packageItem.itinerary.map((day) => {
                    const isCurrent =
                      activeCustomStop === null && day.day === currentDayObj?.day
                    return (
                      <button
                        key={day.day}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        onClick={() => {
                          setActiveCustomStopId(null)
                          setActiveDay(day.day)
                        }}
                        className={`shrink-0 md:shrink flex items-center md:items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                          isCurrent
                            ? 'border-[#072f2b] bg-[#072f2b] text-white shadow-md'
                            : 'border-[#e6dfd3] bg-white text-[#173631] hover:border-[#ef4934]/60'
                        }`}
                      >
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-xl text-[11px] font-bold ${
                            isCurrent
                              ? 'bg-[#ef4934] text-white'
                              : 'bg-[#f3e9d8] text-[#072f2b]'
                          }`}
                        >
                          D{day.day}
                        </span>
                        <div className="min-w-0">
                          <span
                            className={`block text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-[#ffd0c7]' : 'text-[#c25132]'
                            }`}
                          >
                            Day {day.day}
                          </span>
                          <span className="block text-xs font-bold leading-snug line-clamp-2">
                            {day.title}
                          </span>
                        </div>
                      </button>
                    )
                  })}

                  {/* Appended Custom Stops directly under Day 1..N */}
                  {selectedCustomStops.map((stop, idx) => {
                    const isCurrent = activeCustomStop?.id === stop.id
                    return (
                      <button
                        key={`custom-nav-${stop.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        onClick={() => setActiveCustomStopId(stop.id)}
                        className={`shrink-0 md:shrink flex items-center md:items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                          isCurrent
                            ? 'border-[#ef4934] bg-[#ef4934] text-white shadow-md'
                            : 'border-dashed border-[#ef4934]/60 bg-[#fff9f7] text-[#072f2b] hover:border-[#ef4934]'
                        }`}
                      >
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-xl text-[11px] font-bold ${
                            isCurrent
                              ? 'bg-white text-[#ef4934]'
                              : 'bg-[#ef4934]/15 text-[#c25132]'
                          }`}
                        >
                          +{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span
                            className={`block text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-white/90' : 'text-[#c25132]'
                            }`}
                          >
                            + Custom Stop {idx + 1}
                          </span>
                          <span className="block text-xs font-bold leading-snug line-clamp-2">
                            {stop.name}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Center Detail Card (either Active Custom Stop OR Active Day 1..N) */}
                {activeCustomStop ? (
                  <article className="rounded-[24px] border border-[#ef4934]/35 bg-white p-6 sm:p-7 shadow-[0_10px_30px_rgba(7,47,43,0.06)] space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#efe9de]">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4934]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#c25132]">
                          + Custom Stop {activeCustomStopIndex + 1} · +{activeCustomStop.extraDays}D / +{activeCustomStop.extraNights}N
                        </span>
                        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-[#072f2b]">
                          {activeCustomStop.name}
                        </h2>
                        {activeCustomStop.subtitle && (
                          <p className="mt-1 text-sm font-medium text-[#51645d]">
                            {activeCustomStop.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-[#eadfce] bg-[#fbfaf7] px-4 py-2.5 text-right">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#51645d]">
                          Add-On Estimate
                        </span>
                        <strong className="font-jakarta text-lg font-bold text-[#072f2b]">
                          {activeCustomStop.priceDelta && activeCustomStop.priceDelta > 0
                            ? `+${formatPrice(activeCustomStop.priceDelta, currency)}`
                            : 'Custom Quote'}
                        </strong>
                      </div>
                    </div>

                    {activeCustomStop.image && (
                      <div className="h-52 overflow-hidden rounded-2xl border border-[#ece6da]">
                        <CatalogPhoto
                          src={activeCustomStop.image}
                          alt={activeCustomStop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {!!activeCustomStop.highlights?.length && (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#51645d] flex items-center gap-1.5">
                          <Icon name="compass" size={14} className="text-[#ef4934]" />
                          Custom Stop Highlights
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeCustomStop.highlights.map((spot, idx) => (
                            <div
                              key={`${spot}-${idx}`}
                              className="flex items-start gap-2.5 rounded-xl border border-[#ece6da] bg-[#fbfaf7] p-3 text-xs font-semibold text-[#173631]"
                            >
                              <Icon
                                name="check"
                                size={14}
                                className="mt-0.5 shrink-0 text-[#0b4941]"
                              />
                              <span>{spot}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#efe9de]">
                      <button
                        type="button"
                        onClick={() => setActiveCustomStopId(null)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd5c7] px-4 py-2 text-xs font-bold text-[#072f2b] hover:bg-[#f4efe7]"
                      >
                        <Icon name="chevron" size={14} className="rotate-180" />
                        <span>Back to Day {activeDay}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCustomStop(activeCustomStop.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4934]/12 px-4 py-2 text-xs font-bold text-[#c25132] hover:bg-[#ef4934] hover:text-white transition-colors"
                      >
                        <Icon name="trash" size={14} />
                        <span>Remove {activeCustomStop.name}</span>
                      </button>
                    </div>
                  </article>
                ) : currentDayObj ? (
                  <article className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 sm:p-7 shadow-[0_10px_30px_rgba(7,47,43,0.05)] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#efe9de]">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4934]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#c25132]">
                          Day {currentDayObj.day} of {packageItem.itinerary.length}
                        </span>
                        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-[#072f2b]">
                          {currentDayObj.title}
                        </h2>
                      </div>
                      {(currentDayObj.startLocation || currentDayObj.endLocation) && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbfaf7] border border-[#e6dfd3] px-3 py-1 text-xs font-semibold text-[#51645d]">
                          <Icon name="pin" size={13} className="text-[#ef4934]" />
                          {[currentDayObj.startLocation, currentDayObj.endLocation]
                            .filter(Boolean)
                            .join(' → ')}
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed text-[#384e49] whitespace-pre-line">
                      {currentDayObj.description}
                    </p>

                    {currentDayObj.seasonalNote && (
                      <div
                        role="note"
                        className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-xs text-amber-950"
                      >
                        <Icon
                          name="sparkle"
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-700"
                        />
                        <div>
                          <strong className="block font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-0.5">
                            Seasonal Travel Advisory
                          </strong>
                          <p className="leading-relaxed">{currentDayObj.seasonalNote}</p>
                        </div>
                      </div>
                    )}

                    {(currentDayObj.transfer ||
                      currentDayObj.startLocation ||
                      currentDayObj.endLocation) && (
                      <div className="flex items-start gap-3.5 rounded-2xl border border-[#eadfce] bg-[#f9f4eb] p-4">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#072f2b] text-white">
                          <Icon name="car" size={17} />
                        </span>
                        <div>
                          <strong className="block text-[11px] font-bold uppercase tracking-wider text-[#51645d]">
                            Transfer &amp; Road Journey
                          </strong>
                          <p className="mt-0.5 text-sm font-semibold text-[#072f2b]">
                            {currentDayObj.transfer ||
                              [currentDayObj.startLocation, currentDayObj.endLocation]
                                .filter(Boolean)
                                .join(' to ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {!!currentDayObj.activities?.length && (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#51645d] flex items-center gap-1.5">
                          <Icon name="compass" size={14} className="text-[#ef4934]" />
                          Sightseeing &amp; Experiences
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {currentDayObj.activities.map((spot, idx) => (
                            <div
                              key={`${spot}-${idx}`}
                              className="flex items-start gap-2.5 rounded-xl border border-[#ece6da] bg-[#fbfaf7] p-3 text-xs font-semibold text-[#173631]"
                            >
                              <Icon
                                name="check"
                                size={14}
                                className="mt-0.5 shrink-0 text-[#0b4941]"
                              />
                              <span>{spot}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(currentDayObj.hotel || currentDayObj.meals) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {currentDayObj.hotel && (
                          <div className="rounded-2xl border border-[#e6dfd3] bg-[#fbfaf7] p-4 flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#0b4941]/10 text-[#0b4941]">
                              <Icon name="bed" size={17} />
                            </span>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#51645d]">
                                Accommodation
                              </span>
                              <strong className="mt-0.5 block text-sm font-bold text-[#072f2b]">
                                {currentDayObj.hotel}
                              </strong>
                              {(currentDayObj.hotelLocation || currentDayObj.hotelRating) && (
                                <span className="mt-0.5 block text-[11px] text-[#51645d]">
                                  {[
                                    currentDayObj.hotelLocation,
                                    currentDayObj.hotelRating
                                      ? `${currentDayObj.hotelRating}★ Stay`
                                      : '',
                                  ]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {currentDayObj.meals && (
                          <div className="rounded-2xl border border-[#e6dfd3] bg-[#fbfaf7] p-4 flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#ef4934]/12 text-[#c25132]">
                              <Icon name="sparkle" size={17} />
                            </span>
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#51645d]">
                                Included Meals
                              </span>
                              <strong className="mt-0.5 block text-sm font-bold text-[#072f2b]">
                                {currentDayObj.meals}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {packageItem.itinerary.length > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-[#efe9de]">
                        <button
                          type="button"
                          disabled={currentDayIndex <= 0}
                          onClick={() =>
                            setActiveDay(
                              packageItem.itinerary[currentDayIndex - 1]?.day ?? 1,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd5c7] px-4 py-2 text-xs font-bold text-[#072f2b] hover:bg-[#f4efe7] disabled:opacity-40 disabled:cursor-default"
                        >
                          <Icon name="chevron" size={14} className="rotate-180" />
                          <span>Previous Day</span>
                        </button>
                        <button
                          type="button"
                          disabled={currentDayIndex >= packageItem.itinerary.length - 1}
                          onClick={() =>
                            setActiveDay(
                              packageItem.itinerary[currentDayIndex + 1]?.day ??
                                activeDay,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#0b4941] px-4 py-2 text-xs font-bold text-white hover:bg-[#072f2b] disabled:opacity-40 disabled:cursor-default"
                        >
                          <span>Next Day</span>
                          <Icon name="chevron" size={14} />
                        </button>
                      </div>
                    )}
                  </article>
                ) : (
                  <div className="rounded-2xl border border-[#e6dfd3] bg-white p-8 text-sm text-[#51645d]">
                    Day-by-day itinerary details will be shared by our travel specialist on inquiry.
                  </div>
                )}
              </div>

              {/* Destination-Based Customization Locations Picker (Dharamshala, Dalhousie, Chandigarh, Amritsar, Tosh, etc.) */}
              {compatibleCustomizations.length > 0 && (
                <section
                  id="customization-locations"
                  aria-labelledby="custom-locations-heading"
                  className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 sm:p-7 shadow-[0_10px_30px_rgba(7,47,43,0.05)]"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-[#efe9de]">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c25132]">
                        Optional Add-On Destinations ({durationChip} + Custom)
                      </span>
                      <h2
                        id="custom-locations-heading"
                        className="mt-1 font-serif text-2xl font-medium text-[#072f2b]"
                      >
                        Customization Locations
                      </h2>
                      <p className="mt-1 text-xs text-[#51645d]">
                        Add extra Himachal &amp; Punjab stops below Day 1–{packageItem.itinerary.length}. Each added stop extends your route in real time.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f4efe7] px-3 py-1 text-xs font-bold text-[#072f2b]">
                      {selectedCustomStops.length} selected
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {compatibleCustomizations.map((stop, idx) => {
                      const isAdded = selectedCustomIds.includes(stop.id)
                      return (
                        <article
                          key={stop.id}
                          className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                            isAdded
                              ? 'border-[#ef4934] bg-[#fff8f6] shadow-sm ring-1 ring-[#ef4934]/30'
                              : 'border-[#e6dfd3] bg-[#fbfaf7] hover:border-[#0b4941]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c25132]">
                                  Customization {idx + 1}: {stop.name}
                                </span>
                                <h3 className="mt-0.5 font-serif text-lg font-medium text-[#072f2b]">
                                  {stop.name}
                                </h3>
                              </div>
                              <span className="shrink-0 rounded-full bg-[#072f2b] px-2.5 py-0.5 text-[10px] font-bold text-white">
                                +{stop.extraDays}D / +{stop.extraNights}N
                              </span>
                            </div>

                            {stop.subtitle && (
                              <p className="mt-1 text-xs text-[#51645d]">
                                {stop.subtitle}
                              </p>
                            )}

                            {!!stop.highlights?.length && (
                              <ul className="mt-3 space-y-1">
                                {stop.highlights.slice(0, 3).map((hl, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-1.5 text-[11px] text-[#384e49]"
                                  >
                                    <Icon
                                      name="check"
                                      size={12}
                                      className="mt-0.5 shrink-0 text-[#0b4941]"
                                    />
                                    <span>{hl}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#eae2d3] flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#072f2b]">
                              {stop.priceDelta && stop.priceDelta > 0
                                ? `+${formatPrice(stop.priceDelta, currency)}`
                                : 'Custom quote'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCustomStop(stop.id)}
                              aria-pressed={isAdded}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                                isAdded
                                  ? 'bg-[#072f2b] text-white hover:bg-[#ef4934]'
                                  : 'bg-[#ef4934] text-white hover:bg-[#d83e2a]'
                              }`}
                            >
                              <Icon name={isAdded ? 'check' : 'plus'} size={13} />
                              <span>{isAdded ? 'Added ✓' : '+ Add'}</span>
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* TAB 2: INCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="rounded-[24px] border border-[#d6e7dc] bg-white p-6 shadow-xs">
                  <h2 className="font-serif text-xl font-medium text-[#072f2b] flex items-center gap-2 mb-4">
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-600 text-white text-xs">
                      <Icon name="check" size={14} />
                    </span>
                    What’s Included
                  </h2>
                  <ul className="space-y-2.5">
                    {packageItem.inclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 p-3 text-xs leading-relaxed text-[#173631]"
                      >
                        <Icon
                          name="check"
                          size={14}
                          className="mt-0.5 shrink-0 text-emerald-700"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-[24px] border border-[#f2dcd8] bg-white p-6 shadow-xs">
                  <h2 className="font-serif text-xl font-medium text-[#072f2b] flex items-center gap-2 mb-4">
                    <span className="grid size-7 place-items-center rounded-full bg-[#ef4934] text-white text-xs">
                      <Icon name="x" size={14} />
                    </span>
                    What’s Excluded
                  </h2>
                  <ul className="space-y-2.5">
                    {packageItem.exclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl bg-rose-50/45 border border-rose-100 p-3 text-xs leading-relaxed text-[#465c55]"
                      >
                        <Icon
                          name="x"
                          size={14}
                          className="mt-0.5 shrink-0 text-[#c25132]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {!!packageItem.thingsToCarry?.length && (
                <section className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 shadow-xs">
                  <h2 className="font-serif text-xl font-medium text-[#072f2b] flex items-center gap-2 mb-4">
                    <Icon name="compass" size={18} className="text-[#ef4934]" />
                    Things to Carry
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {packageItem.thingsToCarry.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl border border-[#ece6da] bg-[#fbfaf7] p-3 text-xs font-medium text-[#173631]"
                      >
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#ef4934]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {!!packageItem.cancellationPolicy?.length && (
                <section className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 shadow-xs">
                  <h2 className="font-serif text-xl font-medium text-[#072f2b] flex items-center gap-2 mb-4">
                    <Icon name="shield" size={18} className="text-[#0b4941]" />
                    Cancellation &amp; Booking Policy
                  </h2>
                  <ul className="space-y-2">
                    {packageItem.cancellationPolicy.map((line, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl bg-[#f9f4eb] border border-[#eadfce] p-3 text-xs leading-relaxed text-[#384e49]"
                      >
                        <span className="font-bold text-[#c25132]">{idx + 1}.</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* TAB 3: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <section className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <span className="kicker">Journey Overview</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#072f2b]">
                  {packageItem.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#384e49] whitespace-pre-line">
                  {packageItem.summary || packageItem.overview}
                </p>
                {packageItem.summary &&
                  packageItem.overview &&
                  packageItem.summary !== packageItem.overview && (
                    <p className="text-xs leading-relaxed text-[#51645d] whitespace-pre-line pt-2 border-t border-[#efe9de]">
                      {packageItem.overview}
                    </p>
                  )}
              </section>

              <section className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                  <div>
                    <span className="kicker">Transparent Rate Card</span>
                    <h2 className="font-serif text-2xl font-medium text-[#072f2b] mt-1">
                      Off-Season vs Season Pricing
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#f3e9d8] px-3 py-1 text-xs font-bold text-[#072f2b]">
                    {perUnitLabel}
                    {minPax ? ` · Min ${minPax} Pax` : ''}
                  </span>
                </div>

                {tiers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[#e6dfd3] text-[11px] uppercase tracking-wider text-[#51645d]">
                          <th className="py-3 pr-4 font-bold">Hotel Tier</th>
                          <th className="py-3 px-4 font-bold">
                            Off-Season
                            {packageItem.pricingTiers?.offSeasonDates && (
                              <span className="block font-normal normal-case text-[10px] text-[#6f817c]">
                                {packageItem.pricingTiers.offSeasonDates}
                              </span>
                            )}
                          </th>
                          <th className="py-3 pl-4 font-bold">
                            Peak Season
                            {packageItem.pricingTiers?.seasonDates && (
                              <span className="block font-normal normal-case text-[10px] text-[#6f817c]">
                                {packageItem.pricingTiers.seasonDates}
                              </span>
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0ebe0]">
                        {tiers.map((tier) => (
                          <tr key={tier.name} className="hover:bg-[#fbfaf7]">
                            <td className="py-3.5 pr-4 font-bold text-[#072f2b]">
                              {tier.name}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#0b4941]">
                              {formatPrice(tier.offSeasonPrice, currency)}
                            </td>
                            <td className="py-3.5 pl-4 font-bold text-[#c25132]">
                              {formatPrice(tier.seasonPrice, currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#fbfaf7] border border-[#ece6da] p-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#51645d]">
                      Standard Package Tariff ({perUnitLabel})
                    </span>
                    <strong className="text-xl font-bold text-[#072f2b]">
                      {formatPrice(packageItem.priceNum, currency)}
                    </strong>
                  </div>
                )}
              </section>

              {!!packageItem.highlights?.length && (
                <section className="rounded-[24px] border border-[#e6dfd3] bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="font-serif text-2xl font-medium text-[#072f2b] mb-4">
                    Route Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {packageItem.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-xl bg-[#fbfaf7] border border-[#ece6da] p-3.5 text-xs font-medium text-[#173631]"
                      >
                        <Icon
                          name="check"
                          size={15}
                          className="mt-0.5 shrink-0 text-[#ef4934]"
                        />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="rounded-[24px] bg-[#072f2b] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffd0c7]">
                    Ready to lock dates?
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-normal text-white">
                    Reserve {packageItem.title} ({totalDurationLabel})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onBook(customizedBookingTitle, finalPrice)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#ef4934] px-6 py-3 text-sm font-bold text-white hover:bg-[#d83e2a] shadow-lg"
                >
                  <span>Book for {formatPrice(finalPrice, currency)}</span>
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar Card */}
        <aside className="space-y-5 lg:sticky lg:top-[calc(var(--site-nav-height)+1.25rem)]">
          <div className="package-booking-panel rounded-[24px] border border-[#e2dcd0] bg-white p-6 shadow-[0_14px_38px_rgba(7,47,43,0.08)] space-y-5">
            {tiers.length > 0 && (
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#51645d] mb-2">
                  Travel Season
                </span>
                <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#f4efe7] p-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSeason('offSeason')}
                    aria-pressed={selectedSeason === 'offSeason'}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                      selectedSeason === 'offSeason'
                        ? 'bg-[#072f2b] text-white shadow-xs'
                        : 'text-[#465c55] hover:text-[#072f2b]'
                    }`}
                  >
                    Off-Season
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSeason('season')}
                    aria-pressed={selectedSeason === 'season'}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                      selectedSeason === 'season'
                        ? 'bg-[#ef4934] text-white shadow-xs'
                        : 'text-[#465c55] hover:text-[#072f2b]'
                    }`}
                  >
                    Peak Season
                  </button>
                </div>
                {(selectedSeason === 'offSeason'
                  ? packageItem.pricingTiers?.offSeasonDates
                  : packageItem.pricingTiers?.seasonDates) && (
                  <p className="mt-1.5 text-[11px] text-[#51645d]">
                    Dates:{' '}
                    <strong>
                      {selectedSeason === 'offSeason'
                        ? packageItem.pricingTiers?.offSeasonDates
                        : packageItem.pricingTiers?.seasonDates}
                    </strong>
                  </p>
                )}
              </div>
            )}

            {tiers.length > 0 && (
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#51645d] mb-2">
                  Select Package Tier
                </span>
                <div className="space-y-2">
                  {tiers.map((tier) => {
                    const tierPrice =
                      selectedSeason === 'season'
                        ? tier.seasonPrice || tier.offSeasonPrice
                        : tier.offSeasonPrice || tier.seasonPrice
                    const isSelected = activeTier?.name === tier.name
                    return (
                      <button
                        key={tier.name}
                        type="button"
                        onClick={() => setSelectedTierName(tier.name)}
                        aria-pressed={isSelected}
                        className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                          isSelected
                            ? 'border-[#072f2b] bg-[#072f2b]/5 ring-1 ring-[#072f2b]'
                            : 'border-[#e6dfd3] bg-[#fbfaf7] hover:border-[#0b4941]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#ef4934] bg-[#ef4934]'
                                : 'border-[#9ab0a8]'
                            }`}
                          >
                            {isSelected && (
                              <span className="size-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <span className="text-xs font-bold text-[#072f2b]">
                            {tier.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#0b4941]">
                          {formatPrice(tierPrice, currency)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Customized Route Summary Badge in Sidebar */}
            {selectedCustomStops.length > 0 && (
              <div className="rounded-xl border border-dashed border-[#ef4934]/50 bg-[#fff8f6] p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#c25132]">
                  <span>Custom Route ({totalDurationLabel})</span>
                  <span>+{extraDays}D / +{extraNights}N</span>
                </div>
                <p className="font-semibold text-[#072f2b] leading-snug">
                  {notepadFormula}
                </p>
              </div>
            )}

            {/* Live Dynamically Updated Price */}
            <div className="pt-3 pb-4 border-y border-[#efe9de]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#51645d]">
                  {activeTier ? `${activeTier.name} · ` : ''}
                  {perUnitLabel}
                </span>
                {minPax && (
                  <span className="rounded-full bg-[#f3e9d8] px-2.5 py-0.5 text-[10px] font-bold text-[#072f2b]">
                    Min {minPax} Pax
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-baseline gap-2.5">
                <span className="package-booking-price text-[#072f2b]">
                  {formatPrice(finalPrice, currency)}
                </span>
                {packageItem.originalPrice && selectedCustomStops.length === 0 && (
                  <del className="text-xs text-[#73827e]">
                    {packageItem.originalPrice}
                  </del>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#51645d]">
                {extraPriceDelta > 0
                  ? `Includes ${formatPrice(activePrice, currency)} base + ${formatPrice(extraPriceDelta, currency)} custom stops.`
                  : 'Includes stays, transfers, sightseeing & 24/7 Telugu CC.'}
              </p>
            </div>

            {/* Book, WhatsApp & Customize Stops Below CTA */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onBook(customizedBookingTitle, finalPrice)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ef4934] px-4 text-sm font-bold text-white shadow-md shadow-[#ef4934]/25 hover:bg-[#d83e2a]"
              >
                <Icon name="calendar" size={17} className="shrink-0" />
                <span>Book / Request Quote</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#072f2b] px-4 text-xs font-bold text-white hover:bg-[#0b4941] transition-colors"
              >
                <Icon name="whatsapp" size={16} />
                <span>WhatsApp This Route</span>
              </a>

              <button
                type="button"
                onClick={scrollToItinerary}
                className="min-h-11 w-full rounded-xl border border-[#c4d6cc] px-3 text-center text-xs font-bold text-[#0b4941] hover:bg-[#0b4941]/5"
              >
                Customize Stops Below ↓
              </button>
            </div>

            {/* Callback Phone Form */}
            <div className="pt-4 border-t border-[#efe9de]">
              <div className="flex items-center gap-2 mb-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#072f2b] text-white">
                  <Icon name="phone" size={13} />
                </span>
                <div>
                  <h3 className="font-jakarta text-xs font-bold text-[#072f2b]">
                    Want us to call you?
                  </h3>
                  <p className="text-[11px] text-[#51645d]">
                    Get an instant callback in Telugu or English.
                  </p>
                </div>
              </div>

              {callbackSent ? (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 space-y-2"
                >
                  <p className="font-bold">Callback request received!</p>
                  <p>
                    Our specialist will call you shortly with {totalDurationLabel} availability.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCallbackSent(false)}
                    className="font-bold text-[#0b4941] underline"
                  >
                    Request another call
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-2 mt-2.5">
                  <input
                    type="text"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    placeholder="Your name (optional)"
                    aria-label="Your name"
                    maxLength={120}
                    className="inquiry-field text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      placeholder="Phone / WhatsApp no."
                      aria-label="Phone or WhatsApp number"
                      required
                      maxLength={30}
                      className="inquiry-field text-xs flex-1"
                    />
                    <button
                      type="submit"
                      disabled={callbackBusy}
                      className="shrink-0 rounded-xl bg-[#072f2b] px-3.5 text-xs font-bold text-white hover:bg-[#0b4941] disabled:opacity-60"
                    >
                      {callbackBusy ? 'Sending…' : 'Call Me'}
                    </button>
                  </div>
                  {callbackError && (
                    <p role="alert" className="text-[11px] font-semibold text-[#c25132]">
                      {callbackError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Category-Matched Instagram Video Reviews at Bottom */}
      <CategoryVideoReviews
        category={category}
        reels={displayReels}
        onOpenReel={(reel, index, filteredReels) =>
          onOpenStory?.(reel, index, filteredReels)
        }
        subtitle={`Real ${category.toLowerCase()} traveler reviews from @crazytourstravels. Click any video to watch in full screen.`}
      />

      {/* Lightbox / Carousel Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${packageItem.title} photo gallery`}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#041b18]/95 p-4 sm:p-8 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#ffd0c7]">
                  {packageItem.place} · {totalDurationLabel}
                </p>
                <h2 className="font-serif text-xl text-white">
                  {packageItem.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white/80">
                  {lightboxIndex + 1} / {mosaicPhotos.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="grid size-10 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
                  aria-label="Close gallery"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/40">
              <CatalogPhoto
                src={mosaicPhotos[lightboxIndex]}
                alt={`${packageItem.title} photo ${lightboxIndex + 1}`}
                className="w-full h-full object-contain"
              />
              {mosaicPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + mosaicPhotos.length) %
                          mosaicPhotos.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-black/60 text-white hover:bg-white hover:text-[#072f2b]"
                    aria-label="Previous photo"
                  >
                    <Icon name="chevron" size={20} className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % mosaicPhotos.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-black/60 text-white hover:bg-white hover:text-[#072f2b]"
                    aria-label="Next photo"
                  >
                    <Icon name="chevron" size={20} />
                  </button>
                </>
              )}
            </div>

            {mosaicPhotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
                {mosaicPhotos.map((photoUrl, idx) => (
                  <button
                    key={`${photoUrl}-${idx}`}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      idx === lightboxIndex
                        ? 'border-[#ef4934] opacity-100 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <CatalogPhoto
                      src={photoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
