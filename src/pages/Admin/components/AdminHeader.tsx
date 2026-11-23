import React from 'react'
import { RouteName } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface AdminHeaderProps {
  navigate: (route: RouteName) => void
  isDatabaseConnected: boolean
  onLogout?: () => void
}

export function AdminHeader({ navigate, isDatabaseConnected, onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-3 text-left group"
          title="Return to Public Customer Website"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 p-0.5 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/IMG_1611.PNG" alt="Crazy Tours" className="w-full h-full object-cover rounded-md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 tracking-tight font-inter-tight">
                Crazy Tours
              </span>
              <span className="hidden rounded-md border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 lg:inline">
                Operations Console
              </span>
            </div>
            <span className="hidden text-[11px] font-normal text-slate-500 sm:inline">
              Enterprise Travel Management
            </span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-2.5 ml-6 pl-6 border-l border-slate-200 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isDatabaseConnected ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'
            }`}
          />
          <span className="font-medium text-slate-600">
            {isDatabaseConnected
              ? 'PostgreSQL 18 Connected (crazy_tours_db)'
              : 'Connecting to database...'}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate('home')}
          aria-label="View public website"
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Icon name="eye" size={14} className="text-slate-500" />
          <span className="hidden sm:inline">View Public Website</span>
        </button>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100/80 text-xs font-medium text-slate-700 border border-slate-200/60">
          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
            SA
          </div>
          <span className="hidden sm:inline font-inter">Super Admin</span>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            aria-label="Lock and sign out"
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Lock Operations Console and wipe customer records from memory"
          >
            <Icon name="shield" size={13} className="text-rose-600" />
            <span className="hidden sm:inline">Lock / Sign Out</span>
          </button>
        )}
      </div>
    </header>
  )
}
