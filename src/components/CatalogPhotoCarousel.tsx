import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { catalogPhotoCredits, catalogPhotoUrls } from '../data/catalogPhotos'
import { CatalogPhoto } from './CatalogPhoto'
import { Icon } from './Icon'

function scrollToPhoto(track: HTMLDivElement | null, index: number, reducedMotion: boolean) {
  track?.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion ? 'instant' : 'smooth' })
}

export function CatalogPhotoCarousel({
  title,
  cover,
  gallery,
  className = '',
  frameClassName,
  card = false,
  children,
}: {
  title: string
  cover: string
  gallery?: string[]
  className?: string
  frameClassName: string
  card?: boolean
  children: ReactNode
}) {
  const id = useId()
  const track = useRef<HTMLDivElement>(null)
  const playDirection = useRef(1)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [inView, setInView] = useState(false)
  const photos = catalogPhotoUrls(cover, gallery)
  if (!photos.length) photos.push('')
  const count = photos.length
  const active = Math.min(index, count - 1)
  const credit = catalogPhotoCredits.get(photos[active])
  const autoPlay = playing && !reducedMotion

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(motion.matches)
    motion.addEventListener('change', syncMotion)
    return () => motion.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    if (!track.current || count < 2) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    })
    observer.observe(track.current)
    return () => observer.disconnect()
  }, [count])

  useEffect(() => {
    if (!autoPlay || !inView || count < 2) return
    const timeout = window.setTimeout(() => {
      if (active === 0) playDirection.current = 1
      if (active === count - 1) playDirection.current = -1
      scrollToPhoto(track.current, active + playDirection.current, false)
    }, 5500)
    return () => window.clearTimeout(timeout)
  }, [active, autoPlay, count, inView])

  const move = (direction: number) => {
    setPlaying(false)
    scrollToPhoto(track.current, Math.max(0, Math.min(active + direction, count - 1)), reducedMotion)
  }

  return (
    <div className={`catalog-carousel ${className}`} role="region" aria-label={`${title} photos`} aria-roledescription={count > 1 ? 'carousel' : undefined}>
      <div className={`catalog-carousel-frame ${frameClassName}`}>
        <div
          id={id}
          ref={track}
          className="catalog-carousel-track"
          tabIndex={count > 1 ? 0 : undefined}
          aria-label={count > 1 ? 'Gallery photos' : undefined}
          onPointerDown={() => setPlaying(false)}
          onScroll={(event) => {
            const { scrollLeft, clientWidth } = event.currentTarget
            if (clientWidth) setIndex(Math.round(scrollLeft / clientWidth))
          }}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1)
          }}
        >
          {photos.map((url, i) => (
            <div className="catalog-carousel-slide" key={url} aria-hidden={i !== active}>
              <CatalogPhoto
                src={url}
                alt={catalogPhotoCredits.get(url)?.title ?? `${title} photo ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>
        {children}
        {card && count > 1 && !reducedMotion && (
          <button type="button" className="destination-gallery-play" aria-label={playing ? 'Pause photo slideshow' : 'Play photo slideshow'}
            aria-controls={id} onClick={() => setPlaying((current) => !current)}>
            {playing ? <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M4 2h3v12H4zm5 0h3v12H9z" /></svg> : <Icon name="play" size={14} />}
          </button>
        )}
        {card && count > 1 && (
          <div className="destination-gallery-arrows">
            <button type="button" aria-label="Previous photo" aria-controls={id} disabled={active === 0} onClick={() => move(-1)}>
              <Icon name="chevron" size={18} className="rotate-180" />
            </button>
            <button type="button" aria-label="Next photo" aria-controls={id} disabled={active === count - 1} onClick={() => move(1)}>
              <Icon name="chevron" size={18} />
            </button>
          </div>
        )}
      </div>

      {((!card && count > 1) || credit) && (
        <div className="catalog-carousel-bar">
          <p className="catalog-carousel-caption">
            {credit ? (
              <>
                <span>{credit.title}</span>
                <small>
                  <a href={credit.source} target="_blank" rel="noreferrer">{credit.author}</a>
                  {' · '}
                  <a href={credit.license} target="_blank" rel="noreferrer">{credit.licenseName}</a>
                  {' · Display cropped'}
                </small>
              </>
            ) : 'Photos'}
          </p>
          {!card && count > 1 && (
            <div className="catalog-carousel-controls">
              <span aria-live={autoPlay ? 'off' : 'polite'} aria-atomic="true">
                <span className="sr-only">Photo </span>{active + 1}
                <span aria-hidden="true"> / </span><span className="sr-only"> of </span>{count}
              </span>
              {!reducedMotion && (
                <button
                  type="button"
                  aria-label={playing ? 'Pause photo slideshow' : 'Play photo slideshow'}
                  aria-controls={id}
                  onClick={() => setPlaying((current) => !current)}
                >
                  {playing ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M9 5v14m6-14v14" />
                    </svg>
                  ) : <Icon name="play" size={15} />}
                </button>
              )}
              <button type="button" aria-label="Previous photo" aria-controls={id} disabled={active === 0} onClick={() => move(-1)}>
                <Icon name="chevron" size={17} className="rotate-180" />
              </button>
              <button type="button" aria-label="Next photo" aria-controls={id} disabled={active === count - 1} onClick={() => move(1)}>
                <Icon name="chevron" size={17} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
