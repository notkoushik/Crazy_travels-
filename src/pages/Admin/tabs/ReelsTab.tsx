import React, { useState } from 'react'
import { InstagramReelItem } from '../../../types/travel'
import { Icon } from '../../../components/Icon'

interface ReelsTabProps {
  reels: InstagramReelItem[]
  onUpdateReel: (id: string, updates: Partial<InstagramReelItem>) => Promise<any>
  onToast: (msg: string) => void
}

export function ReelsTab({ reels, onUpdateReel, onToast }: ReelsTabProps) {
  // Local edit states per reel id
  const [editingData, setEditingData] = useState<Record<string, Partial<InstagramReelItem>>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null)

  const handleFieldChange = (id: string, field: keyof InstagramReelItem, value: any) => {
    setEditingData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  const handleSave = async (reel: InstagramReelItem) => {
    const changes = editingData[reel.id]
    if (!changes || Object.keys(changes).length === 0) {
      onToast('No changes to save.')
      return
    }

    try {
      setSavingId(reel.id)
      await onUpdateReel(reel.id, changes)
      setSavedSuccessId(reel.id)
      setTimeout(() => setSavedSuccessId(null), 3000)
      onToast(`Saved Instagram Reel “${reel.title}” to PostgreSQL!`)
    } catch (err: any) {
      onToast(`Error saving reel: ${err.message || 'Unknown error'}`)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-inter-tight">
              Instagram Video Reels & Customer Reviews
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1">
              <Icon name="instagram" size={12} className="text-rose-600" />
              10 Active Reels
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage high-speed streaming 9:16 videos, customer quotes, traveler identities, and live Instagram post links.
          </p>
        </div>
      </div>

      {/* Architecture & Solution Banner */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-slate-50 p-4 text-xs text-slate-700 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Icon name="sparkle" size={15} className="text-indigo-600" />
          <span>Instagram Link Architecture & Solution:</span>
        </div>
        <p className="text-[12px] leading-relaxed text-slate-600">
          The video files are compressed with H.264/AAC with header faststart (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">+faststart</code>) for zero-buffering instant web playback. Each video is mapped to an Instagram link below. You can paste any live Instagram URL (e.g. <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">https://www.instagram.com/reel/C...</code>), and click <strong>Save & Sync</strong> to update the live site immediately without rebuilding.
        </p>
      </div>

      {/* Reels List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reels.map((reel, idx) => {
          const currentChanges = editingData[reel.id] || {}
          const currentLink =
            currentChanges.instagramUrl !== undefined ? currentChanges.instagramUrl : reel.instagramUrl || ''
          const currentQuote =
            currentChanges.reviewQuote !== undefined ? currentChanges.reviewQuote : reel.reviewQuote
          const currentCustomer =
            currentChanges.customerName !== undefined ? currentChanges.customerName : reel.customerName
          const currentTitle =
            currentChanges.title !== undefined ? currentChanges.title : reel.title
          const currentPlace =
            currentChanges.place !== undefined ? currentChanges.place : reel.place

          const isSaving = savingId === reel.id
          const isSavedSuccess = savedSuccessId === reel.id
          const hasUnsavedChanges = Object.keys(currentChanges).length > 0

          return (
            <div
              key={reel.id}
              className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-md flex flex-col md:flex-row gap-4 p-4 ${
                hasUnsavedChanges ? 'border-amber-400 bg-amber-50/10' : 'border-slate-200/90'
              }`}
            >
              {/* Video Thumbnail & Info */}
              <div className="relative w-full md:w-44 h-56 md:h-auto rounded-xl overflow-hidden bg-black shrink-0 group">
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20">
                  #{idx + 1} Reel
                </span>

                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/20">
                  {reel.duration}
                </span>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                  <a
                    href={reel.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-white text-slate-900 shadow-lg hover:scale-110 transition-transform"
                    title="Open Raw Video"
                  >
                    <Icon name="play" size={16} className="translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Form Controls */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Title & Destination
                      </label>
                      <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => handleFieldChange(reel.id, 'title', e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Customer / Travelers
                      </label>
                      <input
                        type="text"
                        value={currentCustomer}
                        onChange={(e) => handleFieldChange(reel.id, 'customerName', e.target.value)}
                        className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Location Tag
                      </label>
                      <input
                        type="text"
                        value={currentPlace}
                        onChange={(e) => handleFieldChange(reel.id, 'place', e.target.value)}
                        className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Customer Review Quote (Displayed on card & player)
                    </label>
                    <textarea
                      rows={2}
                      value={currentQuote}
                      onChange={(e) => handleFieldChange(reel.id, 'reviewQuote', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 leading-snug resize-none"
                    />
                  </div>

                  {/* Instagram Link Field */}
                  <div className="pt-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                      <Icon name="instagram" size={11} />
                      Instagram Reel URL
                    </label>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="url"
                        value={currentLink}
                        placeholder="https://www.instagram.com/reel/..."
                        onChange={(e) => handleFieldChange(reel.id, 'instagramUrl', e.target.value)}
                        className="flex-1 text-xs font-mono text-slate-800 bg-rose-50/30 border border-rose-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                      />
                      {currentLink && (
                        <a
                          href={currentLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Open in Instagram"
                        >
                          <Icon name="arrow" size={12} className="-rotate-45" />
                          <span>Test</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="star" size={10} className="fill-amber-400" />
                      ))}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">5.0 Star</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSave(reel)}
                    disabled={isSaving}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                      isSavedSuccess
                        ? 'bg-emerald-600 text-white'
                        : hasUnsavedChanges
                          ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Icon name="refresh" size={12} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : isSavedSuccess ? (
                      <>
                        <Icon name="check" size={12} />
                        <span>Saved to DB!</span>
                      </>
                    ) : (
                      <>
                        <Icon name="check" size={12} />
                        <span>Save Link & Review</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
