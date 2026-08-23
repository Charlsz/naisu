"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

type ClickShockwaveProps = {
  className?: string
  /** Label on the trigger */
  label?: string
}

/**
 * Click shockwave — expanding ring from the pointer (demo / copy-paste).
 */
export function ClickShockwave({
  className,
  label = "Click me",
}: ClickShockwaveProps) {
  const areaRef = React.useRef<HTMLButtonElement>(null)
  const [waves, setWaves] = React.useState<
    { id: number; x: number; y: number }[]
  >([])

  function spawn(e: React.PointerEvent<HTMLButtonElement>) {
    const el = areaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    setWaves((prev) => [
      ...prev.slice(-5),
      { id: Date.now() + Math.random(), x, y },
    ])
  }

  return (
    <button
      ref={areaRef}
      type="button"
      onPointerDown={spawn}
      className={cn(
        "relative flex size-full min-h-[140px] items-center justify-center overflow-hidden rounded-[24px] bg-transparent text-[13px] font-medium text-[#111111]/70",
        className
      )}
    >
      <span className="relative z-10">{label}</span>

      <AnimatePresence>
        {waves.map((wave) => (
          <React.Fragment key={wave.id}>
            <motion.span
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111]/40"
              style={{ left: wave.x, top: wave.y }}
              initial={{ opacity: 0.55, scale: 0.2 }}
              animate={{ opacity: 0, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#111111]"
              style={{ left: wave.x, top: wave.y }}
              initial={{ opacity: 0.5, scale: 0.2 }}
              animate={{ opacity: 0, scale: 2.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                setWaves((prev) => prev.filter((w) => w.id !== wave.id))
              }}
            />
          </React.Fragment>
        ))}
      </AnimatePresence>
    </button>
  )
}
