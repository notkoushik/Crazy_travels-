import React from 'react'
import { PackageItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface PackagesTabProps {
  packages: PackageItem[]
  onEditPackage: (pkg: PackageItem) => void
  onAddNewPackage: () => void
  onDeletePackage: (pkg: PackageItem) => void
}

export function PackagesTab({
  packages,
  onEditPackage,
  onAddNewPackage,
  onDeletePackage,
}: PackagesTabProps) {
  return (
    <div className="space-y-6 max-w-7xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Tour Packages & Itineraries
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage handcrafted holiday packages, day-by-day itineraries, tier pricing, and inclusions.
          </p>
        </div>
        <button
          onClick={onAddNewPackage}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Icon name="plus" size={14} /> Create New Package
        </button>
      </div>

      {/* Packages Table */}
      <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider font-inter-tight">
              <tr>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Days in Itinerary</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-11 h-11 rounded-lg object-cover flex-none border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm font-inter-tight">
                          {pkg.title}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                          {pkg.theme}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {pkg.place}, {pkg.state}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{pkg.duration}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    ₹{pkg.priceNum.toLocaleString('en-IN')}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
