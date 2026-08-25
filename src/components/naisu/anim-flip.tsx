"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimFlipProps = {
  interval?: number
  className?: string
}

/** 3D card flip between two faces. */
export function AnimFlip({ interval = 2800, className }: AnimFlipProps) {
  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-flip", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-flip__card">
        <div className="naisu-flip__face naisu-flip__face--front">A</div>
        <div className="naisu-flip__face naisu-flip__face--back">B</div>
      </div>
    </div>
  )
}

const CSS = `
.naisu-flip {
  display: grid; place-content: center;
  width: 100%; height: 100%;
  perspective: 600px;
}
.naisu-flip__card {
  position: relative;
  width: 88px; height: 88px;
  transform-style: preserve-3d;
  animation: naisu-flip 1.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.2s both;
}
.naisu-flip__face {
  position: absolute; inset: 0;
  display: grid; place-content: center;
  border-radius: 18px;
  font-size: 28px; font-weight: 600;
  backface-visibility: hidden;
}
.naisu-flip__face--front {
  background: #315FEA; color: #fff;
}
.naisu-flip__face--back {
  background: #111111; color: #FDFDFC;
  transform: rotateY(180deg);
}
@keyframes naisu-flip {
  0% { transform: rotateY(0deg); }
  40% { transform: rotateY(180deg); }
  70% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}
`
