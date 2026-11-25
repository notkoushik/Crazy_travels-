import React, { useMemo, useState } from 'react'
import { CatalogPhoto } from '../../../components/CatalogPhoto'
import { Icon } from '../../../components/Icon'
import { useDynamicStore } from '../../../services/dataStore'
import type { DestinationItem, PackageCategory, PackageItem } from '../../../types/travel'
import type { PackageCategoryFilter } from '../types'

interface PackagesTabProps {
  packages: PackageItem[]
  destinations?: DestinationItem[]
  onEditPackage: (pkg: PackageItem) => void
  onAddNewPackage: () => void
  onDeletePackage: (pkg: PackageItem) => void
}

const categoryTabs: readonly PackageCategoryFilter[] = [
  'All',
  'Couple',
  'Family',
  'Bachelors',
  'Adventure',
]

const categoryBadgeStyles: Record<PackageCategory, string> = {
  Couple: 'bg-rose-50 text-rose-700 border-rose-200',
  Family: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Bachelors: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Adventure: 'bg-amber-50 text-amber-800 border-amber-200',
}

export function PackagesTab({
  packages,
  destinations: providedDestinations,
  onEditPackage,
  onAddNewPackage,
  onDeletePackage,
}: PackagesTabProps) {
  const store = useDynamicStore()
  const destinations = providedDestinations ?? store.destinations

  const [categoryFilter, setCategoryFilter] = useState<PackageCategoryFilter>('All')
  const [destinationFilter, setDestinationFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  const destinationMap = useMemo(() => {
    const map = new Map<string, DestinationItem>()
    for (const dest of destinations) map.set(dest.slug, dest)
    return map
  }, [destinations])

  const destinationOptions = useMemo(() => {
    const seen = new Set<string>()
    const list: { slug: string; label: string }[] = []
    for (const dest of [...destinations].sort((a, b) => a.city.localeCompare(b.city))) {
      seen.add(dest.slug)
      list.push({ slug: dest.slug, label: `${dest.city}, ${dest.state}` })
    }
    for (const pkg of packages) {
      if (pkg.destinationSlug && !seen.has(pkg.destinationSlug)) {
        seen.add(pkg.destinationSlug)
        list.push({ slug: pkg.destinationSlug, label: pkg.destinationSlug })
      }
    }
    return list
  }, [destinations, packages])

  const categoryCounts = useMemo(() => {
    const counts: Record<PackageCategoryFilter, number> = {
      All: packages.length,
      Couple: 0,
      Family: 0,
      Bachelors: 0,
      Adventure: 0,
    }
    for (const pkg of packages) {
      if (pkg.category && pkg.category in counts) {
        counts[pkg.category] += 1
      }
    }
    return counts
  }, [packages])

  const filteredPackages = useMemo(() => {
    const q = search.trim().toLowerCase()
    return packages.filter((pkg) => {
      if (categoryFilter !== 'All' && pkg.category !== categoryFilter) return false
      if (destinationFilter !== 'All' && pkg.destinationSlug !== destinationFilter) return false
      if (!q) return true
      return (
        pkg.title.toLowerCase().includes(q) ||
        pkg.place.toLowerCase().includes(q) ||
        pkg.state.toLowerCase().includes(q) ||
        (pkg.routeSummary ?? '').toLowerCase().includes(q)
      )
    })
  }, [packages, categoryFilter, destinationFilter, search])

  return (
    <div className="space-y-6 max-w-7xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Tour Packages & Itineraries
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage handcrafted holiday packages, category variants, dynamic seasonal tiers, and day-by-day itineraries.
          </p>
        </div>
        <button
          onClick={onAddNewPackage}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Icon name="plus" size={14} /> Create New Package
        </button>
      </div>

      {/* Category & Destination Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
          {categoryTabs.map((cat) => {
            const active = categoryFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}{' '}
                <span className={active ? 'text-slate-300' : 'text-slate-400'}>
                  ({categoryCounts[cat]})
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by destination"
            value={destinationFilter}
            onChange={(event) => setDestinationFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-800"
          >
            <option value="All">All destinations</option>
            {destinationOptions.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="search"
            aria-label="Search packages"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, place, route…"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-800 w-52"
          />
        </div>
      </div>

      {/* Packages Table */}
      <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider font-inter-tight">
              <tr>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Duration & Route</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Days in Itinerary</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-4 text-center text-slate-500">
                    No packages match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => {
                  const linkedDest = pkg.destinationSlug
                    ? destinationMap.get(pkg.destinationSlug)
                    : undefined
                  const hasTiers = Boolean(pkg.pricingTiers?.tiers?.length)
                  return (
                    <tr key={pkg.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <CatalogPhoto
                            src={pkg.image}
                            alt={pkg.title}
                            className="w-11 h-11 rounded-lg object-cover flex-none border border-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 text-sm font-inter-tight">
                              {pkg.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {pkg.category && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                    categoryBadgeStyles[pkg.category]
                                  }`}
                                >
                                  {pkg.category}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/70">
                                {pkg.theme}
                              </span>
                              {pkg.brochurePdfUrl && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
                                  PDF
                                </span>
                              )}
                              {hasTiers && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
                                  Tiered
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {pkg.place}, {pkg.state}
                        </div>
                        {linkedDest ? (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                            Linked: {linkedDest.city}
                          </span>
                        ) : pkg.destinationSlug ? (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Slug: {pkg.destinationSlug}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">{pkg.duration}</div>
                        {pkg.routeSummary && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{pkg.routeSummary}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-slate-900">
                          ₹{pkg.priceNum.toLocaleString('en-IN')}
                        </div>
                        {pkg.pricingTiers?.perUnit && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {pkg.pricingTiers.perUnit}
                            {pkg.pricingTiers.minPax ? ` · Min ${pkg.pricingTiers.minPax} pax` : ''}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {pkg.itinerary?.length || 0} Days
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditPackage(pkg)}
                            className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <Icon name="edit" size={13} /> Edit
                          </button>
                          <button
                            onClick={() => onDeletePackage(pkg)}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete package"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
