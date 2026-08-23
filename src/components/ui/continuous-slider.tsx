"use client"

import * as React from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react"

import { cn } from "@/lib/utils"

export type ContinuousSliderItem = {
  id: string
  name: string
  logoSrc?: string
  logoAlt?: string
}

type ContinuousSliderProps = {
  items: ContinuousSliderItem[]
  /** Seconds for one full loop of the filled segment */
  duration?: number
  /** Multiplier applied to duration while hovered (higher = slower) */
  hoverSlowdown?: number
  /** Gap between items (px) */
  gap?: number
  fade?: boolean
  className?: string
}

/**
 * Continuous horizontal slider.
 * Repeats the sequence until one segment fills the viewport, then
 * duplicates that segment so translateX(-segmentWidth) loops seamlessly.
 * Slows further on hover instead of pausing.
 */
export function ContinuousSlider({
  items,
  duration = 40,
  hoverSlowdown = 2.75,
  gap = 48,
  fade = true,
  className,
}: ContinuousSliderProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const probeRef = React.useRef<HTMLDivElement>(null)
  const segmentRef = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [segmentWidth, setSegmentWidth] = React.useState(0)
  const [reps, setReps] = React.useState(4)
  const [hovered, setHovered] = React.useState(false)
  const controlsRef = React.useRef<ReturnType<typeof animate> | null>(null)

  React.useEffect(() => {
    const root = rootRef.current
    const probe = probeRef.current
    if (!root || !probe || items.length === 0) return

    const measure = () => {
      const containerW = root.clientWidth
      const onePass = probe.offsetWidth
      if (onePass <= 0 || containerW <= 0) return

      const need = Math.max(2, Math.ceil((containerW * 1.75) / onePass))
      setReps((prev) => (prev === need ? prev : need))

      const seg = segmentRef.current
      if (seg) {
        const w = seg.offsetWidth
        setSegmentWidth((prev) => (prev === w ? prev : w))
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    ro.observe(probe)
    if (segmentRef.current) ro.observe(segmentRef.current)
    return () => ro.disconnect()
  }, [items, gap, reps])

  const activeDuration = hovered ? duration * hoverSlowdown : duration

  React.useEffect(() => {
    controlsRef.current?.stop()
    controlsRef.current = null

    if (reduceMotion || segmentWidth <= 0) return

    let start = x.get()
    start = ((start % segmentWidth) + segmentWidth) % segmentWidth
    if (start > 0) start -= segmentWidth
    x.set(start)

    const distance = Math.abs(-segmentWidth - start)
    const firstDur = Math.max(
      0.01,
      activeDuration * (distance / segmentWidth)
    )

    const loop = (from: number, dur: number) => {
      controlsRef.current = animate(x, [from, -segmentWidth], {
        duration: dur,
        ease: "linear",
        onComplete: () => {
          x.set(0)
          loop(0, activeDuration)
        },
      })
    }

    loop(start, firstDur)

    return () => {
      controlsRef.current?.stop()
      controlsRef.current = null
    }
  }, [segmentWidth, activeDuration, reduceMotion, x])

  const sequence = React.useMemo(() => {
    const out: ContinuousSliderItem[] = []
    for (let i = 0; i < reps; i++) {
      for (const item of items) {
        out.push({ ...item, id: `${item.id}-${i}` })
      }
    }
    return out
  }, [items, reps])

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full max-w-full overflow-hidden", className)}
      style={
        fade
          ? {
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            }
          : undefined
      }
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        ref={probeRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 flex items-center opacity-0"
        style={{ gap: `${gap}px` }}
      >
        {items.map((item) => (
          <ContinuousSliderCell key={`probe-${item.id}`} item={item} />
        ))}
      </div>

      <motion.div
        className="flex w-max will-change-transform"
        style={{ x, gap: `${gap}px` }}
      >
        <div
          ref={segmentRef}
          className="flex shrink-0 items-center"
          style={{ gap: `${gap}px` }}
        >
          {sequence.map((item) => (
            <ContinuousSliderCell key={item.id} item={item} />
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-center"
          style={{ gap: `${gap}px` }}
        >
          {sequence.map((item) => (
            <ContinuousSliderCell key={`${item.id}-dup`} item={item} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ContinuousSliderCell({ item }: { item: ContinuousSliderItem }) {
  if (item.logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.logoSrc}
        alt={item.logoAlt ?? item.name}
        className="h-8 w-auto shrink-0 object-contain opacity-70"
        draggable={false}
      />
    )
  }

  return (
    <span className="shrink-0 text-[13px] font-medium tracking-[0.08em] text-[#111111]/60 select-none">
      {item.name}
    </span>
  )
}

