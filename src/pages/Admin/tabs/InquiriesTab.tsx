import React from 'react'
import { InquirySubmission } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface InquiriesTabProps {
  inquiries: InquirySubmission[]
  onUpdateInquiryStatus: (id: string, status: InquirySubmission['status']) => void
  onSelectInquiry?: (inq: InquirySubmission) => void
}

export function InquiriesTab({
  inquiries,
  onUpdateInquiryStatus,
  onSelectInquiry,
}: InquiriesTabProps) {
  return (
    <div className="space-y-6 max-w-7xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
            Custom Trip Inquiries CRM
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage incoming leads from the "Plan Custom Trip" form and convert them into handcrafted bookings.
          </p>
        </div>
      </div>

      {/* Inquiry Lead Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-500">{inq.id}</span>
                <select
                  value={inq.status}
                  onChange={(e) =>
                    onUpdateInquiryStatus(inq.id, e.target.value as InquirySubmission['status'])
                  }
                  className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-md px-2 py-0.5 outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2 font-inter-tight">
                {inq.fullName}
              </h3>
              <div className="text-xs text-slate-600 font-medium">
                {inq.preferredDestination}
              </div>

              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Month:</span>
                  <span className="font-semibold text-slate-900">{inq.travelMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Travelers:</span>
                  <span className="font-semibold text-slate-900">{inq.travelersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-semibold text-slate-900 font-mono">{inq.budgetPerPerson}</span>
                </div>
              </div>

              {inq.notes && (
                <p className="text-xs text-slate-500 mt-3 line-clamp-2 italic">
                  "{inq.notes}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">{inq.phone}</span>
              <div className="flex items-center gap-2">
                {onSelectInquiry && (
                  <button
                    onClick={() => onSelectInquiry(inq)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    View
                  </button>
                )}
                <a
                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Icon name="whatsapp" size={13} /> Chat
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
