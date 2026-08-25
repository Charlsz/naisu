"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimDrawProps = {
  /** Scale applied to the 160x160 stage. */
  scale?: number
  /** Milliseconds between replays. */
  interval?: number
  className?: string
}

const STAGE = 160

const CSS = `
.naisu-draw {
  position: relative;
}

.naisu-draw__stage {
  position: absolute;
  top: 0;
  left: 0;
  width: ${STAGE}px;
  height: ${STAGE}px;
  transform-origin: top left;
}

.naisu-draw__line {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
}

.naisu-draw__polyline {
  --stroke-length: 231px;
  --stroke-width: 11px;
  fill: none;
  stroke: #888;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation:
    naisu-draw-line 1.2s ease-in-out 0s both,
    naisu-clear-line 1.2s ease-in-out 1.3s forwards;
}

@keyframes naisu-draw-line {
  from {
    opacity: 0;
    stroke-dasharray: 0 var(--stroke-length);
    stroke-width: calc(var(--stroke-width) * 0.45);
  }
  10%,
  to {
    opacity: 1;
    stroke-dasharray: var(--stroke-length) var(--stroke-length);
    stroke-width: var(--stroke-width);
  }
}

@keyframes naisu-clear-line {
  from,
  90% {
    opacity: 1;
    stroke-dashoffset: 0;
  }
  to {
    opacity: 0;
    stroke-dashoffset: calc(var(--stroke-length) * -1);
  }
}
`

export function AnimDraw({ scale = 1, interval = 2800, className }: AnimDrawProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div
      className={cn("naisu-draw", className)}
      style={{ width: STAGE * scale, height: STAGE * scale }}
    >
      <style>{CSS}</style>
      <div
        key={cycle}
        className="naisu-draw__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <svg className="naisu-draw__line" viewBox="0 0 48.87 48.78" aria-hidden>
          <polyline
            className="naisu-draw__polyline"
            points="6.01 15.13 24.92 5.5 5.5 29.59 42.73 10.02 7.42 41.24 43.37 23.89 22.39 43.28 42.99 37.97"
          />
        </svg>
      </div>
    </div>
  )
}
