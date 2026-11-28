import React, { useState } from 'react'
import {
  BoardFeatureItem,
  BrandPillarItem,
  SectionHeaderItem,
  SpecialItem,
  StorefrontConfig,
  TrustStatsItem,
} from '../../../services/dataStore'
import {
  DestinationItem,
  PackageItem,
  ReviewItem,
  RouteName,
  StayItem,
} from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { ImageDropzone } from '../../../components/ImageDropzone'
import { CatalogPhoto } from '../../../components/CatalogPhoto'

interface StorefrontStudioPageProps {
  storefront: StorefrontConfig
  destinations: DestinationItem[]
  packages: PackageItem[]
  stays: StayItem[]
  reviews: ReviewItem[]
  onSaveSpecial: (slotIndex: number, updates: Partial<SpecialItem>) => Promise<void>
  onSaveBoardFeature: (updates: Partial<BoardFeatureItem>) => Promise<void>
  onSaveBrandPillars: (stageImage: string, pillars: BrandPillarItem[]) => Promise<void>
  onSaveTrustStats: (updates: Partial<TrustStatsItem>) => Promise<void>
  onSaveSectionHeader: (sectionKey: string, header: SectionHeaderItem) => Promise<void>
  onSaveCuratedSelection: (curations: {
    trendingDestinations?: Array<{ slug: string; isTrending: boolean; displayOrder: number }>
    soulfulPackages?: Array<{ id: string; featured: boolean; homeSpotlightOrder: number }>
    featuredStays?: Array<{ id: string; isHomeFeatured: boolean; homeDisplayOrder: number }>
  }) => Promise<void>
  onToast: (msg: string) => void
  navigate: (route: RouteName) => void
}

type StudioSection = 'hero' | 'trending' | 'customization' | 'soul' | 'board' | 'stays' | 'pillars' | 'stats'

const HERO_VIDEO_PRESETS = [
  {
    label: 'Kedarnath Temple & Snow Peaks (16:9 HD)',
    videoUrl: '/Video/optimized/destination_kedarnath.mp4',
    posterUrl: '/Video/optimized/destination_kedarnath_poster.jpg',
  },
  {
    label: 'Himachal Pine Valleys & Mountains (16:9 HD)',
    videoUrl: '/Video/optimized/destination_himachal.mp4',
    posterUrl: '/Video/optimized/destination_himachal_poster.jpg',
  },
  {
    label: 'Slow Travel Scenic Train Journey (16:9 HD)',
    videoUrl: '/Video/optimized/destination_slow_travel.mp4',
    posterUrl: '/Video/optimized/destination_slow_travel_poster.jpg',
  },
  {
    label: 'Golden Peaks & Alpenglow (16:9 HD)',
    videoUrl: '/Video/optimized/destination_golden_peaks.mp4',
    posterUrl: '/Video/optimized/destination_golden_peaks_poster.jpg',
  },
  {
    label: 'Sikkim Kanchenjunga Sunrise (16:9 HD)',
    videoUrl: '/Video/optimized/destination_sikkim.mp4',
    posterUrl: '/Video/optimized/destination_sikkim_poster.jpg',
  },
  {
    label: 'Ladakh High Passes & Monasteries (16:9 HD)',
    videoUrl: '/Video/optimized/destination_ladakh.mp4',
    posterUrl: '/Video/optimized/destination_ladakh_poster.jpg',
  },
  {
    label: 'Kashmir Snow Ridge & Pine Valley (16:9 HD)',
    videoUrl: '/Video/optimized/destination_kashmir.mp4',
    posterUrl: '/Video/optimized/destination_kashmir_poster.jpg',
  },
  {
    label: 'Kerala Munnar Tea Trails',
    videoUrl: '/Video/optimized/destination_kerala.mp4',
    posterUrl: '/Video/optimized/destination_kerala_poster.jpg',
  },
]

export function StorefrontStudioPage({
  storefront,
  destinations,
  packages,
  stays,
  reviews,
  onSaveSpecial,
  onSaveBoardFeature,
  onSaveBrandPillars,
  onSaveTrustStats,
  onSaveSectionHeader,
  onSaveCuratedSelection,
  onToast,
  navigate,
}: StorefrontStudioPageProps) {
  const [activeSection, setActiveSection] = useState<StudioSection>('hero')
  const [saving, setSaving] = useState(false)

  // Section 1: Specials State
  const [selectedSpecialIndex, setSelectedSpecialIndex] = useState(1)
  const activeSpecial = storefront.specials.find((s) => s.slotIndex === selectedSpecialIndex) || storefront.specials[0]
  const [specialForm, setSpecialForm] = useState<Partial<SpecialItem>>({})

  // Section 2: Trending Destinations State
  const [trendingItems, setTrendingItems] = useState(
    destinations.map((d) => ({
      slug: d.slug,
      city: d.city,
      country: d.country,
      image: d.image,
      isTrending: d.isTrending !== false,
      displayOrder: d.displayOrder || 0,
      price: d.price,
    }))
  )

  // Section 3: Soulful Packages State
  const initialSoulPackages = packages
    .filter((p) => p.featured)
    .sort((a, b) => ((a as any).homeSpotlightOrder || 0) - ((b as any).homeSpotlightOrder || 0))
    .slice(0, 3)
    .map((p) => p.id)

  const [soulPackageIds, setSoulPackageIds] = useState<string[]>([
    initialSoulPackages[0] || packages[0]?.id || '',
    initialSoulPackages[1] || packages[1]?.id || '',
    initialSoulPackages[2] || packages[2]?.id || '',
  ])

  // Section 4: Board Feature State
  const [boardForm, setBoardForm] = useState<Partial<BoardFeatureItem>>(
    storefront.boardFeature || {
      kicker: 'Selected with local experts',
      sectionTitle: 'Travel boards recommend',
      partnerBadge: 'In partnership with local storytellers',
      headline: 'Hampi, beyond the monuments',
      description: 'Riverside walks, ancient stories and boulder-lit sunsets—discover Karnataka at a gentler pace.',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=88',
      actionRoute: 'destination/hampi',
      actionLabel: 'Explore Hampi',
    }
  )

  // Section 5: Featured Stays State
  const [stayItems, setStayItems] = useState(
    stays.map((s) => ({
      id: s.id,
      name: s.name,
      city: s.city,
      type: s.type,
      image: s.image,
      price: s.price,
      isHomeFeatured: (s as any).isHomeFeatured ?? true,
      homeDisplayOrder: (s as any).homeDisplayOrder ?? 0,
    }))
  )

  // Section 6: Brand Pillars State
  const [stageImage, setStageImage] = useState(
    storefront.brandPillars[0]?.stageImage || 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1500&q=85'
  )
  const [pillars, setPillars] = useState<BrandPillarItem[]>(storefront.brandPillars)

  // Section 7: Trust Stats State
  const [statsForm, setStatsForm] = useState<Partial<TrustStatsItem>>(
    storefront.trustStats || {
      stat1Value: '18',
      stat1Label: 'years exploring',
      stat2Value: '28',
      stat2Label: 'states explored',
      stat3Value: '24k',
      stat3Label: 'journeys planned',
      stat4Value: '4.9',
      stat4Label: 'average traveller rating',
    }
  )

  // Header Forms (Kickers & Titles)
  const [headers, setHeaders] = useState<Record<string, SectionHeaderItem>>(storefront.sectionHeaders)

  // Sync state if active special slot changes
  const handleSelectSpecialSlot = (slot: number) => {
    setSelectedSpecialIndex(slot)
    const target = storefront.specials.find((s) => s.slotIndex === slot)
    setSpecialForm(target ? { ...target } : {})
  }

  // Save Handlers
  const handleSaveHero = async () => {
    try {
      setSaving(true)
      await onSaveSectionHeader('hero', headers.hero || {
        kicker: 'Travel with a local touch',
        title: 'Crazy Tours Travel',
        subtitle: 'Handcrafted journeys across India and beyond',
      })
      await onSaveSectionHeader('hero_video', headers.hero_video || {
        kicker: '/Video/optimized/destination_kedarnath.mp4',
        title: '/Video/optimized/destination_kedarnath_poster.jpg',
        subtitle: 'Hero Scenic Video',
      })
      onToast('Hero Video & Brand Banner saved to database!')
    } catch (e: any) {
      onToast(e.message || 'Failed to save hero banner')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSpecial = async () => {
    try {
      setSaving(true)
      await onSaveSpecial(selectedSpecialIndex, specialForm)
      onToast(`Customization Card #${selectedSpecialIndex} saved successfully!`)
    } catch (e: any) {
      onToast(e.message || 'Failed to save customization card')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBoardFeature = async () => {
    try {
      setSaving(true)
      await onSaveBoardFeature(boardForm)
      onToast('Travel Boards Recommend feature banner updated!')
    } catch (e: any) {
      onToast(e.message || 'Failed to save board feature')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveBrandPillars = async () => {
    try {
      setSaving(true)
      await onSaveBrandPillars(stageImage, pillars)
      onToast('Brand value pillars updated!')
    } catch (e: any) {
      onToast(e.message || 'Failed to save brand pillars')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTrustStats = async () => {
    try {
      setSaving(true)
      await onSaveTrustStats(statsForm)
      onToast('Milestone statistics updated!')
    } catch (e: any) {
      onToast(e.message || 'Failed to save trust stats')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTrendingOrder = async () => {
    try {
      setSaving(true)
      await onSaveCuratedSelection({
        trendingDestinations: trendingItems.map((item) => ({
          slug: item.slug,
          isTrending: item.isTrending,
          displayOrder: Number(item.displayOrder),
        })),
      })
      onToast('Trending destinations order saved!')
    } catch (e: any) {
      onToast(e.message || 'Failed to save trending order')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSoulPackages = async () => {
    try {
      setSaving(true)
      const selections = packages.map((pkg) => {
        const slotIdx = soulPackageIds.indexOf(pkg.id)
        return {
          id: pkg.id,
          featured: slotIdx !== -1,
          homeSpotlightOrder: slotIdx !== -1 ? slotIdx + 1 : 0,
        }
      })
      await onSaveCuratedSelection({ soulfulPackages: selections })
      onToast('Journeys With Soul spotlight packages updated!')
    } catch (e: any) {
      onToast(e.message || 'Failed to update soulful packages')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFeaturedStays = async () => {
    try {
      setSaving(true)
      await onSaveCuratedSelection({
        featuredStays: stayItems.map((s) => ({
          id: s.id,
          isHomeFeatured: s.isHomeFeatured,
          homeDisplayOrder: Number(s.homeDisplayOrder),
        })),
      })
      onToast('Homepage featured stays updated!')
    } catch (e: any) {
      onToast(e.message || 'Failed to save featured stays')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveHeader = async (key: string) => {
    try {
      setSaving(true)
      await onSaveSectionHeader(key, headers[key] || { title: '' })
      onToast(`Section header for "${key}" updated!`)
    } catch (e: any) {
      onToast(e.message || 'Failed to update header')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
                <Icon name="sparkle" size={12} className="text-amber-500" />
                Storefront Merchandising Suite
              </span>
              <span className="text-xs text-slate-400">● 8 Modules</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
              Storefront Experience Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Centralized control room for all customer-facing homepage sections. Every edit made here updates PostgreSQL and updates the live website instantly.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => navigate('home')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Icon name="eye" size={14} />
              <span>Preview Live Site</span>
            </button>
          </div>
        </div>

        {/* Section Quick Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {[
            { id: 'hero', label: 'Hero Video & Banner', icon: 'video' },
            { id: 'trending', label: 'Trending Destinations', icon: 'map' },
            { id: 'customization', label: 'We Offer Customization (4)', icon: 'sparkle' },
            { id: 'soul', label: 'Recommended Packages (3)', icon: 'compass' },
            { id: 'board', label: 'Travel Boards Recommend', icon: 'fileText' },
            { id: 'stays', label: 'Boutique Hotel Stays', icon: 'hotel' },
            { id: 'pillars', label: 'Brand Value Pillars (4)', icon: 'shield' },
            { id: 'stats', label: 'Trust Stats & Reviews', icon: 'star' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as StudioSection)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSection === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon name={item.icon as any} size={14} className={activeSection === item.id ? 'text-amber-400' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HERO SCENIC VIDEO & BRAND BANNER */}
      {/* ======================================================== */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="video" size={16} className="text-[#ef4934]" />
                  <span>Module 1: Hero Scenic Video &amp; Brand Banner</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the top rolling video, eyebrow, brand headline, and subtitle shown on the left side of the homepage hero.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveHero}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Hero Banner'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Preset Hero Video</label>
                  <select
                    value={headers.hero_video?.kicker || '/Video/optimized/destination_kedarnath.mp4'}
                    onChange={(e) => {
                      const preset = HERO_VIDEO_PRESETS.find((p) => p.videoUrl === e.target.value)
                      setHeaders((prev) => ({
                        ...prev,
                        hero_video: {
                          kicker: e.target.value,
                          title: preset?.posterUrl || prev.hero_video?.title || '/Video/optimized/destination_kedarnath_poster.jpg',
                          subtitle: preset?.label || 'Custom Hero Video',
                        },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {HERO_VIDEO_PRESETS.map((preset) => (
                      <option key={preset.videoUrl} value={preset.videoUrl}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hero Video URL (MP4)</label>
                  <input
                    type="text"
                    value={headers.hero_video?.kicker ?? '/Video/optimized/destination_kedarnath.mp4'}
                    onChange={(e) =>
                      setHeaders((prev) => ({
                        ...prev,
                        hero_video: {
                          ...(prev.hero_video || { title: '/Video/optimized/destination_kedarnath_poster.jpg' }),
                          kicker: e.target.value,
                        },
                      }))
                    }
                    placeholder="/Video/optimized/destination_kedarnath.mp4"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hero Poster Image URL</label>
                  <input
                    type="text"
                    value={headers.hero_video?.title ?? '/Video/optimized/destination_kedarnath_poster.jpg'}
                    onChange={(e) =>
                      setHeaders((prev) => ({
                        ...prev,
                        hero_video: {
                          ...(prev.hero_video || { kicker: '/Video/optimized/destination_kedarnath.mp4' }),
                          title: e.target.value,
                        },
                      }))
                    }
                    placeholder="/Video/optimized/destination_kedarnath_poster.jpg"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Eyebrow Line</label>
                  <input
                    type="text"
                    value={headers.hero?.kicker ?? 'Travel with a local touch'}
                    onChange={(e) =>
                      setHeaders((prev) => ({
                        ...prev,
                        hero: { ...(prev.hero || { title: 'Crazy Tours Travel' }), kicker: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Main Brand Headline</label>
                  <input
                    type="text"
                    value={headers.hero?.title ?? 'Crazy Tours Travel'}
                    onChange={(e) =>
                      setHeaders((prev) => ({
                        ...prev,
                        hero: { ...(prev.hero || {}), title: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={headers.hero?.subtitle ?? 'Handcrafted journeys across India and beyond'}
                    onChange={(e) =>
                      setHeaders((prev) => ({
                        ...prev,
                        hero: { ...(prev.hero || { title: 'Crazy Tours Travel' }), subtitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Live Video Preview */}
              <div className="space-y-2">
                <span className="block text-slate-700 font-semibold">Live Hero Background Preview</span>
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-md border border-slate-200">
                  <video
                    key={headers.hero_video?.kicker || '/Video/optimized/destination_kedarnath.mp4'}
                    src={headers.hero_video?.kicker || '/Video/optimized/destination_kedarnath.mp4'}
                    poster={headers.hero_video?.title || '/Video/optimized/destination_kedarnath_poster.jpg'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute inset-y-0 left-0 p-5 flex flex-col justify-center text-white max-w-xs">
                    <span className="text-[10px] font-semibold tracking-wider text-emerald-100 uppercase mb-1">
                      {headers.hero?.kicker || 'Travel with a local touch'}
                    </span>
                    <h3 className="text-2xl font-bold leading-tight mb-1">
                      {headers.hero?.title || 'Crazy Tours Travel'}
                    </h3>
                    <p className="text-xs text-white/85">
                      {headers.hero?.subtitle || 'Handcrafted journeys across India and beyond'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. WE OFFER CUSTOMIZATION (4 BENTO GROUP CARDS) */}
      {/* ======================================================== */}
      {activeSection === 'customization' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="sparkle" size={16} className="text-[#ef4934]" />
                  <span>Module 3: We Offer Customization (4-Card Bento Showcase)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit the 4 traveler-group customization cards shown below Trending Destinations (Romantic Escapes, Family Holidays, Bachelors’ Trips, Adventure Picks).
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveHeader('customization')}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>Save Section Heading</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200/70">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Section Kicker</label>
                <input
                  type="text"
                  value={headers.customization?.kicker ?? 'CURATED CUSTOMIZATION'}
                  onChange={(e) =>
                    setHeaders((prev) => ({
                      ...prev,
                      customization: { ...(prev.customization || { title: 'We offer customization' }), kicker: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={headers.customization?.subtitle ?? 'Crazy Tours offers curated, tailor-made journeys for couples, families, friends, and adventure seekers.'}
                  onChange={(e) =>
                    setHeaders((prev) => ({
                      ...prev,
                      customization: { ...(prev.customization || { title: 'We offer customization' }), subtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>
            </div>

            {/* 4-Slot Bento Selector Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { slot: 1, type: 'Tall Card (Left)', fallback: 'Romantic Escapes' },
                { slot: 2, type: 'Tall Card (Middle)', fallback: 'Family Holidays' },
                { slot: 3, type: 'Compact (Top Right)', fallback: 'Bachelors’ Trips' },
                { slot: 4, type: 'Compact (Bottom Right)', fallback: 'Adventure Picks' },
              ].map((s) => {
                const sp = storefront.specials.find((x) => x.slotIndex === s.slot)
                const isSelected = selectedSpecialIndex === s.slot
                return (
                  <button
                    key={s.slot}
                    type="button"
                    onClick={() => handleSelectSpecialSlot(s.slot)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#ef4934] ring-2 ring-[#ef4934]/15 bg-[#ef4934]/5 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">Card {s.slot}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{s.type}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {sp?.title || s.fallback}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {sp?.badge || 'No badge'}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Editor form for selected slot */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Editing Customization Card #{selectedSpecialIndex}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Badge Pill Label</label>
                  <input
                    type="text"
                    value={specialForm.badge ?? activeSpecial?.badge ?? ''}
                    onChange={(e) => setSpecialForm((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. ROMANTIC ESCAPES"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Card Headline</label>
                  <input
                    type="text"
                    value={specialForm.title ?? activeSpecial?.title ?? ''}
                    onChange={(e) => setSpecialForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Romantic Escapes"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Short Subtitle</label>
                  <textarea
                    rows={2}
                    value={specialForm.description ?? activeSpecial?.description ?? ''}
                    onChange={(e) => setSpecialForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g. Handpicked destinations for two."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Custom Trip Travel Style Target</label>
                  <select
                    value={specialForm.actionRoute ?? activeSpecial?.actionRoute ?? 'Romantic / Honeymoon'}
                    onChange={(e) => setSpecialForm((prev) => ({ ...prev, actionRoute: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Romantic / Honeymoon">Romantic / Honeymoon</option>
                    <option value="Family with Kids">Family with Kids</option>
                    <option value="Friends & Bachelors Group">Friends &amp; Bachelors Group</option>
                    <option value="Adventure & Mountain Trails">Adventure &amp; Mountain Trails</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <ImageDropzone
                    label="Primary Card Photo"
                    value={specialForm.image ?? activeSpecial?.image ?? ''}
                    onChange={(url) => setSpecialForm((prev) => ({ ...prev, image: url }))}
                    helperText="Upload a high-resolution photo or paste a path like /catalog-photos/groups/couple.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveSpecial}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Icon name="check" size={14} />
                  <span>{saving ? 'Saving...' : `Save Card #${selectedSpecialIndex}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TRENDING DESTINATIONS (FORT ARCH SILHOUETTE) */}
      {/* ======================================================== */}
      {activeSection === 'trending' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="map" size={16} className="text-[#ef4934]" />
                  <span>Module 2: Trending Destinations Spotlight</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control which destinations appear in the iconic Rajasthan Fort Arch carousel and set display order.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveTrendingOrder}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Trending Order'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingItems.map((item, idx) => (
                <div
                  key={item.slug}
                  className={`rounded-xl border p-4 transition-all flex flex-col justify-between gap-3 ${
                    item.isTrending ? 'border-slate-300 bg-white shadow-2xs' : 'border-slate-200 bg-slate-50/70 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 relative">
                      <CatalogPhoto src={item.image} alt={item.city} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {item.country}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.city}</h4>
                      <p className="text-xs text-slate-500 font-medium">From {item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isTrending}
                        onChange={(e) => {
                          const updated = [...trendingItems]
                          updated[idx].isTrending = e.target.checked
                          setTrendingItems(updated)
                        }}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="font-medium text-slate-700">Pin to Carousel</span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[11px]">Rank:</span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={item.displayOrder}
                        onChange={(e) => {
                          const updated = [...trendingItems]
                          updated[idx].displayOrder = parseInt(e.target.value) || 0
                          setTrendingItems(updated)
                        }}
                        className="w-12 px-2 py-1 rounded border border-slate-200 text-center text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. JOURNEYS WITH SOUL (3 SPOTLIGHT TOUR PACKAGES) */}
      {/* ======================================================== */}
      {activeSection === 'soul' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="compass" size={16} className="text-[#ef4934]" />
                  <span>Module 4: Recommended Packages (3 Spotlight Trips)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick the 3 featured tour packages highlighted in the editorial homepage section.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveSoulPackages}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Spotlight Trips'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((slotIdx) => {
                const selectedPkg = packages.find((p) => p.id === soulPackageIds[slotIdx])
                return (
                  <div key={slotIdx} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Spotlight Slot #{slotIdx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 font-semibold text-slate-700">
                        {slotIdx === 0 ? 'Primary Feature' : slotIdx === 1 ? 'Secondary Feature' : 'Discovery Feature'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Select Tour Package</label>
                      <select
                        value={soulPackageIds[slotIdx] || ''}
                        onChange={(e) => {
                          const updated = [...soulPackageIds]
                          updated[slotIdx] = e.target.value
                          setSoulPackageIds(updated)
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.place} — {pkg.title} ({pkg.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedPkg && (
                      <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                        <div className="h-28 rounded-md overflow-hidden relative">
                          <CatalogPhoto src={selectedPkg.image} alt={selectedPkg.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                            {selectedPkg.duration}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{selectedPkg.title}</h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{selectedPkg.theme}</span>
                          <span className="font-bold text-slate-900">{selectedPkg.price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TRAVEL BOARDS RECOMMEND (HAMPI / EDITORIAL BANNER) */}
      {/* ======================================================== */}
      {activeSection === 'board' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="globe" size={16} className="text-[#ef4934]" />
                  <span>Module 4: Travel Boards Recommend (Editorial Partner Feature)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control the full-width panoramic partner editorial showcase banner.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveBoardFeature}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Board Feature'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Partner Attribution Badge</label>
                <input
                  type="text"
                  value={boardForm.partnerBadge || ''}
                  onChange={(e) => setBoardForm((prev) => ({ ...prev, partnerBadge: e.target.value }))}
                  placeholder="e.g. In partnership with local storytellers"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Editorial Headline</label>
                <input
                  type="text"
                  value={boardForm.headline || ''}
                  onChange={(e) => setBoardForm((prev) => ({ ...prev, headline: e.target.value }))}
                  placeholder="e.g. Hampi, beyond the monuments"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Story Teaser Paragraph</label>
                <textarea
                  rows={2}
                  value={boardForm.description || ''}
                  onChange={(e) => setBoardForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Riverside walks, ancient stories and boulder-lit sunsets—discover Karnataka at a gentler pace."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Explore Button Action Route</label>
                <input
                  type="text"
                  value={boardForm.actionRoute || ''}
                  onChange={(e) => setBoardForm((prev) => ({ ...prev, actionRoute: e.target.value }))}
                  placeholder="e.g. destination/hampi or stories"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Action Button Text</label>
                <input
                  type="text"
                  value={boardForm.actionLabel || ''}
                  onChange={(e) => setBoardForm((prev) => ({ ...prev, actionLabel: e.target.value }))}
                  placeholder="e.g. Explore Hampi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <ImageDropzone
                  label="Panoramic Landscape Backdrop Photo"
                  value={boardForm.image || ''}
                  onChange={(url) => setBoardForm((prev) => ({ ...prev, image: url }))}
                  helperText="Upload a high-res landscape photograph (1600x900px recommended)"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. BOUTIQUE HOTEL STAYS SHOWCASE */}
      {/* ======================================================== */}
      {activeSection === 'stays' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="hotel" size={16} className="text-[#ef4934]" />
                  <span>Module 5: Explore Boutique Hotel Stays</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select which verified heritage stays and luxury plantation villas are curated on the landing page.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveFeaturedStays}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Stays Curation'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {stayItems.map((stay, idx) => (
                <div
                  key={stay.id}
                  className={`rounded-xl border p-3 flex flex-col justify-between gap-2 transition-all ${
                    stay.isHomeFeatured ? 'border-slate-300 bg-white shadow-2xs' : 'border-slate-200 bg-slate-50/70 opacity-60'
                  }`}
                >
                  <div className="h-28 rounded-lg overflow-hidden border border-slate-100 relative">
                    <CatalogPhoto src={stay.image} alt={stay.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-semibold">
                      {stay.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{stay.city}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{stay.name}</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{stay.price}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stay.isHomeFeatured}
                        onChange={(e) => {
                          const updated = [...stayItems]
                          updated[idx].isHomeFeatured = e.target.checked
                          setStayItems(updated)
                        }}
                        className="rounded border-slate-300 text-slate-900"
                      />
                      <span className="text-[11px] text-slate-700 font-medium">Homepage</span>
                    </label>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 text-[10px]">Rank:</span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={stay.homeDisplayOrder}
                        onChange={(e) => {
                          const updated = [...stayItems]
                          updated[idx].homeDisplayOrder = parseInt(e.target.value) || 0
                          setStayItems(updated)
                        }}
                        className="w-10 px-1 py-0.5 rounded border border-slate-200 text-center text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. EXPERTLY PLANNED. GENUINELY PERSONAL. (4 PILLARS) */}
      {/* ======================================================== */}
      {activeSection === 'pillars' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="shield" size={16} className="text-[#ef4934]" />
                  <span>Module 6: Brand Value Pillars (&quot;Expertly planned. Genuinely personal.&quot;)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update the 4 core brand promises and the scenic stage backdrop.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveBrandPillars}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Brand Pillars'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <ImageDropzone
                label="Scenic Stage Backdrop Image"
                value={stageImage}
                onChange={setStageImage}
                helperText="Backdrop image rendered behind the 4 interactive cards"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {pillars.map((pillar, idx) => (
                  <div key={pillar.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold font-serif text-slate-900">
                        #{pillar.stepNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Pillar {idx + 1}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Headline</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => {
                          const updated = [...pillars]
                          updated[idx].title = e.target.value
                          setPillars(updated)
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={pillar.description}
                        onChange={(e) => {
                          const updated = [...pillars]
                          updated[idx].description = e.target.value
                          setPillars(updated)
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. WHY TRAVELLERS RETURN TO US (STATS & REVIEWS) */}
      {/* ======================================================== */}
      {activeSection === 'stats' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="star" size={16} className="text-[#ef4934]" />
                  <span>Module 7: Milestone Statistics &amp; Customer Reviews</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the 4 big trust metrics and review live customer testimonials.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveTrustStats}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Icon name="check" size={14} />
                <span>{saving ? 'Saving...' : 'Save Milestone Stats'}</span>
              </button>
            </div>

            {/* 4 Big Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { valKey: 'stat1Value', lblKey: 'stat1Label', defaultVal: '18', defaultLbl: 'years exploring' },
                { valKey: 'stat2Value', lblKey: 'stat2Label', defaultVal: '28', defaultLbl: 'states explored' },
                { valKey: 'stat3Value', lblKey: 'stat3Label', defaultVal: '24k', defaultLbl: 'journeys planned' },
                { valKey: 'stat4Value', lblKey: 'stat4Label', defaultVal: '4.9', defaultLbl: 'average traveller rating' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Stat #{idx + 1}</span>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Number / Value</label>
                    <input
                      type="text"
                      value={(statsForm as any)[item.valKey] ?? item.defaultVal}
                      onChange={(e) => setStatsForm((prev) => ({ ...prev, [item.valKey]: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-serif text-lg font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Label / Subtitle</label>
                    <input
                      type="text"
                      value={(statsForm as any)[item.lblKey] ?? item.defaultLbl}
                      onChange={(e) => setStatsForm((prev) => ({ ...prev, [item.lblKey]: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Live Testimonials Preview */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Live Customer Testimonials Preview ({reviews.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-3">&ldquo;{r.quote}&rdquo;</p>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <div>
                        <strong className="text-slate-900">{r.name}</strong>
                        <span className="block text-[10px] text-slate-400">{r.trip}</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {'★'.repeat(r.rating || 5)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
