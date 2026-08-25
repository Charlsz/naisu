"use client"

import { cn } from "@/lib/utils"

export type AnimSwayProps = {
  /** Scale applied to the 150×60 box. */
  scale?: number
  className?: string
}

const BOX_W = 150
const BOX_H = 60

const CSS = `
.naisu-sway {
  position: relative;
}

.naisu-sway__stage {
  position: absolute;
  top: 0;
  left: 0;
  width: ${BOX_W}px;
  height: ${BOX_H}px;
  transform-origin: top left;
}

.naisu-sway__box {
  position: relative;
  width: 100%;
  height: 100%;
}

.naisu-sway__box::before,
.naisu-sway__box::after {
  content: "";
  position: absolute;
  z-index: 1;
}

.naisu-sway__box::before {
  inset: 0;
  background-color: #9C9C9B;
  border-radius: 20px 20px 5px 5px;
}

.naisu-sway__box::after {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: #111111;
  border-radius: 0 0 5px 5px;
}

.naisu-sway__paper {
  position: absolute;
  bottom: 99%;
  left: 50%;
  width: 70%;
  height: 50%;
  transform: translate(-50%, 0);
  transform-origin: center bottom;
  background-color: #FDFDFC;
  clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 100%);
}

.naisu-sway__paper--pull {
  animation: naisu-sway-pull 1.4s ease-in-out 0s infinite both;
}

.naisu-sway__paper--push {
  animation: naisu-sway-push 1.4s ease-in-out 0s infinite both;
}

@keyframes naisu-sway-pull {
  0%,
  14.29% {
    opacity: 1;
    height: 50%;
    transform: translate(-50%, 0);
  }
  37.5% {
    height: 80%;
    transform: translate(-50%, 0);
  }
  51.43% {
    opacity: 1;
  }
  60.71%,
  100% {
    opacity: 0;
    height: 80%;
    transform: translate(-50%, -200%) rotate(20deg);
  }
}

@keyframes naisu-sway-push {
  0%,
  25% {
    height: 50%;
    bottom: 0;
  }
  55% {
    height: 80%;
  }
  75%,
  100% {
    height: 50%;
    bottom: 99%;
  }
}
`

export function AnimSway({ scale = 1.15, className }: AnimSwayProps) {
  return (
    <div
      className={cn("naisu-sway", className)}
      style={{ width: BOX_W * scale, height: BOX_H * scale }}
    >
      <style>{CSS}</style>
      <div
        className="naisu-sway__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="naisu-sway__box">
          <div className="naisu-sway__paper naisu-sway__paper--push" />
          <div className="naisu-sway__paper naisu-sway__paper--pull" />
        </div>
      </div>
    </div>
  )
}
