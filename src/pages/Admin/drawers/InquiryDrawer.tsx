import React from 'react'
import { InquirySubmission } from '../../../types/travel'
import { Icon } from '../../../components/Icon'
import { dateLabel } from '../../../components/TravelDatePicker'

interface InquiryDrawerProps {
  inquiry: InquirySubmission
  onClose: () => void
  onUpdateStatus: (id: string, status: InquirySubmission['status']) => void
}

export function InquiryDrawer({ inquiry, onClose, onUpdateStatus }: InquiryDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end font-inter">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="font-mono text-xs font-semibold text-slate-500">
              {inquiry.id}
            </span>
            <h2 className="text-base font-bold text-slate-900 font-inter-tight">
              Custom Lead Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-slate-400 font-medium font-inter-tight">Prospect Details</div>
            <div className="text-slate-900 font-bold text-sm font-inter-tight">{inquiry.fullName}</div>
            <div className="text-slate-600">{inquiry.email}</div>
            <div className="text-slate-600 font-mono">{inquiry.phone}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-slate-400 font-medium font-inter-tight">Preferences</div>
            <div className="text-slate-700">
              Destination: <strong className="text-slate-900 font-inter-tight">{inquiry.preferredDestination}</strong>
            </div>
            <div className="text-slate-600">Month: {inquiry.travelMonth}</div>
            {inquiry.travelSeason && <div className="text-slate-600">Season: {inquiry.travelSeason}</div>}
            {inquiry.travelStart && inquiry.travelEnd && <div className="text-slate-600">Dates: {dateLabel(inquiry.travelStart)} – {dateLabel(inquiry.travelEnd)}</div>}
            {(inquiry.sourceTitle || inquiry.sourcePage) && <div className="text-slate-600">Page: {inquiry.sourceTitle || inquiry.sourcePage}</div>}
            <div className="text-slate-600">Travelers: {inquiry.travelersCount}</div>
            <div className="text-slate-600 font-mono">Budget: {inquiry.budgetPerPerson}</div>
          </div>

          {inquiry.notes && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-slate-400 font-medium font-inter-tight">Requirements</div>
              <div className="text-slate-700 italic">{inquiry.notes}</div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex gap-2.5">
            <button
              onClick={() => {
                onUpdateStatus(inquiry.id, 'Quoted')
                onClose()
              }}
              className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center shadow-xs"
            >
              Mark as Quoted
            </button>
            <a
              href={`tel:${inquiry.phone}`}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-center gap-1.5"
            >
              <Icon name="phone" size={14} /> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
