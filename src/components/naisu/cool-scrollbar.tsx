"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

/** Reserved right rail width for the fixed page scrollbar. */
export const SCROLL_RAIL_PX = 56

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function smoothScrollTo({
  from,
  to,
  duration = 420,
  apply,
  rafRef,
}: {
  from: number
  to: number
  duration?: number
  apply: (y: number) => void
  rafRef: { current: number }
}) {
  const delta = to - from
  if (Math.abs(delta) < 1) {
    apply(to)
    return
  }
  cancelAnimationFrame(rafRef.current)
  const start = performance.now()
  apply(from + delta * easeOutCubic(Math.min(1, 16 / duration)))
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    apply(from + delta * easeOutCubic(t))
    if (t < 1) rafRef.current = requestAnimationFrame(step)
  }
  rafRef.current = requestAnimationFrame(step)
}

export type CoolScrollbarProps = {
  className?: string
  lines?: number
  /**
   * Element to track. When set, the rail is inset in a relative parent
   * and drives that element's scrollTop. When omitted, tracks the window
   * and renders as a fixed page rail (md+ only).
   */
  containerRef?: React.RefObject<HTMLElement | null>
}

/**
 * Fisheye tick scrollbar.
 *
 * Panel:
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * <div className="relative h-64">
 *   <div ref={ref} className="h-full overflow-y-auto pr-12">long text</div>
 *   <CoolScrollbar containerRef={ref} />
 * </div>
 * ```
 *
 * Page: `<CoolScrollbar />`
 *
 * Needs: `motion/react` and a `cn` helper (`clsx` + `tailwind-merge`).
 */
export function CoolScrollbar({
  className,
  lines = 40,
  containerRef,
}: CoolScrollbarProps) {
  const progress = useMotionValue(0)
  const spring = useSpring(progress, {
    stiffness: 520,
    damping: 38,
    mass: 0.4,
  })
  const [p, setP] = React.useState(0)
  const jumping = React.useRef(false)
  const jumpRaf = React.useRef(0)
  const panel = Boolean(containerRef)

  React.useEffect(() => {
    function sync() {
      if (jumping.current) return
      if (containerRef?.current) {
        const el = containerRef.current
        const max = el.scrollHeight - el.clientHeight
        progress.set(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0)
        return
      }
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      )
      progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }

    sync()

    if (containerRef?.current) {
      const el = containerRef.current
      el.addEventListener("scroll", sync, { passive: true })
      window.addEventListener("resize", sync)
      const ro = new ResizeObserver(sync)
      ro.observe(el)
      return () => {
        el.removeEventListener("scroll", sync)
        window.removeEventListener("resize", sync)
        ro.disconnect()
      }
    }

    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [progress, containerRef])

  React.useEffect(() => spring.on("change", setP), [spring])

  React.useEffect(() => {
    return () => cancelAnimationFrame(jumpRaf.current)
  }, [])

  function jumpTo(fraction: number) {
    if (containerRef?.current) {
      const el = containerRef.current
      const max = el.scrollHeight - el.clientHeight
      if (max <= 0) return
      jumping.current = true
      progress.set(fraction)
      smoothScrollTo({
        from: el.scrollTop,
        to: fraction * max,
        duration: 360,
        apply: (y) => {
          el.scrollTop = y
        },
        rafRef: jumpRaf,
      })
      window.setTimeout(() => {
        jumping.current = false
      }, 400)
      return
    }

    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    )
    if (max <= 0) return
    jumping.current = true
    progress.set(fraction)
    smoothScrollTo({
      from: window.scrollY,
      to: Math.min(max, Math.max(0, fraction * max)),
      duration: 420,
      apply: (y) => window.scrollTo(0, y),
      rafRef: jumpRaf,
    })
    window.setTimeout(() => {
      jumping.current = false
    }, 450)
  }

  const minW = panel ? 2.5 : 6
  const maxW = panel ? 14 : 28
  const sigma = panel ? 0.09 : 0.075
  const tickCount = panel ? Math.min(lines, 28) : lines

  return (
    <nav
      aria-label="Scroll"
      className={cn(
        panel
          ? "pointer-events-none absolute top-1/2 right-0 z-10 flex -translate-y-1/2 flex-col items-end gap-[3px] pr-1"
          : "pointer-events-none fixed top-[10vh] bottom-[10vh] right-0 z-50 hidden md:block",
        className
      )}
      style={panel ? undefined : { width: SCROLL_RAIL_PX }}
    >
      {panel ? (
        Array.from({ length: tickCount }, (_, i) => {
          const t = tickCount === 1 ? 0 : i / (tickCount - 1)
          const dist = Math.abs(t - p)
          const falloff = Math.exp(-(dist * dist) / (2 * sigma * sigma))
          const w = minW + (maxW - minW) * falloff
          return (
            <motion.button
              key={i}
              type="button"
              aria-label={`Go to ${Math.round(t * 100)}%`}
              onClick={() => jumpTo(t)}
              className="pointer-events-auto block h-[2.5px] rounded-full bg-[#9C9C9B] hover:bg-[#315FEA]"
              animate={{ width: w }}
              transition={{
                type: "spring",
                stiffness: 560,
                damping: 34,
                mass: 0.35,
              }}
            />
          )
        })
      ) : (
        <div className="pointer-events-auto absolute inset-y-0 right-0 flex w-11 flex-col items-end justify-between py-1 pr-2.5">
          {Array.from({ length: tickCount }, (_, i) => {
            const t = tickCount === 1 ? 0 : i / (tickCount - 1)
            const dist = Math.abs(t - p)
            const falloff = Math.exp(-(dist * dist) / (2 * sigma * sigma))
            const w = minW + (maxW - minW) * falloff
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${Math.round(t * 100)}%`}
                onClick={() => jumpTo(t)}
                className="flex h-3 w-full items-center justify-end"
              >
                <motion.span
                  className="block h-[3px] rounded-full bg-[#9C9C9B]"
                  animate={{ width: w }}
                  transition={{
                    type: "spring",
                    stiffness: 560,
                    damping: 34,
                    mass: 0.35,
                  }}
                />
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
