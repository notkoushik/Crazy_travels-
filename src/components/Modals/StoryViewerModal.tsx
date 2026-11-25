import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { InstagramReelItem } from '../../types/travel'

interface StoryViewerModalProps {
  isOpen: boolean
  onClose: () => void
  story?: any | null
  reels?: InstagramReelItem[]
  currentIndex?: number
  onChangeIndex?: (index: number) => void
}

export function StoryViewerModal({
  isOpen,
  onClose,
  story,
  reels = [],
  currentIndex = 0,
  onChangeIndex,
}: StoryViewerModalProps) {
  const [internalIndex, setInternalIndex] = useState(currentIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex)
    }
  }, [currentIndex, isOpen])

  const activeReels = reels && reels.length > 0 ? reels : []
  const hasReels = activeReels.length > 0
  const safeIndex = hasReels ? Math.min(Math.max(0, internalIndex), activeReels.length - 1) : 0
  const activeReel: InstagramReelItem | null = hasReels
    ? activeReels[safeIndex] || activeReels[0]
    : story && story.videoUrl
      ? (story as InstagramReelItem)
      : null

  const isVideo = Boolean(activeReel?.videoUrl || (story && story.videoUrl))
  const videoSrc = activeReel?.videoUrl || story?.videoUrl
  const posterSrc = activeReel?.posterUrl || story?.image

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Handle Volume / Mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  // Handle Next Reel
  const handleNext = () => {
    if (hasReels && internalIndex < activeReels.length - 1) {
      const next = internalIndex + 1
      setInternalIndex(next)
      if (onChangeIndex) onChangeIndex(next)
      setProgress(0)
    } else if (hasReels) {
      // Loop back to start or close
      setInternalIndex(0)
      if (onChangeIndex) onChangeIndex(0)
      setProgress(0)
    }
  }

  // Handle Prev Reel
  const handlePrev = () => {
    if (hasReels && internalIndex > 0) {
      const prev = internalIndex - 1
      setInternalIndex(prev)
      if (onChangeIndex) onChangeIndex(prev)
      setProgress(0)
    }
  }

  // Time update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(p)
    }
  }

  // Reset progress and autoplay when reel changes
  useEffect(() => {
    setProgress(0)
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true
          setIsMuted(true)
          videoRef.current.play().catch(() => {})
        }
      })
    }
  }, [internalIndex, videoSrc])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, internalIndex, hasReels])

  // Handle Copy Link
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = activeReel?.instagramUrl || window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen || (!story && !activeReel)) return null

  const displayTitle = activeReel?.title || story?.place || 'Travel Story'
  const displayPlace = activeReel?.place || story?.place || ''
  const displayCustomer = activeReel?.customerName || '@crazytourstravels'
  const displayQuote =
    activeReel?.reviewQuote ||
    story?.caption ||
    `Capturing the breathtaking soul of ${displayPlace}. Slow down and let the journey unfold.`
  const instagramLink =
    activeReel?.instagramUrl || 'https://www.instagram.com/crazytourstravels/'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-[390px] h-[88vh] max-h-[780px] rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 flex flex-col justify-between border border-white/10 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Segments (Instagram Stories Style) */}
        <div className="absolute top-0 inset-x-0 p-3 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {hasReels ? (
            <div className="flex items-center gap-1.5 mb-2.5">
              {activeReels.map((r, i) => (
                <div
                  key={r.id || i}
                  className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-150 rounded-full ${
                      i < safeIndex
                        ? 'w-full bg-white'
                        : i === safeIndex
                          ? 'bg-amber-400'
                          : 'w-0'
                    }`}
                    style={
                      i === safeIndex
                        ? { width: `${progress}%` }
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-2.5">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Top Bar Header */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 p-[1.5px]">
                  <img
                    src="/IMG_1611.PNG"
                    alt="Crazy Tours Travel"
                    className="w-full h-full object-cover rounded-full bg-black"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                  <Icon name="check" size={8} className="text-white" />
                </span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-xs tracking-tight text-white">
                    crazytourstravels
                  </h5>
                  <span className="px-1.5 py-0.2 bg-white/15 text-[9px] font-semibold rounded text-amber-300">
                    Verified
                  </span>
                </div>
                <p className="text-[10px] text-white/70 line-clamp-1">
                  {displayPlace}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {isVideo && (
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                >
                  <Icon name={isMuted ? 'volumeX' : 'volume'} size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close story"
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              >
                <Icon name="x" size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Video / Media Display Area */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer bg-black"
          onClick={togglePlay}
        >
          {isVideo && videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              playsInline
              autoPlay
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleNext}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={posterSrc || '/IMG_1611.PNG'}
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          )}

          {/* Pause overlay icon when paused */}
          {!isPlaying && isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center shadow-xl">
                <Icon name="play" size={28} className="translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Navigation Chevron Overlays */}
          {hasReels && safeIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              aria-label="Previous story"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-70 hover:opacity-100"
            >
              <Icon name="chevron" size={18} className="rotate-180" />
            </button>
          )}

          {hasReels && safeIndex < activeReels.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Next story"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-70 hover:opacity-100"
            >
              <Icon name="chevron" size={18} />
            </button>
          )}
        </div>

        {/* Bottom Review & Instagram Action Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white space-y-3">
          {/* Customer Review Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 space-y-1.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={12} className="fill-amber-400" />
                ))}
                <span className="text-[11px] font-bold text-white ml-1">5.0</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeReel?.category ? `${activeReel.category} Traveler` : 'Verified Traveler'}
              </span>
            </div>

            <p className="text-xs font-normal text-white/90 leading-snug line-clamp-3 italic">
              “{displayQuote}”
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-white/70">
              <span className="font-semibold text-white">{displayCustomer}</span>
              <span className="text-[10px] text-amber-300 font-mono">
                {activeReel?.duration || 'Reel Review'}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all transform active:scale-95"
            >
              <Icon name="instagram" size={15} />
              <span>Watch on Instagram</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all active:scale-95"
              title="Copy Instagram Reel Link"
            >
              <Icon name={copied ? 'check' : 'share'} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
