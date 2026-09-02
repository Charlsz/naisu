"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type LoadingVariant = "Dots" | "Ring" | "Bars"

export type LoadingStateProps = {
  variant?: LoadingVariant
  label?: string
  className?: string
}

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3]

function cellDelay(index: number): number | null {
  const row = Math.floor(index / 3)
  const col = index % 3
  return (col + Math.abs(row - 1)) * 0.09
}

function DotsMark() {
  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {Array.from({ length: 9 }, (_, i) => {
        const delay = cellDelay(i)
        return (
          <span
            key={i}
            className="size-[6px] rounded-full bg-foreground"
            style={
              delay === null
                ? { opacity: 0.12 }
                : {
                    opacity: 0.15,
                    animation: `naisu-pixel-on 1.1s ease-in-out ${delay}s infinite`,
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
          className="w-[3px] origin-bottom rounded-full bg-foreground"
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
            className="absolute size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
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

function LoadingMark({ variant }: { variant: LoadingVariant }) {
  if (variant === "Bars") return <BarsMark />
  if (variant === "Ring") return <RingMark />
  return <DotsMark />
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

export function LoadingState({
  variant = "Dots",
  label = "Reading files...",
  className,
}: LoadingStateProps) {
  const elapsed = useElapsed()

  return (
    <div
      role="status"
      className={cn("flex w-fit items-center gap-3", className)}
    >
      <style>{LOAD_CSS}</style>
      <LoadingMark variant={variant} />
      <div className="flex min-w-0 items-baseline gap-2">
        <p className="naisu-shimmer truncate text-sm font-medium">{label}</p>
        <span className="shrink-0 font-mono text-[13px] text-muted-foreground">
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
`
