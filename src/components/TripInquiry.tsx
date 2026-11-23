import { useLayoutEffect, useRef, type RefObject } from 'react'
import { HeroInquiryCard } from './HeroInquiryCard'

interface TripInquiryProps {
  isOpen: boolean
  onClose: () => void
  launcherRef: RefObject<HTMLButtonElement | null>
  initialDestination?: string
  modal?: boolean
}

export function TripInquiry({
  isOpen,
  onClose,
  launcherRef,
  initialDestination,
  modal = false,
}: TripInquiryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const previousOpen = useRef<boolean | null>(null)

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || previousOpen.current === isOpen) return
    const wasOpen = previousOpen.current
    previousOpen.current = isOpen
    if (!isOpen && !wasOpen) return

    const dialog = dialogRef.current
    const launcher = launcherRef.current
    if (isOpen && dialog && !dialog.open) dialog.showModal()

    const focusLauncher = () => launcher?.focus({ preventScroll: true })
    const finishClose = () => {
      dialog?.close()
      focusLauncher()
    }

    const running = animationRef.current
    const current = running && running.playState !== 'finished' ? getComputedStyle(panel) : null
    const interruptedFrame = current && { transform: current.transform, opacity: current.opacity }
    running?.cancel()
    animationRef.current = null

    if (wasOpen !== null || modal) {
      if (isOpen) panel.querySelector('button')?.focus({ preventScroll: true })
      else if (!dialog) focusLauncher()
    }

    const bounds = panel.getBoundingClientRect()
    if (!bounds.width || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!isOpen) finishClose()
      return
    }

    const button = launcher?.getBoundingClientRect()
    const toButton = button?.width
      ? `translate(${button.left - bounds.left}px, ${button.top - bounds.top}px) scale(${button.width / bounds.width}, ${button.height / bounds.height})`
      : 'translateY(-14px) scale(.96)'
    const folded = { transform: toButton, opacity: 0 }
    const settled = { transform: 'none', opacity: 1 }
    const frames: Keyframe[] = isOpen
      ? [
          interruptedFrame ?? folded,
          { transform: 'translateY(2px) scale(1.008, 1.006)', opacity: 1, offset: 0.78 },
          settled,
        ]
      : [interruptedFrame ?? settled, folded]

    const animation = panel.animate(
      frames.map((frame) => ({ ...frame, visibility: 'visible' })),
      {
        duration: isOpen ? 470 : 360,
        easing: isOpen ? 'cubic-bezier(.19,.75,.28,1)' : 'cubic-bezier(.55,.04,.76,.46)',
      },
    )
    animationRef.current = animation
    if (!isOpen && dialog) animation.onfinish = finishClose
  }, [isOpen, launcherRef, modal])

  const panel = (
    <div ref={panelRef} className="inquiry-motion" data-open={isOpen} inert={!isOpen}>
      <HeroInquiryCard
        initialDestination={initialDestination}
        onClose={onClose}
        closeLabel={modal ? 'Close trip details and inquiry' : 'Minimize trip details and inquiry'}
      />
    </div>
  )

  if (!modal) {
    return (
      <aside className="inquiry-inline" aria-label="Trip details and inquiry" aria-hidden={!isOpen}>
        {panel}
      </aside>
    )
  }

  return (
    <dialog
      ref={dialogRef}
      className="inquiry-dialog"
      data-open={isOpen}
      aria-label="Trip details and inquiry"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {panel}
    </dialog>
  )
}
