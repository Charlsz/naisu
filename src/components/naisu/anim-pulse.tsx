"use client"

import * as React from "react"
import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

export type AnimPulseProps = {
  /** Scale applied to the 84px stage. */
  scale?: number
  /** Milliseconds between replays. */
  interval?: number
  className?: string
}

const STAGE = 84
const PARTICLES = 10

const CSS = `
.naisu-pulse {
  position: relative;
}

.naisu-pulse__stage {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-content: center;
  width: ${STAGE}px;
  height: ${STAGE}px;
  transform-origin: top left;
}

.naisu-pulse__heart {
  --size: 24px;
  position: relative;
  width: var(--size);
  height: var(--size);
  box-sizing: border-box;
}

.naisu-pulse__outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: #9C9C9B;
}

.naisu-pulse__circle {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350%;
  height: 350%;
  border-radius: 50%;
  border: solid 1px #111111;
  animation: naisu-pulse-circle 1.1s cubic-bezier(0, 0.06, 0.29, 1) 0s both;
}

@keyframes naisu-pulse-circle {
  from,
  to {
    opacity: 0;
  }
  50%,
  80% {
    opacity: 0.4;
  }

  from {
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    transform: translate(-50%, -50%) scale(0.4);
  }
}

.naisu-pulse__particles {
  position: absolute;
  inset: 0;
}

.naisu-pulse__particle {
  --d: 0s;
  --size: 5px;
  --translate-y: -28px;
  position: absolute;
  top: calc(45% - (var(--size) / 2));
  left: calc(50% - (var(--size) / 2));
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  animation: naisu-pulse-move 0.65s cubic-bezier(0.63, -0.01, 0.29, 1)
    var(--d, 0s) both;
}

.naisu-pulse__particle::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: #111111;
  animation:
    naisu-pulse-scale-in 0.4s ease-out var(--d, 0s) both,
    naisu-pulse-scale-out 0.4s ease-out calc(0.55s + var(--d, 0s)) forwards;
}

.naisu-pulse__particle:nth-child(2n) {
  --d: 0.1s;
  --size: 4px;
  --translate-y: -27px;
}
.naisu-pulse__particle:nth-child(2n)::before {
  background-color: #9C9C9B;
}

.naisu-pulse__particle:nth-child(3n) {
  --d: 0.2s;
  --size: 3px;
  --translate-y: -26px;
}
.naisu-pulse__particle:nth-child(3n)::before {
  background-color: #111111;
}

.naisu-pulse__particle:nth-child(4n)::before {
  background-color: #9C9C9B;
}

@keyframes naisu-pulse-move {
  from {
    opacity: 0;
    transform: rotate(var(--rotate, 0)) translateY(0);
  }
  to {
    opacity: 1;
    transform: rotate(var(--rotate, 0)) translateY(var(--translate-y, 0px));
  }
}

@keyframes naisu-pulse-scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes naisu-pulse-scale-out {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}

.naisu-pulse__fill {
  position: absolute;
  top: 5%;
  left: 0;
  width: 100%;
  height: 100%;
  animation: naisu-pulse-popup 0.7s ease-in-out 0.15s both;
}

.naisu-pulse__fill svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: #111111;
}

@keyframes naisu-pulse-popup {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.6);
  }
  60% {
    transform: scale(1.04);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.04);
  }
}
`

const HEART_OUTLINE =
  "M16.3 4.6001C14.6 4.6001 13.1 5.28796 12 6.56541C10.9 5.28796 9.4 4.6001 7.7 4.6001C4.6 4.6001 2 7.15501 2 10.2013C2 10.3978 2 10.5943 2 10.7909C2.4 15.4094 7.4 19.2417 10.3 21.1088C10.8 21.4036 11.4 21.6001 12 21.6001C12.6 21.6001 13.2 21.4036 13.7 21.1088C16.6 19.2417 21.6 15.4094 22 10.8891C22 10.6926 22 10.4961 22 10.2995C22 7.15501 19.4 4.6001 16.3 4.6001ZM20 10.5943C19.7 14.525 14.7 18.0625 12.6 19.34C12.2 19.5365 11.8 19.5365 11.4 19.34C9.3 17.9643 4.4 14.4267 4 10.4961C4 10.4961 4 10.2995 4 10.2013C4 8.23593 5.7 6.56541 7.7 6.56541C9.2 6.56541 10.5 7.44981 11.1 8.72726C11.2 9.12033 11.6 9.31686 12 9.31686C12.4 9.31686 12.8 9.12033 12.9 8.72726C13.5 7.44981 14.8 6.56541 16.3 6.56541C18.3 6.56541 20 8.23593 20 10.2013C20 10.2995 20 10.4961 20 10.5943Z"

const HEART_SOLID =
  "M16.2857 3.2998C14.5714 3.2998 13.0476 4.05958 12 5.29422C10.9524 4.05958 9.33333 3.2998 7.61905 3.2998C4.57143 3.2998 2 5.86405 2 8.90316C2 9.0931 2 9.28304 2 9.47299C2.38095 14.1266 7.33333 18.0205 10.2857 19.8249C10.7619 20.1099 11.3333 20.2998 12 20.2998C12.5714 20.2998 13.1429 20.1099 13.7143 19.8249C16.6667 17.9255 21.619 14.1266 22 9.47299C22 9.28304 22 9.0931 22 8.90316C22 5.86405 19.4286 3.2998 16.2857 3.2998Z"

export function AnimPulse({
  scale = 2.4,
  interval = 2400,
  className,
}: AnimPulseProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div
      className={cn("naisu-pulse", className)}
      style={{ width: STAGE * scale, height: STAGE * scale }}
    >
      <style>{CSS}</style>
      <div
        className="naisu-pulse__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <div key={cycle} className="naisu-pulse__heart">
          <svg className="naisu-pulse__outline" viewBox="0 0 24 25">
            <path d={HEART_OUTLINE} />
          </svg>

          <div className="naisu-pulse__circle" />

          <div className="naisu-pulse__particles">
            {Array.from({ length: PARTICLES }, (_, i) => (
              <span
                key={i}
                className="naisu-pulse__particle"
                style={{ "--rotate": `${i * 36}deg` } as CSSProperties}
              />
            ))}
          </div>

          <div className="naisu-pulse__fill">
            <svg viewBox="0 0 24 25">
              <path d={HEART_SOLID} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
