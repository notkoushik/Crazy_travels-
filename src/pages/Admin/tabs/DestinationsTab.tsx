import React from 'react'
import { DestinationItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface DestinationsTabProps {
  destinations: DestinationItem[]
  onEditDestination: (dest: DestinationItem) => void
  onAddNewDestination: () => void
  onDeleteDestination: (dest: DestinationItem) => void
}

export function DestinationsTab({
  destinations,
  onEditDestination,
  onAddNewDestination,
  onDeleteDestination,
}: DestinationsTabProps) {
  return (
    <div className="space-y-6 max-w-7xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Destinations & Fort Window Spotlight
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage the trending destinations featured on the homepage in the iconic Rajasthan fort window arch design.
          </p>
        </div>
        <button
          onClick={onAddNewDestination}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Icon name="plus" size={14} /> Add New Destination
        </button>
      </div>

      {/* Destinations Grid with Arch Silhouette Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, idx) => (
          <div
            key={dest.slug}
            className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              {/* Mini Arch Window Preview */}
              <div className="w-20 h-28 flex-none rounded-t-[40px] rounded-b-lg overflow-hidden border border-slate-200 shadow-xs relative bg-slate-100">
                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                <span className="absolute bottom-1 inset-x-0 text-[9px] font-bold text-center text-white truncate px-1">
                  {dest.city}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {dest.country}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                    Slot #{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 truncate font-inter-tight">
                  {dest.city}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {dest.tagline || dest.description}
                </p>
                <div className="text-sm font-bold text-slate-900 mt-2 font-mono">
                  ₹{dest.priceNum.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">{dest.duration} · {dest.season}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEditDestination(dest)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Icon name="edit" size={13} /> Edit
                </button>
                <button
                  onClick={() => onDeleteDestination(dest)}
                  className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete destination"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
