"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimTransitionsProps = {
  interval?: number
  className?: string
}

const CSS = `
.naisu-tr {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #FDFDFC;
  border-radius: 20px;
  --c1: #111111;
  --c2: #9C9C9B;
}
.naisu-tr__title {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  gap: 6px;
  z-index: 1;
}
.naisu-tr__title span {
  display: inline-block;
  font-size: clamp(14px, 3.2vw, 22px);
  font-weight: 500;
  line-height: 1.2;
  color: #FDFDFC;
  padding: 3px 12px 4px;
  background: #111111;
  white-space: nowrap;
}
.naisu-tr__layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.naisu-tr__layer::before,
.naisu-tr__layer::after {
  content: "";
  position: absolute;
  inset: 0;
}
.naisu-tr__1::before,
.naisu-tr__1::after {
  animation:
    naisu-tr-slide-in 1s cubic-bezier(0.87, 0.05, 0.02, 0.97) both,
    naisu-tr-slide-out 1s cubic-bezier(0.87, 0.05, 0.02, 0.97) forwards;
}
.naisu-tr__1::before {
  background: var(--c2);
  animation-delay: 0.2s, 1.6s;
}
.naisu-tr__1::after {
  background: var(--c1);
  animation-delay: 0.4s, 1.4s;
}
.naisu-tr__2::before,
.naisu-tr__2::after {
  --skew: 18%;
  animation:
    naisu-tr-mask-in 1s cubic-bezier(0.87, 0.05, 0.02, 0.97) both,
    naisu-tr-mask-out 1s cubic-bezier(0.87, 0.05, 0.02, 0.97) forwards;
}
.naisu-tr__2::before {
  background: var(--c2);
  animation-delay: 2.6s, 4s;
}
.naisu-tr__2::after {
  background: var(--c1);
  animation-delay: 2.8s, 3.8s;
}
.naisu-tr__3::before,
.naisu-tr__3::after {
  animation:
    naisu-tr-wipe-in 0.9s cubic-bezier(0.87, 0.05, 0.02, 0.97) both,
    naisu-tr-wipe-out 0.9s cubic-bezier(0.87, 0.05, 0.02, 0.97) forwards;
}
.naisu-tr__3::before {
  background: var(--c2);
  animation-delay: 5s, 6.3s;
}
.naisu-tr__3::after {
  background: var(--c1);
  animation-delay: 5.2s, 6.1s;
}
.naisu-tr__4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}
.naisu-tr__4-block {
  position: relative;
  overflow: hidden;
}
.naisu-tr__4-block::before,
.naisu-tr__4-block::after {
  content: "";
  position: absolute;
  inset: 0;
  animation:
    naisu-tr-slide-in 0.8s cubic-bezier(0.87, 0.05, 0.02, 0.97) both,
    naisu-tr-slide-out 0.8s cubic-bezier(0.87, 0.05, 0.02, 0.97) forwards;
}
.naisu-tr__4-block::before {
  background: var(--c2);
}
.naisu-tr__4-block::after {
  background: var(--c1);
}
.naisu-tr__4-block:nth-child(1)::before { animation-delay: 7.2s, 8.8s; }
.naisu-tr__4-block:nth-child(1)::after { animation-delay: 7.5s, 8.5s; }
.naisu-tr__4-block:nth-child(2)::before { animation-delay: 7.4s, 9s; }
.naisu-tr__4-block:nth-child(2)::after { animation-delay: 7.7s, 8.7s; }
.naisu-tr__4-block:nth-child(3)::before { animation-delay: 7.1s, 8.7s; }
.naisu-tr__4-block:nth-child(3)::after { animation-delay: 7.4s, 8.4s; }
.naisu-tr__4-block:nth-child(4)::before { animation-delay: 7.5s, 9.1s; }
.naisu-tr__4-block:nth-child(4)::after { animation-delay: 7.8s, 8.8s; }
.naisu-tr__4-block:nth-child(5)::before { animation-delay: 7.3s, 8.9s; }
.naisu-tr__4-block:nth-child(5)::after { animation-delay: 7.6s, 8.6s; }
.naisu-tr__4-block:nth-child(5) {
  grid-column: 1 / -1;
}
@keyframes naisu-tr-slide-in {
  from { transform: translateX(-101%); }
  to { transform: translateX(0); }
}
@keyframes naisu-tr-slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(101%); }
}
@keyframes naisu-tr-mask-in {
  from {
    clip-path: polygon(0 0, 0 0, calc(var(--skew) * -1) 100%, calc(var(--skew) * -1) 100%);
  }
  to {
    clip-path: polygon(0 0, calc(100% + var(--skew)) 0, 100% 100%, calc(var(--skew) * -1) 100%);
  }
}
@keyframes naisu-tr-mask-out {
  from {
    clip-path: polygon(0 0, calc(100% + var(--skew)) 0, 100% 100%, calc(var(--skew) * -1) 100%);
  }
  to {
    clip-path: polygon(100% 0, 100% 0, calc(100% + var(--skew)) 100%, calc(100% + var(--skew)) 100%);
  }
}
@keyframes naisu-tr-wipe-in {
  from { clip-path: circle(0% at 50% 50%); }
  to { clip-path: circle(75% at 50% 50%); }
}
@keyframes naisu-tr-wipe-out {
  from { clip-path: circle(75% at 50% 50%); }
  to { clip-path: circle(0% at 50% 50%); }
}
`

export function AnimTransitions({
  interval = 11000,
  className,
}: AnimTransitionsProps) {
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-tr", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="absolute inset-0">
        <div className="naisu-tr__layer naisu-tr__1" />
        <div className="naisu-tr__layer naisu-tr__2" />
        <div className="naisu-tr__layer naisu-tr__3" />
        <div className="naisu-tr__layer naisu-tr__4">
          <div className="naisu-tr__4-block" />
          <div className="naisu-tr__4-block" />
          <div className="naisu-tr__4-block" />
          <div className="naisu-tr__4-block" />
          <div className="naisu-tr__4-block" />
        </div>
      </div>
      <div className="naisu-tr__title">
        <span>Transitions</span>
      </div>
    </div>
  )
}
