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

/** Petals open from a center bud, like a bloom. */
function BloomMark() {
  return (
    <div className="relative size-[18px]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="naisu-load-bloom-petal absolute top-1/2 left-1/2 block h-[7px] w-[4.5px] -translate-x-1/2 rounded-full bg-[#315FEA]"
          style={
            {
              "--rot": `${i * 60}deg`,
              animationDelay: `${(i * 0.04).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
      <span className="absolute top-1/2 left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#315FEA]" />
    </div>
  )
}

/** Classic flower: rounded petals around a round center. */
function FlowerMark() {
  return (
    <div className="relative size-[18px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="naisu-load-flower-petal absolute top-1/2 left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-[45%]"
          style={
            {
              "--rot": `${i * 72}deg`,
              animationDelay: `${(i * 0.08).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
      <span className="absolute top-1/2 left-1/2 z-[1] size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#315FEA]" />
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

/** Mouse pointer that moves and clicks. */
function PointerMark() {
  return (
    <div className="relative size-[18px]">
      <span className="naisu-load-pointer-ring absolute top-[10px] left-[10px] size-[8px] rounded-full border border-[#315FEA]/45" />
      <svg
        className="naisu-load-pointer absolute top-0 left-0 size-[12px] text-[#315FEA]"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden
      >
        <path d="M2.2 1.1 13.4 8.2l-4.2.5 2.5 5.4-1.7.8-2.5-5.4-3.3 3.1z" />
      </svg>
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
.naisu-load-bloom-petal {
  transform-origin: center bottom;
  animation: naisu-load-bloom 1.2s cubic-bezier(0.34, 1.35, 0.64, 1) infinite;
}
@keyframes naisu-load-bloom {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-1px) scaleY(0.45) scaleX(0.7);
    opacity: 0.35;
  }
  45% {
    transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-6px) scaleY(1) scaleX(1);
    opacity: 1;
  }
  70% {
    transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-5px) scaleY(0.92) scaleX(0.95);
    opacity: 0.9;
  }
}
.naisu-load-flower-petal {
  background: #315FEA;
  transform-origin: center center;
  animation: naisu-load-flower 1.25s ease-in-out infinite;
}
@keyframes naisu-load-flower {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-4px) scale(0.72);
    opacity: 0.45;
  }
  50% {
    transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-5.5px) scale(1);
    opacity: 1;
  }
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
  animation: naisu-load-pointer 1.05s ease-in-out infinite;
  transform-origin: top left;
  filter: drop-shadow(0 0.5px 0 rgba(16,24,40,0.15));
}
.naisu-load-pointer-ring {
  animation: naisu-load-pointer-ring 1.05s ease-out infinite;
}
@keyframes naisu-load-pointer {
  0%, 100% { transform: translate(0, 0); }
  40% { transform: translate(3px, 4px); }
  55% { transform: translate(3px, 4px) scale(0.92); }
  70% { transform: translate(3px, 4px); }
}
@keyframes naisu-load-pointer-ring {
  0%, 35% { transform: scale(0.2); opacity: 0; }
  45% { transform: scale(0.55); opacity: 0.55; }
  100% { transform: scale(1.35); opacity: 0; }
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
