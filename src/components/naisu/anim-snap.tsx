"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimSnapProps = {
  interval?: number
  className?: string
}

/** Soft rubber-band snap into place. */
export function AnimSnap({ interval = 2400, className }: AnimSnapProps) {
  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-snap", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-snap__dot" />
    </div>
  )
}

const CSS = `
.naisu-snap {
  display: grid; place-content: center;
  width: 100%; height: 100%;
}
.naisu-snap__dot {
  width: 28px; height: 28px;
  border-radius: 10px;
  background: #315FEA;
  animation: naisu-snap 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes naisu-snap {
  0% { transform: translateX(-70px) scale(0.7); opacity: 0; }
  55% { transform: translateX(8px) scale(1.08); opacity: 1; }
  75% { transform: translateX(-3px) scale(0.97); }
  100% { transform: translateX(0) scale(1); }
}
`
