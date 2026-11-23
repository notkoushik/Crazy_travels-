import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { HeroInquiryCard } from './HeroInquiryCard'
import { WhatsAppFloat } from './WhatsAppFloat'

export interface InquiryContext {
  page: string
  title?: string
  destination?: string
  heading: string
  description: string
}

export function TripInquiry({ context, paused }: { context: InquiryContext; paused: boolean }) {
  const [ready, setReady] = useState(false)
  const [manual, setManual] = useState<boolean>()
  const id = useId()
  const launcher = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)
  const animation = useRef<Animation | null>(null)
  const wasOpen = useRef(false)
  const open = !paused && (manual ?? ready)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 3000)
    return () => window.clearTimeout(timer)
  }, [])

  useLayoutEffect(() => {
    if (!panel.current || !launcher.current || open === wasOpen.current) return
    wasOpen.current = open
    const surface = panel.current
    const running = animation.current
    const interrupted = running && running.playState === 'running' ? getComputedStyle(surface) : null
    const from = interrupted && { transform: interrupted.transform, opacity: interrupted.opacity }
    running?.cancel()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const card = surface.getBoundingClientRect()
    const button = launcher.current.getBoundingClientRect()
    const folded = {
      transform: `translate(${button.left - card.left}px, ${button.top - card.top}px) scale(${button.width / card.width}, ${button.height / card.height})`,
      opacity: 0,
    }
    const settled = { transform: 'none', opacity: 1 }
    animation.current = surface.animate(
      (open ? [from ?? folded, settled] : [from ?? settled, folded]).map((frame) => ({
        ...frame,
        visibility: 'visible',
      })),
      {
        duration: open ? 390 : 300,
        easing: open ? 'cubic-bezier(.19,.75,.28,1)' : 'cubic-bezier(.55,.04,.76,.46)',
      }
    )
  }, [open])

  const minimize = () => {
    setManual(false)
    requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }))
  }

  return (
    <div className="inquiry-dock">
      <button
        ref={launcher}
        type="button"
        data-expanded={open}
        aria-expanded={open}
        aria-controls={id}
        className="inquiry-dock-launcher"
        onClick={() => {
          setManual(true)
          requestAnimationFrame(() => panel.current?.querySelector('button')?.focus({ preventScroll: true }))
        }}
      >
        <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5c1 0 1.8 1 1.8 2.3V9l6.7 4.1c.3.2.5.53.5.9v1.3a.5.5 0 0 1-.66.47l-6.54-2.23v4.17l2.22 1.61c.18.13.28.33.28.55v1.1a.45.45 0 0 1-.59.43L12 20.23 8.29 21.4a.45.45 0 0 1-.59-.43v-1.1c0-.22.1-.42.28-.55l2.22-1.61v-4.17l-6.54 2.23A.5.5 0 0 1 3 15.3V14c0-.37.2-.7.5-.9L10.2 9V4.8c0-1.3.8-2.3 1.8-2.3Z" />
        </svg>
        Trip inquiry
      </button>
      <aside
        id={id}
        ref={panel}
        className="inquiry-dock-panel"
        data-open={open}
        inert={!open}
        aria-label="Trip details and inquiry"
        onKeyDown={(event) => {
          if (event.key === 'Escape') minimize()
        }}
      >
        <HeroInquiryCard context={context} onClose={minimize} />
      </aside>
      <WhatsAppFloat placement="dock" />
    </div>
  )
}
