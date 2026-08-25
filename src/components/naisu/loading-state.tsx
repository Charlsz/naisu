"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type LoadingVariant =
  | "Drive"
  | "Dots"
  | "Orbit"
  | "Bars"
  | "Ring"
  | "Pulse"
  | "Wave"
  | "Bloom"
  | "Flower"
  | "Jar"
  | "Pointer"

export type LoadingStateProps = {
  variant?: LoadingVariant
  label?: string
  className?: string
}

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3]

const DURATION: Record<"Drive" | "Dots" | "Orbit", number> = {
  Drive: 1.2,
  Dots: 1.1,
  Orbit: 1.28,
}

function cellDelay(
  variant: "Drive" | "Dots" | "Orbit",
  index: number
): number | null {
  const row = Math.floor(index / 3)
  const col = index % 3
  if (variant === "Drive" || variant === "Dots") {
    return (col + Math.abs(row - 1)) * 0.09
  }
  const step = ORBIT_ORDER.indexOf(index)
  return step < 0 ? null : step * 0.11
}

function PixelGrid({ variant }: { variant: "Drive" | "Dots" | "Orbit" }) {
  const round = variant === "Dots"
  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {Array.from({ length: 9 }, (_, i) => {
        const delay = cellDelay(variant, i)
        return (
          <span
            key={i}
            className={cn(
              "size-[6px] bg-[#315FEA]",
              round ? "rounded-full" : "rounded-[2px]"
            )}
            style={
              delay === null
                ? { opacity: 0.12 }
                : {
                    opacity: 0.15,
                    animation: `naisu-pixel-on ${DURATION[variant]}s ease-in-out ${delay}s infinite`,
                  }
            }
          />
        )
      })}
    </div>
  )
}

function BarsMark() {
  return (
    <div className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-[#315FEA]"
          style={{
            height: 6 + (i % 3) * 3,
            animation: `naisu-load-bar 0.85s ease-in-out ${(i * 0.08).toFixed(2)}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function RingMark() {
  return (
    <div className="relative size-4">
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <span
            key={i}
            className="absolute size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#315FEA]"
            style={{
              left: `${50 + Math.cos(a) * 38}%`,
              top: `${50 + Math.sin(a) * 38}%`,
              animation: `naisu-load-ring 0.9s ease-in-out ${(i * 0.08).toFixed(2)}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}

function PulseMark() {
  return (
    <div className="relative size-4">
      <span className="absolute inset-0 rounded-full border border-[#315FEA]/50 naisu-load-pulse-ring" />
      <span className="absolute inset-[28%] rounded-full bg-[#315FEA] naisu-load-pulse-core" />
    </div>
  )
}

function WaveMark() {
  return (
    <div className="flex items-center gap-[3px]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="size-[5px] rounded-full bg-[#315FEA]"
          style={{
            animation: `naisu-load-wave 0.9s ease-in-out ${(i * 0.07).toFixed(2)}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/** 5x5 pixel bloom: diamond opens from the center, blue only. */
const BLOOM_FRAMES = [
  [12],
  [7, 11, 12, 13, 17],
  [2, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18, 22],
  [7, 11, 12, 13, 17],
]

function BloomMark() {
  return (
    <div className="grid size-[18px] grid-cols-5 gap-px">
      {Array.from({ length: 25 }, (_, i) => (
        <span
          key={i}
          className="size-[3px] rounded-[0.5px] bg-[#315FEA] naisu-load-bloom-cell"
          style={
            {
              "--a0": BLOOM_FRAMES[0].includes(i) ? 1 : 0.08,
              "--a1": BLOOM_FRAMES[1].includes(i) ? 1 : 0.08,
              "--a2": BLOOM_FRAMES[2].includes(i) ? 1 : 0.08,
              "--a3": BLOOM_FRAMES[3].includes(i) ? 1 : 0.08,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** 5x5 pixel flower: 4 petals + center, staggered pulse, blue only. */
const FLOWER_PETALS = [
  [2, 7],
  [10, 11],
  [17, 22],
  [13, 14],
]
const FLOWER_CENTER = [12]

function FlowerMark() {
  return (
    <div className="grid size-[18px] grid-cols-5 gap-px">
      {Array.from({ length: 25 }, (_, i) => {
        const petal = FLOWER_PETALS.findIndex((cells) => cells.includes(i))
        const isCenter = FLOWER_CENTER.includes(i)
        if (!isCenter && petal < 0) {
          return <span key={i} className="size-[3px] rounded-[0.5px] bg-[#315FEA]/10" />
        }
        return (
          <span
            key={i}
            className="size-[3px] rounded-[0.5px] bg-[#315FEA]"
            style={{
              opacity: isCenter ? 1 : 0.35,
              animation: isCenter
                ? undefined
                : `naisu-load-flower-pixel 1.1s ease-in-out ${(petal * 0.12).toFixed(2)}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}

function JarMark() {
  return (
    <div className="relative h-[16px] w-[12px] overflow-hidden rounded-[3px_3px_4px_4px] ring-1 ring-[#315FEA]">
      <span className="absolute inset-x-0 top-0 h-[2px] bg-[#315FEA]/40" />
      <span className="naisu-load-jar absolute inset-x-[2px] bottom-[2px] rounded-sm bg-[#315FEA]/70" />
    </div>
  )
}

/** Pixel arrow tip that taps once per cycle. */
function PointerMark() {
  return (
    <div className="relative size-[16px]">
      <div className="naisu-load-pointer absolute top-0 left-0 grid grid-cols-3 gap-px">
        {[1, 1, 0, 1, 0, 0, 1, 1, 0].map((on, i) => (
          <span
            key={i}
            className={cn(
              "size-[3.5px] rounded-[0.5px]",
              on ? "bg-[#315FEA]" : "bg-transparent"
            )}
          />
        ))}
      </div>
      <span className="naisu-load-pointer-dot absolute right-0 bottom-0 size-[3px] rounded-full bg-[#315FEA]" />
    </div>
  )
}

function LoadingMark({ variant }: { variant: LoadingVariant }) {
  if (variant === "Bars") return <BarsMark />
  if (variant === "Ring") return <RingMark />
  if (variant === "Pulse") return <PulseMark />
  if (variant === "Wave") return <WaveMark />
  if (variant === "Bloom") return <BloomMark />
  if (variant === "Flower") return <FlowerMark />
  if (variant === "Jar") return <JarMark />
  if (variant === "Pointer") return <PointerMark />
  return <PixelGrid variant={variant} />
}

function useElapsed() {
  const [ms, setMs] = React.useState(0)
  React.useEffect(() => {
    const start = Date.now()
    const id = window.setInterval(() => setMs(Date.now() - start), 200)
    return () => window.clearInterval(id)
  }, [])
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

/** Compact loading mark + shimmer label used across the gallery. */
export function LoadingState({
  variant = "Drive",
  label = "Reading files…",
  className,
}: LoadingStateProps) {
  const elapsed = useElapsed()

  return (
    <div
      role="status"
      className={cn("flex w-fit items-center gap-2.5", className)}
    >
      <style>{LOAD_CSS}</style>
      <LoadingMark variant={variant} />
      <div className="flex min-w-0 items-baseline gap-1.5">
        <p className="naisu-shimmer truncate text-[10px] font-medium">{label}</p>
        <span className="shrink-0 font-mono text-[10px] text-[#9C9C9B]">
          {elapsed}
        </span>
      </div>
    </div>
  )
}

const LOAD_CSS = `
@keyframes naisu-load-bar {
  0%, 100% { transform: scaleY(0.45); opacity: 0.35; }
  50% { transform: scaleY(1); opacity: 1; }
}
@keyframes naisu-load-ring {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.7); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes naisu-load-wave {
  0%, 100% { transform: translateY(0); opacity: 0.35; }
  50% { transform: translateY(-4px); opacity: 1; }
}
.naisu-load-bloom-cell {
  animation: naisu-load-bloom-pixel 1.35s ease-in-out infinite;
}
@keyframes naisu-load-bloom-pixel {
  0%, 100% { opacity: var(--a0); }
  28% { opacity: var(--a1); }
  55% { opacity: var(--a2); }
  78% { opacity: var(--a3); }
}
@keyframes naisu-load-flower-pixel {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
.naisu-load-jar {
  height: 35%;
  animation: naisu-load-jar 1.3s ease-in-out infinite;
}
@keyframes naisu-load-jar {
  0%, 100% { height: 28%; }
  50% { height: 72%; }
}
.naisu-load-pointer {
  animation: naisu-load-pointer 1s ease-in-out infinite;
  transform-origin: top left;
}
.naisu-load-pointer-dot {
  animation: naisu-load-pointer-dot 1s ease-in-out infinite;
}
@keyframes naisu-load-pointer {
  0%, 100% { transform: translate(0, 0); }
  45% { transform: translate(2px, 3px); }
  55% { transform: translate(2px, 3px); }
}
@keyframes naisu-load-pointer-dot {
  0%, 40% { opacity: 0; transform: scale(0.4); }
  55% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.4); }
}
.naisu-load-pulse-ring {
  animation: naisu-load-pulse-r 1.1s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}
.naisu-load-pulse-core {
  animation: naisu-load-pulse-c 1.1s ease-in-out infinite;
}
@keyframes naisu-load-pulse-r {
  0% { transform: scale(0.55); opacity: 0.55; }
  70% { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(1.15); opacity: 0; }
}
@keyframes naisu-load-pulse-c {
  0%, 100% { transform: scale(0.85); }
  50% { transform: scale(1.1); }
}
`
