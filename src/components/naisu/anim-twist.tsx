"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimTwistProps = {
  interval?: number
  className?: string
}

const CSS = `
.naisu-twist {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.naisu-twist__box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 96px;
  aspect-ratio: 1;
}
.naisu-twist__box::after {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 12%;
  overflow: hidden;
  background-color: #111111;
  transform-origin: left bottom;
  animation:
    naisu-twist-in 0.8s cubic-bezier(0, 0.7, 0.6, 1) both,
    naisu-twist-brake1 0.3s ease-in-out 0.7s both,
    naisu-twist-brake2 0.7s ease-in-out 1s forwards;
}
@keyframes naisu-twist-in {
  from { translate: 200% 0; }
  to { translate: 0 0; }
}
@keyframes naisu-twist-brake1 {
  from { rotate: -14deg; }
  to { rotate: -18deg; }
}
@keyframes naisu-twist-brake2 {
  0% { rotate: -18deg; }
  40%, 70%, 100% { rotate: 0deg; }
  55% { rotate: -2deg; }
  85% { rotate: -1deg; }
}
`

export function AnimTwist({ interval = 3200, className }: AnimTwistProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-twist", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-twist__box" />
    </div>
  )
}
