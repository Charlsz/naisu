"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ImageCarouselSlide = {
  src: string
  alt?: string
}

export type ImageCarouselProps = {
  slides: ImageCarouselSlide[]
  /** Autoplay interval in ms. Set 0 to disable. */
  interval?: number
  className?: string
}

/**
 * Full-bleed image carousel with autoplay, dots, and prev/next.
 *
 * Needs: `motion/react`, `lucide-react`, `@/lib/utils` (`cn`), `@/lib/motion` (`springs`).
 */
export function ImageCarousel({
  slides,
  interval = 3200,
  className,
}: ImageCarouselProps) {
  const count = slides.length
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [direction, setDirection] = React.useState(1)

  const go = React.useCallback(
    (next: number, dir: number) => {
      if (count <= 0) return
      setDirection(dir)
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  React.useEffect(() => {
    if (paused || interval <= 0 || count <= 1) return
    const id = window.setInterval(() => go(index + 1, 1), interval)
    return () => window.clearInterval(id)
  }, [paused, interval, count, index, go])

  if (count === 0) return null

  const slide = slides[index]

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col justify-center",
        className
      )}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#101828]/6 ring-1 ring-[#101828]/8">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.src + index}
            custom={direction}
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.snappy}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt ?? ""}
              className="size-full object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(index - 1, -1)}
              className="absolute top-1/2 left-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#FDFDFC]/90 text-[#111111] shadow-[0_1px_4px_rgba(16,24,40,0.12)] ring-1 ring-[#101828]/10 transition-transform active:scale-95"
            >
              <ChevronLeftIcon className="size-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(index + 1, 1)}
              className="absolute top-1/2 right-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#FDFDFC]/90 text-[#111111] shadow-[0_1px_4px_rgba(16,24,40,0.12)] ring-1 ring-[#101828]/10 transition-transform active:scale-95"
            >
              <ChevronRightIcon className="size-3.5" strokeWidth={2.5} />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.src + i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={cn(
                "h-1 rounded-full transition-[width,background-color] duration-200",
                i === index
                  ? "w-4 bg-[#315FEA]"
                  : "w-1.5 bg-[#9C9C9B]/70 hover:bg-[#667085]"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

const SLIDE = {
  enter: (dir: number) => ({
    x: dir > 0 ? "28%" : "-28%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-18%" : "18%",
    opacity: 0,
  }),
}
