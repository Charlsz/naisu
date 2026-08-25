"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimStretchProps = {
  interval?: number
  className?: string
}

const CSS = `
.naisu-stretch {
  position: relative;
  width: 100%;
  height: 100%;
}
.naisu-stretch__box {
  display: grid;
  place-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -50%);
  width: 96px;
  aspect-ratio: 1;
}
.naisu-stretch__box::after {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 20%;
  overflow: hidden;
  background-color: #111111;
  transform-origin: right bottom;
  animation: naisu-stretch-roll 0.55s ease-out 0.1s both;
}
@keyframes naisu-stretch-roll {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(90deg); }
  50.1% { transform: translateX(100%); }
  75% { transform: translateX(100%) rotate(8deg); }
  100% { transform: translateX(100%); }
}
`

export function AnimStretch({
  interval = 2800,
  className,
}: AnimStretchProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-stretch", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-stretch__box" />
    </div>
  )
}
