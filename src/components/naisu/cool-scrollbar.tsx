"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

type CoolScrollbarProps = {
  className?: string
  /** Tick count — keep dense but smaller than the reference. */
  lines?: number
}

/**
 * Cool scrollbar — fisheye ticks that swell with scroll (smaller Naisu scale).
 * Inspired by https://github.com/LucasHJin/scrollbar-but-cooler
 */
export function CoolScrollbar({ className, lines = 32 }: CoolScrollbarProps) {
  const progress = useMotionValue(0)
  const spring = useSpring(progress, { stiffness: 260, damping: 34, mass: 0.55 })
  const [p, setP] = React.useState(0)

  React.useEffect(() => {
    function sync() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight
      progress.set(
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      )
    }
    sync()
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [progress])

  React.useEffect(() => spring.on("change", setP), [spring])

  function jumpTo(fraction: number) {
    const max =
      document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: fraction * max, behavior: "smooth" })
  }

  const minW = 3
  const maxW = 20
  const sigma = 0.085

  return (
    <nav
      aria-label="Scroll"
      className={cn(
        "pointer-events-none fixed top-1/2 right-2 z-50 flex -translate-y-1/2 flex-col items-end gap-0.5",
        className
      )}
    >
      {Array.from({ length: lines }, (_, i) => {
        const t = lines === 1 ? 0 : i / (lines - 1)
        const dist = Math.abs(t - p)
        const falloff = Math.exp(-(dist * dist) / (2 * sigma * sigma))
        const w = minW + (maxW - minW) * falloff

        return (
          <motion.button
            key={i}
            type="button"
            aria-label={`Go to ${Math.round(t * 100)}%`}
            onClick={() => jumpTo(t)}
            className="pointer-events-auto block h-0.5 rounded-full bg-[#9C9C9B] hover:bg-[#111111]"
            animate={{ width: w }}
            transition={{ type: "spring", stiffness: 400, damping: 36, mass: 0.4 }}
          />
        )
      })}
    </nav>
  )
}
