"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimPaperProps = {
  scale?: number
  interval?: number
  className?: string
}

const BOX = 150

const CSS = `
.naisu-paper {
  position: relative;
}
.naisu-paper__stage {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  transform-origin: center;
}
.naisu-paper__box {
  position: relative;
  width: ${BOX}px;
  aspect-ratio: 1;
  border-radius: 20%;
  background-color: #FDFDFC;
  overflow: hidden;
  transform: translateZ(0);
}
.naisu-paper__sheet {
  display: grid;
  place-content: center;
  position: absolute;
  inset: 0;
  background-color: #111111;
  animation:
    naisu-paper-in 0.8s cubic-bezier(0.78, 0, 0.2, 1) both,
    naisu-paper-radius 1.5s ease-in-out forwards;
}
.naisu-paper__text {
  font-size: 72px;
  font-weight: 900;
  line-height: 1;
  color: #FDFDFC;
  padding-bottom: 4px;
  transform-origin: bottom center;
  animation: naisu-paper-scale 0.8s cubic-bezier(0.78, 0, 0.2, 1) 0.05s both;
}
@keyframes naisu-paper-in {
  from { transform: translate(-51%, 101%); opacity: 0; }
  to { transform: translate(0%, 0%); opacity: 1; }
}
@keyframes naisu-paper-radius {
  from { border-radius: 0 100% 0 0; }
  to { border-radius: 0; }
}
@keyframes naisu-paper-scale {
  from { transform: scale(1.4, 0); }
  to { transform: scale(1, 1); }
}
`

export function AnimPaper({
  scale = 1,
  interval = 3200,
  className,
}: AnimPaperProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div
      className={cn("naisu-paper size-full", className)}
      style={{ transform: `scale(${scale})` }}
    >
      <style>{CSS}</style>
      <div className="naisu-paper__stage">
        <div key={cycle} className="naisu-paper__box">
          <div className="naisu-paper__sheet">
            <span className="naisu-paper__text">A</span>
          </div>
        </div>
      </div>
    </div>
  )
}
