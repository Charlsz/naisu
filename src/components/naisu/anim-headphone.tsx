"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimHeadphoneProps = {
  /** Use the naisu mark instead of the gray circle plate. */
  variant?: "circle" | "naisu"
  interval?: number
  className?: string
}

/**
 * Headphone bob animation. Circle keeps the classic tip look;
 * naisu swaps the plate for /naisu.png.
 */
export function AnimHeadphone({
  variant = "circle",
  interval = 4000,
  className,
}: AnimHeadphoneProps) {
  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-hp", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-hp__stage">
        <div className="naisu-hp__band" />
        <div className="naisu-hp__cup naisu-hp__cup--l" />
        <div className="naisu-hp__cup naisu-hp__cup--r" />
        <div className="naisu-hp__plate">
          {variant === "naisu" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/naisu.png" alt="" className="naisu-hp__mark" draggable={false} />
          ) : (
            <span className="naisu-hp__disc" />
          )}
        </div>
      </div>
    </div>
  )
}

const CSS = `
.naisu-hp {
  display: grid; place-content: center;
  width: 100%; height: 100%;
}
.naisu-hp__stage {
  position: relative;
  width: 96px; height: 96px;
  animation: naisu-hp-bob 1.2s ease-in-out 0.2s both,
             naisu-hp-bob 1.2s ease-in-out 2s forwards;
}
.naisu-hp__band {
  position: absolute;
  top: 18%; left: 18%; right: 18%; height: 38%;
  border: 5px solid #111111;
  border-bottom: none;
  border-radius: 48px 48px 0 0;
}
.naisu-hp__cup {
  position: absolute;
  top: 42%;
  width: 18px; height: 26px;
  background: #111111;
  border-radius: 8px;
}
.naisu-hp__cup--l { left: 12%; }
.naisu-hp__cup--r { right: 12%; }
.naisu-hp__plate {
  position: absolute;
  left: 50%; top: 58%;
  width: 42px; height: 42px;
  transform: translate(-50%, -50%);
  display: grid; place-content: center;
}
.naisu-hp__disc {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: #c5c5c5;
}
.naisu-hp__mark {
  width: 100%; height: 100%;
  object-fit: contain;
  border-radius: 22%;
}
@keyframes naisu-hp-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`
