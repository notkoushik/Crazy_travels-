import React from 'react'
import { StayItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { stayTypes } from '../../../data/travelData'

interface StaysTabProps {
  stays: StayItem[]
  stayFilter: string
  setStayFilter: (f: string) => void
  onAddNewStay: () => void
  onEditStay: (stay: StayItem) => void
  onDeleteStay: (stay: StayItem) => void
}

export function StaysTab({
  stays,
  stayFilter,
  setStayFilter,
  onAddNewStay,
  onEditStay,
  onDeleteStay,
}: StaysTabProps) {
  const filteredStays = stays.filter(
    (s) => stayFilter === 'All' || s.type === stayFilter
  )

  return (
    <div className="space-y-6 max-w-7xl font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Stays & Hotels
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage hotels, resorts, heritage havelis, and other stays.
          </p>
        </div>

        <button
          onClick={onAddNewStay}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Icon name="plus" size={14} /> Add New Hotel
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', ...stayTypes].map((cat) => (
          <button
            key={cat}
            onClick={() => setStayFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              stayFilter === cat
                ? 'bg-slate-900 text-white shadow-2xs font-inter-tight'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStays.map((stay) => (
          <div
            key={stay.id}
            className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
              <img
                src={stay.image}
                alt={stay.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/95 backdrop-blur-md text-slate-800 shadow-xs border border-white/40">
                  {stay.type}
                </span>
              </div>
              {stay.rating > 0 && <div className="absolute top-3 right-3" title="Internal score">
                <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-900/85 backdrop-blur-md text-amber-300 shadow-xs flex items-center gap-1 font-mono">
                  <Icon name="star" size={11} className="fill-amber-400 text-amber-400" />
                  {stay.rating}
                </span>
              </div>}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
                  <Icon name="pin" size={12} className="text-slate-400" />
                  <span>{stay.city}, {stay.state}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-slate-700 transition-colors font-inter-tight">
                  {stay.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {stay.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {stay.amenities?.slice(0, 3).map((amenity, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/50"
                  >
                    {amenity}
                  </span>
                ))}
                {(stay.amenities?.length || 0) > 3 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400">
                    +{stay.amenities.length - 3} more
                  </span>
                )}
              </div>

              {/* Pricing & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                  <span className="font-mono font-bold text-slate-900 text-sm font-inter-tight">
                    ₹{stay.priceNum?.toLocaleString('en-IN') || stay.price}
                    <span className="text-[10px] font-normal text-slate-500 ml-1 font-inter">/ night</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditStay(stay)}
                    className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Icon name="edit" size={12} /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteStay(stay)}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Stay"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
