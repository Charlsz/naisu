"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimWalkProps = {
  /** Scale applied to the 264×211 stage. */
  scale?: number
  /** Milliseconds between replays. */
  interval?: number
  className?: string
}

const STAGE_W = 264
const STAGE_H = 211

const CSS = `
.naisu-walk {
  position: relative;
}

.naisu-walk__stage {
  position: absolute;
  top: 0;
  left: 0;
  width: ${STAGE_W}px;
  height: ${STAGE_H}px;
  transform-origin: top left;
}

.naisu-walk__box {
  box-sizing: border-box;
  position: absolute;
  inset: 0;
  background-color: transparent;
  border-radius: 40px;
  overflow: hidden;
}

.naisu-walk__animal {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 92px;
  height: 92px;
  border-radius: 22%;
  overflow: hidden;
  transform: translate(-65%, -45%);
  animation:
    naisu-walk-in 0.7s cubic-bezier(0.76, 0, 0.25, 0.97) 0.2s both,
    naisu-walk-mid 0.7s cubic-bezier(0.76, 0, 0.25, 0.97) 1.2s forwards,
    naisu-walk-out 1.5s ease-in-out 2.6s forwards;
}
@keyframes naisu-walk-in {
  from { transform: translate(-80%, -45%); }
  to { transform: translate(-35%, -45%); }
}
@keyframes naisu-walk-mid {
  from { transform: translate(-35%, -45%); }
  to { transform: translate(-15%, -45%); }
}
@keyframes naisu-walk-out {
  from { transform: translate(-15%, -45%); }
  to { transform: translate(-80%, -45%); }
}

.naisu-walk__content {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left bottom;
  animation:
    naisu-walk-bob 0.7s ease-in-out 0.2s both,
    naisu-walk-bob 0.7s ease-in-out 1.2s forwards,
    naisu-walk-bob-out 1.6s ease-out 2.6s forwards;
}
@keyframes naisu-walk-bob {
  from, to { transform: scale(1, 1); }
  50% {
    transform: translateY(-10%) scale(0.95, 1.1) rotate(3deg) skewX(-2deg);
  }
}
@keyframes naisu-walk-bob-out {
  from, to { transform: scale(1, 1); }
  50% {
    transform: translateY(5%) scale(1.1, 0.98) rotate(-4deg) skewX(2deg);
  }
}

.naisu-walk__inner {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center bottom;
  animation: naisu-walk-breathe 1s ease-in-out 0s infinite;
}
@keyframes naisu-walk-breathe {
  from, to { transform: scale(1, 1); }
  50% { transform: scale(1.04, 1.025) skewX(-1deg); }
}

.naisu-walk__line {
  position: absolute;
  right: 100px;
  bottom: 60px;
  width: 200px;
  height: 5px;
  border-radius: 999px;
  background-color: #9C9C9B;
  transform-origin: right bottom;
  animation:
    naisu-walk-line-in 0.7s ease-in-out 0.25s both,
    naisu-walk-line-mid 0.7s ease-in-out 1.25s forwards,
    naisu-walk-line-out 1.4s ease-in-out 2.5s forwards;
}
@keyframes naisu-walk-line-in {
  from, to { bottom: 60px; rotate: 0deg; }
  50% { bottom: 75px; rotate: 3deg; }
  from { transform: translateX(-45%); }
  to { transform: translateX(-15%); }
}
@keyframes naisu-walk-line-mid {
  from, to { bottom: 60px; rotate: 0deg; }
  50% { bottom: 75px; rotate: 2deg; }
  from { transform: translateX(-15%); }
  to { transform: translateX(0%); }
}
@keyframes naisu-walk-line-out {
  from, to { bottom: 60px; right: 100px; rotate: 0deg; }
  50% { bottom: 65px; right: 110px; rotate: 2deg; }
  from { transform: translateX(0%); }
  to { transform: translateX(-45%); }
}

.naisu-walk__line::after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  width: 55px;
  height: 370%;
  background-color: #FDFDFC;
  border-radius: 999px;
  filter: blur(3.5px) drop-shadow(0 0 4px rgba(17, 17, 17, 0.15));
}
`

export function AnimWalk({
  scale = 0.68,
  interval = 4600,
  className,
}: AnimWalkProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div
      className={cn("naisu-walk", className)}
      style={{ width: STAGE_W * scale, height: STAGE_H * scale }}
    >
      <style>{CSS}</style>
      <div
        className="naisu-walk__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <div key={cycle} className="naisu-walk__box">
          <div className="naisu-walk__animal">
            <div className="naisu-walk__content">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="naisu-walk__inner"
                src="/naisu.png"
                alt=""
                draggable={false}
              />
            </div>
          </div>
          <div className="naisu-walk__line" />
        </div>
      </div>
    </div>
  )
}
