import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { HeroInquiryCard } from './HeroInquiryCard'
import { WhatsAppFloat } from './WhatsAppFloat'
import { Icon } from './Icon'

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
        <Icon name="flight" size={18} /> Trip inquiry
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
