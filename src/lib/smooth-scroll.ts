/** Shared scroll easing: fast start, soft landing (~60fps via rAF). */
export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

type SmoothScrollOpts = {
  /** Current scroll offset */
  from: number
  /** Target scroll offset */
  to: number
  duration?: number
  /** Apply scroll position each frame */
  apply: (y: number) => void
  /** Optional handle so callers can cancel */
  rafRef?: { current: number }
}

/**
 * Animate a scroll position with ease-out cubic.
 * Moves on the first frame so clicks never feel buffered.
 */
export function smoothScrollTo({
  from,
  to,
  duration = 420,
  apply,
  rafRef,
}: SmoothScrollOpts) {
  const delta = to - from
  if (Math.abs(delta) < 1) {
    apply(to)
    return
  }

  if (rafRef) cancelAnimationFrame(rafRef.current)

  const start = performance.now()
  apply(from + delta * easeOutCubic(Math.min(1, 16 / duration)))

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    apply(from + delta * easeOutCubic(t))
    if (t < 1) {
      const id = requestAnimationFrame(step)
      if (rafRef) rafRef.current = id
    }
  }

  const id = requestAnimationFrame(step)
  if (rafRef) rafRef.current = id
}
