"use client"

import * as React from "react"
import {
  BellIcon,
  StarIcon,
  ThumbsUpIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type AnimReactIcon = "star" | "zap" | "bell" | "thumb"
export type AnimReactMotion = "pulse" | "burst" | "fill"

export type AnimReactProps = {
  icon?: AnimReactIcon
  motion?: AnimReactMotion
  interval?: number
  className?: string
}

const ICONS: Record<AnimReactIcon, LucideIcon> = {
  star: StarIcon,
  zap: ZapIcon,
  bell: BellIcon,
  thumb: ThumbsUpIcon,
}

const BURST = [
  { x: "-110%", y: "-40%", r: "-18deg", delay: "0.35s" },
  { x: "100%", y: "-50%", r: "16deg", delay: "0.5s" },
  { x: "-130%", y: "40%", r: "-28deg", delay: "0.65s" },
  { x: "120%", y: "35%", r: "22deg", delay: "0.8s" },
  { x: "10%", y: "-120%", r: "6deg", delay: "0.95s" },
] as const

const COLORS = ["#315FEA", "#E9564A", "#128A55", "#B86E00", "#087DBD", "#111111"]

const CSS = `
.naisu-react {
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
}
.naisu-react__stage {
  position: relative;
  width: 72px;
  height: 72px;
}
.naisu-react__icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  color: #111111;
}
.naisu-react__icon svg {
  width: 28px;
  height: 28px;
}
.naisu-react__pulse-ring {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  border: 1px solid #111111;
  animation: naisu-react-ring 1.1s cubic-bezier(0, 0.06, 0.29, 1) both;
}
@keyframes naisu-react-ring {
  from, to { opacity: 0; transform: scale(0.4); }
  45%, 70% { opacity: 0.35; }
  to { transform: scale(1.15); }
}
.naisu-react__pulse-pop {
  animation: naisu-react-pop 0.7s ease-in-out 0.1s both;
}
@keyframes naisu-react-pop {
  0% { transform: scale(0); }
  40% { transform: scale(1.35); }
  65% { transform: scale(0.96); }
  100% { transform: scale(1); }
}
.naisu-react__burst {
  position: absolute;
  inset: 18%;
  opacity: 0.9;
  animation: naisu-react-fly 0.85s cubic-bezier(0.64, 0.08, 1, 0.97) var(--delay) both;
}
.naisu-react__burst-inner {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  color: var(--c);
  animation: naisu-react-move 0.85s cubic-bezier(0, 0.31, 0.18, 0.99) var(--delay) both;
}
.naisu-react__burst-inner svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}
@keyframes naisu-react-fly {
  from, to { opacity: 0; }
  30%, 70% { opacity: 0.95; }
  from { transform: translateY(0); }
  to { transform: translateY(-160%); }
}
@keyframes naisu-react-move {
  to { transform: translate(var(--x), var(--y)) rotate(var(--r)); }
}
.naisu-react__fill-outline {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  color: #9C9C9B;
  opacity: 0.55;
}
.naisu-react__fill-solid {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  color: #111111;
  animation: naisu-react-fill 0.75s ease-in-out 0.15s both;
}
.naisu-react__fill-solid svg {
  fill: currentColor;
}
@keyframes naisu-react-fill {
  0% { transform: scale(0); opacity: 0; }
  45% { transform: scale(1.4); opacity: 1; }
  70% { transform: scale(0.96); }
  100% { transform: scale(1.05); }
}
`

export function AnimReact({
  icon = "star",
  motion = "pulse",
  interval = 3600,
  className,
}: AnimReactProps) {
  const [cycle, setCycle] = React.useState(0)
  const Icon = ICONS[icon]

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-react", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-react__stage">
        {motion === "pulse" ? (
          <>
            <span className="naisu-react__pulse-ring" />
            <span className="naisu-react__icon naisu-react__pulse-pop">
              <Icon strokeWidth={2.25} />
            </span>
          </>
        ) : null}

        {motion === "burst" ? (
          <>
            {BURST.map((b, i) => (
              <span
                key={i}
                className="naisu-react__burst"
                style={{ "--delay": b.delay } as React.CSSProperties}
              >
                <span
                  className="naisu-react__burst-inner"
                  style={
                    {
                      "--c": COLORS[i % COLORS.length],
                      "--x": b.x,
                      "--y": b.y,
                      "--r": b.r,
                      "--delay": b.delay,
                    } as React.CSSProperties
                  }
                >
                  <Icon strokeWidth={0} />
                </span>
              </span>
            ))}
            <span className="naisu-react__icon naisu-react__pulse-pop">
              <Icon strokeWidth={2.25} fill="currentColor" />
            </span>
          </>
        ) : null}

        {motion === "fill" ? (
          <>
            <span className="naisu-react__fill-outline">
              <Icon strokeWidth={2} />
            </span>
            <span className="naisu-react__fill-solid">
              <Icon strokeWidth={0} />
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}
