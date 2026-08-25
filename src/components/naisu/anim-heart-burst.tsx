"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimHeartBurstProps = {
  interval?: number
  className?: string
}

const DECOS = [
  { x: "-100%", y: "60%", r: "-10deg", delay: "0.9s" },
  { x: "-150%", y: "60%", r: "-20deg", delay: "0.4s" },
  { x: "80%", y: "60%", r: "10deg", delay: "0.75s" },
  { x: "120%", y: "60%", r: "20deg", delay: "0.5s" },
  { x: "-10%", y: "20%", r: "-4deg", delay: "1.1s" },
] as const

const PALETTE = [
  "#315FEA",
  "#E9564A",
  "#128A55",
  "#B86E00",
  "#087DBD",
  "#9C9C9B",
  "#111111",
]

const INITIAL_COLORS = [
  "#315FEA",
  "#E9564A",
  "#128A55",
  "#B86E00",
  "#087DBD",
]

function randomColors(n: number) {
  return Array.from({ length: n }, () => {
    return PALETTE[Math.floor(Math.random() * PALETTE.length)]
  })
}

const CSS = `
.naisu-hb {
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
}
.naisu-hb__wrap {
  transform: scale(3.2);
}
.naisu-hb__heart {
  --size: 24px;
  position: relative;
  width: var(--size);
  height: var(--size);
}
.naisu-hb__stroke {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.naisu-hb__deco {
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
  opacity: 0.85;
  animation: naisu-hb-fly 0.8s cubic-bezier(0.64, 0.08, 1, 0.97) var(--delay) both;
}
.naisu-hb__deco-inner {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--c);
  -webkit-mask: url(/css-anims/heart-f.svg) center / contain no-repeat;
  mask: url(/css-anims/heart-f.svg) center / contain no-repeat;
  animation: naisu-hb-move 0.8s cubic-bezier(0, 0.31, 0.18, 0.99) var(--delay) both;
}
@keyframes naisu-hb-fly {
  from, to { opacity: 0; }
  30%, 70% { opacity: 0.9; }
  from { transform: translateY(0); }
  to { transform: translateY(-200%); }
}
@keyframes naisu-hb-move {
  to { transform: translate(var(--x), var(--y)) rotate(var(--r)); }
}
.naisu-hb__pulse {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: visible;
  animation: naisu-hb-scale 1s cubic-bezier(0.71, 0, 0.23, 0.99) 0.2s both;
}
.naisu-hb__pulse path {
  fill: none;
  stroke-width: 0.1px;
  stroke: #9C9C9B;
}
@keyframes naisu-hb-scale {
  from, to { opacity: 0; }
  50% { opacity: 1; }
  from { transform: translateY(4%) scale(1); }
  to { transform: translateY(4%) scale(1.8); }
}
.naisu-hb__fill {
  position: absolute;
  top: 5.3%;
  left: 0;
  width: 100%;
  height: 100%;
  animation: naisu-hb-pop 0.7s ease-in-out 0.15s both;
}
@keyframes naisu-hb-pop {
  0% { transform: scale(0); }
  40% { transform: scale(1.6); }
  60% { transform: scale(1.04); }
  80% { transform: scale(1.1); }
  100% { transform: scale(1.04); }
}
`

export function AnimHeartBurst({
  interval = 4200,
  className,
}: AnimHeartBurstProps) {
  const [cycle, setCycle] = React.useState(0)
  // Stable on SSR + first client paint; randomized only after mount / each loop
  const [colors, setColors] = React.useState<string[]>(INITIAL_COLORS)

  React.useEffect(() => {
    setColors(randomColors(DECOS.length))
  }, [cycle])

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div className={cn("naisu-hb", className)}>
      <style>{CSS}</style>
      <div key={cycle} className="naisu-hb__wrap">
        <div className="naisu-hb__heart">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="naisu-hb__stroke"
            src="/css-anims/heart-s.svg"
            alt=""
          />
          {DECOS.map((d, i) => (
            <div
              key={i}
              className="naisu-hb__deco"
              style={
                {
                  "--delay": d.delay,
                } as React.CSSProperties
              }
            >
              <span
                className="naisu-hb__deco-inner"
                style={
                  {
                    "--c": colors[i],
                    "--x": d.x,
                    "--y": d.y,
                    "--r": d.r,
                    "--delay": d.delay,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
          <svg className="naisu-hb__pulse" viewBox="0 0 24 25">
            <path d="M16.2857 3.2998C14.5714 3.2998 13.0476 4.05958 12 5.29422C10.9524 4.05958 9.33333 3.2998 7.61905 3.2998C4.57143 3.2998 2 5.86405 2 8.90316C2 9.0931 2 9.28304 2 9.47299C2.38095 14.1266 7.33333 18.0205 10.2857 19.8249C10.7619 20.1099 11.3333 20.2998 12 20.2998C12.5714 20.2998 13.1429 20.1099 13.7143 19.8249C16.6667 17.9255 21.619 14.1266 22 9.47299C22 9.28304 22 9.0931 22 8.90316C22 5.86405 19.4286 3.2998 16.2857 3.2998Z" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="naisu-hb__fill"
            src="/css-anims/heart-f.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}
