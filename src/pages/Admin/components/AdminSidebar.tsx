import React from 'react'
import { AdminTab } from '../types'
import { Icon } from '../../../components/Icon'

interface AdminSidebarProps {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  destinationsCount: number
  packagesCount: number
  staysCount: number
  bookingsCount: number
  newInquiriesCount: number
  offersCount: number
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  destinationsCount,
  packagesCount,
  staysCount,
  bookingsCount,
  newInquiriesCount,
  offersCount,
}: AdminSidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white p-4 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-inter-tight">
            Overview
          </div>
          <nav className="space-y-1 mt-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="barChart"
                  size={15}
                  className={activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'}
                />
                <span>Executive Dashboard</span>
              </div>
            </button>
          </nav>
        </div>

        <div>
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-inter-tight">
            Inventory & Content
          </div>
          <nav className="space-y-1 mt-1">
            <button
              onClick={() => setActiveTab('destinations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'destinations'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="map"
                  size={15}
                  className={activeTab === 'destinations' ? 'text-white' : 'text-slate-400'}
                />
                <span>Destinations (Fort Arch)</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  activeTab === 'destinations'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {destinationsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'packages'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="compass"
                  size={15}
                  className={activeTab === 'packages' ? 'text-white' : 'text-slate-400'}
                />
                <span>Tour Packages</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  activeTab === 'packages'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {packagesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stays')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'stays'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="hotel"
                  size={15}
                  className={activeTab === 'stays' ? 'text-white' : 'text-slate-400'}
                />
                <span>Stays & Haveli</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  activeTab === 'stays'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {staysCount}
              </span>
            </button>
          </nav>
        </div>

        <div>
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-inter-tight">
            Operations & CRM
          </div>
          <nav className="space-y-1 mt-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'bookings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="calendar"
                  size={15}
                  className={activeTab === 'bookings' ? 'text-white' : 'text-slate-400'}
                />
                <span>Bookings & Vouchers</span>
              </div>
              {bookingsCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    activeTab === 'bookings'
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="messageSquare"
                  size={15}
                  className={activeTab === 'inquiries' ? 'text-white' : 'text-slate-400'}
                />
                <span>Custom Trip CRM</span>
              </div>
              {newInquiriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                  {newInquiriesCount} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'offers'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name="tag"
                  size={15}
                  className={activeTab === 'offers' ? 'text-white' : 'text-slate-400'}
                />
                <span>Offers & Promotions</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  activeTab === 'offers'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {offersCount}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Icon name="settings" size={14} />
          <span>Database Sync</span>
        </button>
      </div>
    </aside>
  )
}
