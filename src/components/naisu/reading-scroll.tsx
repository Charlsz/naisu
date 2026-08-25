"use client"

import * as React from "react"
import { motion } from "motion/react"

import { ReadingNotebook, LOREM_PARAGRAPHS } from "@/components/naisu/reading-notebook"
import { smoothScrollTo } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

export type ReadingScrollProps = {
  className?: string
  /** Extra long body for the fisheye rail demo. */
  long?: boolean
}

/**
 * Notebook chrome with an in-panel cool scrollbar rail.
 * Gallery Copy/Code concatenates both component sources.
 */
export function ReadingScroll({ className, long = true }: ReadingScrollProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const jumpRaf = React.useRef(0)
  const [p, setP] = React.useState(0)
  const lines = 26
  const minW = 2.5
  const maxW = 14
  const sigma = 0.09

  function sync() {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setP(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0)
  }

  React.useEffect(() => {
    sync()
    return () => cancelAnimationFrame(jumpRaf.current)
  }, [])

  function jumpTo(fraction: number) {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    smoothScrollTo({
      from: el.scrollTop,
      to: fraction * max,
      duration: 360,
      apply: (y) => {
        el.scrollTop = y
      },
      rafRef: jumpRaf,
    })
  }

  const paragraphs = long
    ? [...LOREM_PARAGRAPHS, ...LOREM_PARAGRAPHS, ...LOREM_PARAGRAPHS]
    : LOREM_PARAGRAPHS

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full max-w-2xl items-stretch justify-center",
        className
      )}
    >
      <ReadingNotebook
        scrollerRef={scrollerRef}
        onScroll={sync}
        title="Lorem scroll notebook"
        kicker="Demo · Ipsum"
        paragraphs={paragraphs}
        className="h-full max-h-full w-full"
      />
      <nav
        aria-label="Cool scrollbar"
        className="pointer-events-none absolute top-1/2 right-2.5 z-10 flex -translate-y-1/2 flex-col items-end gap-[3px] sm:right-3.5"
      >
        {Array.from({ length: lines }, (_, i) => {
          const t = i / (lines - 1)
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
        })}
      </nav>
    </div>
  )
}
