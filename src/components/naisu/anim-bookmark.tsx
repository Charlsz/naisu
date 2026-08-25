"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimBookmarkProps = {
  /** Scale applied to the 110x110 stage. */
  scale?: number
  /** Milliseconds between replays. */
  interval?: number
  className?: string
}

const BOX = 110

const CSS = `
.naisu-bookmark {
  position: relative;
}

.naisu-bookmark__stage {
  position: absolute;
  top: 0;
  left: 0;
  width: ${BOX}px;
  height: ${BOX}px;
  transform-origin: top left;
}

.naisu-bookmark__box {
  position: absolute;
  inset: 0;
  background-color: #f9f9f9;
  border-radius: 20%;
  overflow: hidden;
}

.naisu-bookmark__scene {
  position: absolute;
  inset: 0;
}

.naisu-bookmark__panel {
  position: absolute;
  inset: 0;
  animation:
    naisu-panel-enter 0.7s cubic-bezier(0.78, 0.01, 0.19, 0.98)
      calc(0s + var(--enter-delay, 0s)) both,
    naisu-panel-flatten 1.4s ease-in-out calc(0s + var(--enter-delay, 0s))
      forwards,
    naisu-panel-exit 0.6s cubic-bezier(0.78, 0.01, 0.19, 0.98)
      calc(0.15s + var(--exit-delay, 0s)) forwards,
    naisu-panel-round 0.6s ease-in-out calc(0s + var(--exit-delay, 0s)) forwards;
}

.naisu-bookmark__panel--pink {
  --enter-delay: 0s;
  --exit-delay: 2.45s;
  background-color: #315FEA;
}

.naisu-bookmark__panel--white {
  --enter-delay: 0.15s;
  --exit-delay: 2.32s;
  background-color: #fff;
}

.naisu-bookmark__panel--blush {
  --enter-delay: 0.3s;
  --exit-delay: 2.2s;
  background-color: #E8EEFC;
}

.naisu-bookmark__book {
  --s: 78px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0%);
  width: var(--s);
  height: var(--s);
}

.naisu-bookmark__shape {
  --c: #999;
  position: absolute;
  top: 0;
  left: 17.5%;
  width: 65%;
  height: 100%;
  background-color: var(--c);
  clip-path: polygon(0 -100%, 100% -100%, 100% 100%, 50% 80%, 0 100%);
}

.naisu-bookmark__shape::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: var(--c);
  transform: translateY(-99%);
}

.naisu-bookmark__shape--main {
  --c: #315FEA;
  transform-origin: top center;
  animation:
    naisu-bookmark-swing 1s ease-in-out 0.6s both,
    naisu-bookmark-tip 0.9s ease-in-out 2.2s forwards;
}

.naisu-bookmark__shine {
  --shine-width: 60px;
  --shine-skew: 60%;
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.25);
  animation: naisu-shine-sweep 2s ease-in-out 1s both;
}

@keyframes naisu-panel-enter {
  from {
    transform: translate(-101%, -40%);
    opacity: 0;
  }
  to {
    transform: translate(0%, 0%);
    opacity: 1;
  }
}

@keyframes naisu-panel-exit {
  from {
    transform: translate(0%, 0%);
  }
  to {
    transform: translate(101%, 0%);
  }
}

@keyframes naisu-panel-flatten {
  from {
    border-radius: 0 0 100% 0;
  }
  to {
    border-radius: 0 0 0 0;
  }
}

@keyframes naisu-panel-round {
  from {
    border-radius: 0 0 0 0;
  }
  to {
    border-radius: 0 0 0 100%;
  }
}

@keyframes naisu-bookmark-swing {
  0% {
    rotate: 25deg;
  }
  40% {
    rotate: -4deg;
  }
  60% {
    rotate: 2deg;
  }
  80% {
    rotate: -1deg;
  }
  100% {
    rotate: 0deg;
  }
}

@keyframes naisu-bookmark-tip {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 20deg;
  }
}

@keyframes naisu-shine-sweep {
  from {
    clip-path: polygon(
      calc(var(--shine-width) * -1) 0,
      0 0,
      calc(var(--shine-skew) * -1) 100%,
      calc((var(--shine-skew) + var(--shine-width)) * -1) 100%
    );
  }
  40%,
  to {
    clip-path: polygon(
      calc(100% + var(--shine-skew)) 0,
      calc(100% + var(--shine-skew) + var(--shine-width)) 0,
      calc(100% + var(--shine-width)) 100%,
      100% 100%
    );
  }
}
`

export function AnimBookmark({
  scale = 1.1,
  interval = 3400,
  className,
}: AnimBookmarkProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div
      className={cn("naisu-bookmark", className)}
      style={{ width: BOX * scale, height: BOX * scale }}
    >
      <style>{CSS}</style>
      <div
        key={cycle}
        className="naisu-bookmark__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="naisu-bookmark__box">
          <div className="naisu-bookmark__scene">
            <div className="naisu-bookmark__book">
              <div className="naisu-bookmark__shape" />
            </div>

            <div className="naisu-bookmark__panel naisu-bookmark__panel--pink" />
            <div className="naisu-bookmark__panel naisu-bookmark__panel--white" />
            <div className="naisu-bookmark__panel naisu-bookmark__panel--blush">
              <div className="naisu-bookmark__book">
                <div className="naisu-bookmark__shape naisu-bookmark__shape--main" />
              </div>
            </div>

            <div className="naisu-bookmark__shine" />
          </div>
        </div>
      </div>
    </div>
  )
}
