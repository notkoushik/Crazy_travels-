import React, { useEffect, useState } from 'react'
import { CatalogPhoto } from './CatalogPhoto'
import { Icon } from './Icon'

export interface CustomizationGroupCardData {
  id: string
  badge: string
  title: string
  subtitle: string
  images: readonly string[]
  travelStyle: string
  icon: React.ReactNode
}

interface CustomizationGroupCardProps {
  card: CustomizationGroupCardData
  variant: 'tall' | 'compact'
  staggerOffsetMs?: number
  onSelect: (travelStyle: string) => void
}

/**
 * Editorial group showcase card with a smooth crossfade image carousel,
 * hover pause, and staggered cycle offset so adjacent cards transition gracefully.
 */
export function CustomizationGroupCard({
  card,
  variant,
  staggerOffsetMs = 0,
  onSelect,
}: CustomizationGroupCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = card.images.length

  useEffect(() => {
    if (slideCount < 2 || isPaused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let intervalId: number | undefined
    const delayTimer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
      intervalId = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % slideCount)
      }, 4400)
    }, 3600 + staggerOffsetMs)

    return () => {
      window.clearTimeout(delayTimer)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [slideCount, isPaused, staggerOffsetMs])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(card.travelStyle)
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      className={`custom-group-card ${variant}`}
      aria-label={`${card.title} — ${card.subtitle}`}
      onClick={() => onSelect(card.travelStyle)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Multi-layer Smooth Crossfade Carousel */}
      <div className="custom-group-slides" aria-hidden="true">
        {card.images.map((src, idx) => (
          <CatalogPhoto
            key={src}
            src={src}
            alt={idx === 0 ? card.title : ''}
            loading="lazy"
            className={`custom-group-slide ${idx === activeIndex ? 'is-active' : ''}`}
          />
        ))}
      </div>

      <div className="custom-group-scrim" aria-hidden="true" />

      {/* Top Row: Frosted Badge + Minimal Carousel Dots */}
      <div className="custom-group-top">
        <span className="custom-group-pill">
          {card.icon}
          <span>{card.badge}</span>
        </span>

        {slideCount > 1 && (
          <div className="custom-group-dots" role="tablist" aria-label={`${card.title} photo switcher`}>
            {card.images.map((src, idx) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Show photo ${idx + 1} of ${slideCount} for ${card.title}`}
                className={`custom-group-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveIndex(idx)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Copy & Peach Circular Arrow */}
      <div className="custom-group-footer">
        <div className="custom-group-copy">
          <h3>{card.title}</h3>
          <p>{card.subtitle}</p>
        </div>
        <span className="custom-group-arrow" aria-hidden="true">
          <Icon name="arrow" size={16} />
        </span>
      </div>
    </article>
  )
}
