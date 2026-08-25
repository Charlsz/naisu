"use client"

import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type CursorSpotlightProps = {
  title?: string
  body?: string
  className?: string
}

/**
 * Soft vignette stage: content stays readable; spotlight lifts a warm pool
 * under the pointer instead of a hard black fill.
 */
export function CursorSpotlight({
  title = "Spotlight",
  body = "Move across the canvas. The light follows, edges stay soft.",
  className,
}: CursorSpotlightProps) {
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const sx = useSpring(mx, springs.soft)
  const sy = useSpring(my, springs.soft)
  const spot = useMotionTemplate`radial-gradient(140px circle at ${sx}% ${sy}%, rgba(253,253,252,0.55) 0%, rgba(253,253,252,0.12) 42%, transparent 70%)`

  return (
    <div
      className={cn(
        "relative size-full min-h-[160px] overflow-hidden rounded-xl",
        className
      )}
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, #2a3344 0%, #151a22 55%, #0c0f14 100%)",
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(253,253,252,0.5) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ background: spot }}
      />
      <div className="relative z-[1] flex size-full flex-col items-center justify-center gap-1.5 px-6 text-center">
        <p className="text-[13px] font-medium tracking-tight text-[#FDFDFC]/90">
          {title}
        </p>
        <p className="max-w-[16rem] text-[10px] leading-relaxed text-[#FDFDFC]/55">
          {body}
        </p>
      </div>
    </div>
  )
}
