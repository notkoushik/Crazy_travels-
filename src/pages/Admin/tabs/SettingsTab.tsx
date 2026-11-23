import React from 'react'
import { Icon } from '../../../components/Icon'

interface SettingsTabProps {
  isDatabaseConnected: boolean
  destinationsCount: number
  packagesCount: number
  staysCount: number
  bookingsCount: number
  inquiriesCount: number
  offersCount: number
  onRefresh: () => void
}

export function SettingsTab({
  isDatabaseConnected,
  destinationsCount,
  packagesCount,
  staysCount,
  bookingsCount,
  inquiriesCount,
  offersCount,
  onRefresh,
}: SettingsTabProps) {
  return (
    <div className="max-w-3xl space-y-6 font-inter">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
          Database & System Sync
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage persistent PostgreSQL 18 synchronization, table records, and manual schema re-hydration.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 font-inter-tight">
            Live PostgreSQL 18 Cluster
          </h2>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              isDatabaseConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isDatabaseConnected ? 'Connected & Healthy' : 'Connecting...'}
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Database Engine:</span>
            <span className="font-medium text-slate-900">PostgreSQL 18</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Database Name:</span>
            <span className="font-medium text-slate-900">crazy_tours_db</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Connection Host:</span>
            <span className="font-medium text-slate-900">localhost:5432</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">API Endpoint:</span>
            <span className="font-medium text-slate-900">http://localhost:5000</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-700 mb-2 font-inter-tight">
            Table Inventory Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Destinations</span>
              <strong className="text-slate-900 font-inter-tight font-bold text-sm">
                {destinationsCount} records
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Tour Packages</span>
              <strong className="text-slate-900 font-inter-tight font-bold text-sm">
                {packagesCount} records
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Stays & Haveli</span>
              <strong className="text-slate-900 font-inter-tight font-bold text-sm">
                {staysCount} records
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Bookings</span>
              <strong className="text-slate-900 font-inter-tight font-bold text-sm">
                {bookingsCount} records
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">CRM Inquiries</span>
              <strong className="text-slate-900 font-inter-tight font-bold text-sm">
                {inquiriesCount} records
              </strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Promotions</span>
              <strong className="text-slate-900 font-inter-tight font-bold text-sm">
                {offersCount} records
              </strong>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2"
          >
            <Icon name="refresh" size={14} /> Refresh All Tables From Database
          </button>
        </div>
      </div>
    </div>
  )
}
