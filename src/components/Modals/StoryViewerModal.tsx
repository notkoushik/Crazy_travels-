import React from 'react'
import { Icon } from '../Icon'

interface StoryViewerModalProps {
  isOpen: boolean
  onClose: () => void
  story: { place: string; image: string; caption?: string; duration?: string } | null
}

export function StoryViewerModal({ isOpen, onClose, story }: StoryViewerModalProps) {
  if (!isOpen || !story) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-sm w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-black flex flex-col justify-between">
        {/* Progress Bar Header */}
        <div className="absolute top-0 inset-x-0 p-4 z-20 bg-gradient-to-b from-black/70 to-transparent">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-white rounded-full animate-pulse w-3/4" />
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ef4934] p-0.5">
                <img src="/IMG_1611.PNG" alt="Crazy Tours Travels" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h5 className="font-bold text-xs">@crazytourstravels</h5>
                <span className="text-[10px] text-white/70">{story.place}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

        {/* Story Background Image */}
        <img
          src={story.image}
          alt={story.place}
          className="w-full h-full object-cover"
        />

        {/* Caption & Interaction Footer */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ef4934]">
              Travel Moment · {story.duration || '0:30'}
            </span>
            <p className="text-sm font-medium leading-relaxed mt-1">
              {story.caption || `Capturing the breathtaking soul of ${story.place}. Slow down and let the journey unfold.`}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5"
            >
              <Icon name="camera" size={14} /> Follow on Instagram
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-[#ef4934] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
