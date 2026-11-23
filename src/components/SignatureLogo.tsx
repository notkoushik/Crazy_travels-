import { useId, useLayoutEffect, useRef } from 'react'
import { OFFICIAL_LOGO_PATH } from './CrazyToursLogo'

// Centerline of the outer C, the two turns of the T, and the arrow's shaft.
const FLIGHT_PATH = [
  'M 334 153 C 273 195 226 244 188 302 C 101 393 55 501 56 626',
  'C 56 886 260 1099 516 1099 H 782 C 884 1099 966 1017 966 921',
  'V 369 C 966 329 934 299 894 299 C 854 299 821 330 821 369',
  'V 876 C 821 916 787 948 746 948 C 704 948 669 916 669 877',
  'V 369 C 669 329 636 299 596 299 H 514',
  'C 490 299 473 305 449 296 C 421 285 403 253 404 222',
  'C 404 181 438 145 490 145 H 1100',
].join(' ')

const INNER_CURVE = 'M 363 353 C 264 413 207 511 207 625 C 207 804 350 948 519 948 H 604'

const LANDING_START_X = 875
const LANDING_END_X = 1100

// The arrow is the matching section of the official outline, relative to (1100, 145).
// Each point of the plane has a corresponding point on the arrow.
const AIRPLANE = [
  [140, 0], [133, 11], [111, 19], [48, 22], [0, 117], [-12, 124], [-33, 124],
  [-38, 121], [-37, 113], [-34, 100], [-20, 37], [-21, 24], [-90, 22],
  [-118, 57], [-142, 57], [-142, -57], [-118, -57], [-90, -22], [-21, -24],
  [-20, -37], [-34, -100], [-37, -113], [-38, -121], [-33, -124],
  [-12, -124], [0, -117], [48, -22], [111, -19], [133, -11],
]
const LOGO_ARROW = [
  [107, 0], [101, 23], [83, 37], [17, 38], [-67, 122], [-78, 128], [-97, 129],
  [-109, 124], [-118, 116], [-125, 101], [-125, 86], [-120, 74], [-87, 40],
  [-88, 38], [-150, 39], [-150, -33], [-87, -33], [-86, -35], [-119, -68],
  [-125, -82], [-125, -97], [-120, -109], [-107, -121], [-94, -125],
  [-80, -124], [-69, -119], [18, -33], [85, -31], [100, -19],
]

const SESSION_KEY = 'crazy-tours-signature-played'
let hasPlayed = false

export function shouldPlaySignatureIntro() {
  if (hasPlayed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem(SESSION_KEY)
  } catch {
    return true
  }
}

function progress(time: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (time - start) / (end - start)))
}

function smooth(value: number) {
  return value * value * (3 - 2 * value)
}

function airplaneOutline(morph: number) {
  const points = AIRPLANE.map(([x, y], index) => {
    const [arrowX, arrowY] = LOGO_ARROW[index]
    return `${x + (arrowX - x) * morph} ${y + (arrowY - y) * morph}`
  })
  return `M ${points.join(' L ')} Z`
}

const AIRPLANE_OUTLINE = airplaneOutline(0)

export function SignatureLogoIntro({ onReveal, onFinish }: { onReveal: () => void; onFinish: () => void }) {
  const maskId = `signature-logo${useId()}`
  const screen = useRef<HTMLDivElement>(null)
  const flight = useRef<SVGGElement>(null)
  const finished = useRef<SVGPathElement>(null)
  const trace = useRef<SVGPathElement>(null)
  const innerTrace = useRef<SVGPathElement>(null)
  const airplane = useRef<SVGPathElement>(null)
  const wordmark = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!shouldPlaySignatureIntro()) {
      onFinish()
      return
    }

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const overlay = screen.current
    const movingMark = flight.current
    const stillMark = finished.current
    const outerCurve = trace.current
    const innerCurve = innerTrace.current
    const plane = airplane.current
    const name = wordmark.current
    const length = outerCurve?.getTotalLength()
    if (!overlay || !movingMark || !stillMark || !outerCurve || !innerCurve || !plane || !name || !length) {
      onFinish()
      return
    }

    const arrivalEnd = 250
    const morphStart = 1650
    const morphEnd = 2050
    const revealEnd = 2300
    const fadeEnd = 2520
    const distanceAtMorph = length - (LANDING_END_X - LANDING_START_X)

    let frame = 0
    let startedAt: number | undefined
    let pageRevealed = false

    const preferStill = () => {
      if (motion.matches) {
        cancelAnimationFrame(frame)
        onFinish()
      }
    }

    const draw = (now: number) => {
      if (startedAt === undefined) {
        startedAt = now
        hasPlayed = true
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          // The current visit still keeps its one-time playback.
        }
      }

      const time = now - startedAt
      if (time >= fadeEnd) {
        onFinish()
        return
      }

      name.style.opacity = String(smooth(progress(time, morphEnd, revealEnd)))
      if (time >= revealEnd) {
        if (!pageRevealed) {
          pageRevealed = true
          onReveal()
        }
        overlay.style.opacity = String(1 - smooth(progress(time, revealEnd, fadeEnd)))
      }
      if (time >= morphEnd) {
        movingMark.setAttribute('visibility', 'hidden')
        stillMark.removeAttribute('visibility')
      } else {
        const cruise = progress(time, arrivalEnd, morphStart)
        const landing = progress(time, morphStart, morphEnd)
        const distance = time < morphStart
          ? distanceAtMorph * (0.45 * cruise + 0.55 * smooth(cruise))
          : distanceAtMorph + (length - distanceAtMorph) * (1 - (1 - landing) ** 2)
        const position = outerCurve.getPointAtLength(distance)
        const before = outerCurve.getPointAtLength(Math.max(0, distance - 2))
        const after = outerCurve.getPointAtLength(Math.min(length, distance + 2))
        const heading = Math.atan2(after.y - before.y, after.x - before.x)
        const approach = 210 * (1 - progress(time, 0, arrivalEnd))

        const x = position.x - approach * Math.cos(heading)
        const y = position.y - approach * Math.sin(heading)
        const rotation = heading * 180 / Math.PI
        plane.setAttribute('transform', `translate(${x} ${y}) rotate(${rotation})`)
        plane.setAttribute('opacity', String(progress(time, 0, 140)))
        if (landing > 0) plane.setAttribute('d', airplaneOutline(smooth(landing)))
        outerCurve.setAttribute('opacity', time < arrivalEnd ? '0' : '1')
        outerCurve.setAttribute('stroke-dashoffset', String(1 - distance / length))
        const innerProgress = smooth(progress(time, 415, 1050))
        innerCurve.setAttribute('opacity', innerProgress > 0 ? '1' : '0')
        innerCurve.setAttribute('stroke-dashoffset', String(1 - innerProgress))
      }

      frame = requestAnimationFrame(draw)
    }

    stillMark.setAttribute('visibility', 'hidden')
    movingMark.removeAttribute('visibility')
    name.style.opacity = '0'
    motion.addEventListener('change', preferStill)
    frame = requestAnimationFrame(draw)

    return () => {
      motion.removeEventListener('change', preferStill)
      cancelAnimationFrame(frame)
    }
  }, [onReveal, onFinish])

  return (
    <div className="signature-intro" ref={screen} role="img" aria-label="Crazy Tours Travel">
      <svg className="signature-logo-mark" viewBox="-145 -181 1517 1517" fill="currentColor" aria-hidden="true">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1227" height="1155">
            <g fill="none" stroke="white" strokeWidth="108" strokeLinecap="round" strokeDasharray="1 1">
              <path ref={trace} d={FLIGHT_PATH} pathLength="1" strokeDashoffset="1" opacity="0" />
              <path ref={innerTrace} d={INNER_CURVE} pathLength="1" strokeDashoffset="1" opacity="0" />
            </g>
          </mask>
        </defs>
        <g ref={flight} visibility="hidden">
          <path d={OFFICIAL_LOGO_PATH} mask={`url(#${maskId})`} />
          <path ref={airplane} d={AIRPLANE_OUTLINE} opacity="0" />
        </g>
        <path ref={finished} d={OFFICIAL_LOGO_PATH} />
      </svg>
      <span className="signature-logo-name" ref={wordmark}>
        <span>Crazy Tours</span>{' '}
        <span className="signature-logo-descriptor">Travel</span>
      </span>
    </div>
  )
}
