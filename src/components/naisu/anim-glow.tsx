"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimGlowProps = {
  interval?: number
  className?: string
}

/** Soft expanding glow rings from a core. */
export function AnimGlow({ interval = 2600, className }: AnimGlowProps) {
  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-glow", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-glow__stage">
        <span className="naisu-glow__ring" style={{ animationDelay: "0s" }} />
        <span className="naisu-glow__ring" style={{ animationDelay: "0.25s" }} />
        <span className="naisu-glow__core" />
      </div>
    </div>
  )
}

const CSS = `
.naisu-glow {
  display: grid; place-content: center;
  width: 100%; height: 100%;
}
.naisu-glow__stage {
  position: relative;
  width: 64px; height: 64px;
}
.naisu-glow__ring {
  position: absolute; inset: 8%;
  border-radius: 50%;
  border: 1.5px solid #315FEA;
  animation: naisu-glow-ring 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.naisu-glow__core {
  position: absolute; inset: 34%;
  border-radius: 50%;
  background: #315FEA;
  animation: naisu-glow-core 1.4s ease-in-out both;
}
@keyframes naisu-glow-ring {
  from { transform: scale(0.35); opacity: 0.7; }
  to { transform: scale(1.25); opacity: 0; }
}
@keyframes naisu-glow-core {
  0%, 100% { transform: scale(0.9); }
  40% { transform: scale(1.15); }
  70% { transform: scale(1); }
}
`
