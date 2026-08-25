"use client"

import * as React from "react"
import {
  BellIcon,
  BookmarkIcon,
  FlagIcon,
  HeartIcon,
  PinIcon,
  StarIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type AnimStampIcon =
  | "bookmark"
  | "star"
  | "heart"
  | "flag"
  | "pin"
  | "bell"

export type AnimStampProps = {
  icon?: AnimStampIcon
  scale?: number
  interval?: number
  className?: string
}

const ICONS: Record<AnimStampIcon, LucideIcon> = {
  bookmark: BookmarkIcon,
  star: StarIcon,
  heart: HeartIcon,
  flag: FlagIcon,
  pin: PinIcon,
  bell: BellIcon,
}

const BOX = 110

/**
 * Panel sweep + stamp reveal (same motion family as Bookmark) for common icons.
 */
export function AnimStamp({
  icon = "bookmark",
  scale = 1.05,
  interval = 3400,
  className,
}: AnimStampProps) {
  const [cycle, setCycle] = React.useState(0)
  const Icon = ICONS[icon]

  React.useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  return (
    <div
      className={cn("naisu-stamp", className)}
      style={{ width: BOX * scale, height: BOX * scale }}
    >
      <style>{CSS}</style>
      <div
        key={cycle}
        className="naisu-stamp__stage"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="naisu-stamp__box">
          <div className="naisu-stamp__scene">
            <div className="naisu-stamp__icon naisu-stamp__icon--ghost">
              <Icon strokeWidth={2.2} />
            </div>
            <div className="naisu-stamp__panel naisu-stamp__panel--a" />
            <div className="naisu-stamp__panel naisu-stamp__panel--b" />
            <div className="naisu-stamp__panel naisu-stamp__panel--c">
              <div className="naisu-stamp__icon naisu-stamp__icon--main">
                <Icon strokeWidth={2.2} fill="currentColor" />
              </div>
            </div>
            <div className="naisu-stamp__shine" />
          </div>
        </div>
      </div>
    </div>
  )
}

const CSS = `
.naisu-stamp { position: relative; }
.naisu-stamp__stage {
  position: absolute; top: 0; left: 0;
  width: ${BOX}px; height: ${BOX}px;
  transform-origin: top left;
}
.naisu-stamp__box {
  position: absolute; inset: 0;
  border-radius: 20%;
  overflow: hidden;
  background: transparent;
}
.naisu-stamp__scene { position: absolute; inset: 0; }
.naisu-stamp__panel {
  position: absolute; inset: 0;
  animation:
    naisu-stamp-enter 0.7s cubic-bezier(0.78, 0.01, 0.19, 0.98) calc(var(--enter-delay, 0s)) both,
    naisu-stamp-exit 0.6s cubic-bezier(0.78, 0.01, 0.19, 0.98) calc(0.15s + var(--exit-delay, 0s)) forwards;
}
.naisu-stamp__panel--a { --enter-delay: 0s; --exit-delay: 2.45s; background: #315FEA; }
.naisu-stamp__panel--b { --enter-delay: 0.15s; --exit-delay: 2.32s; background: #fff; }
.naisu-stamp__panel--c { --enter-delay: 0.3s; --exit-delay: 2.2s; background: #E8EEFC; }
.naisu-stamp__icon {
  position: absolute; inset: 0;
  display: grid; place-content: center;
  color: #315FEA;
}
.naisu-stamp__icon svg { width: 34px; height: 34px; }
.naisu-stamp__icon--ghost { color: #9C9C9B; opacity: 0.45; }
.naisu-stamp__icon--main {
  animation:
    naisu-stamp-swing 1s ease-in-out 0.6s both,
    naisu-stamp-tip 0.9s ease-in-out 2.2s forwards;
  transform-origin: top center;
}
.naisu-stamp__shine {
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.28);
  animation: naisu-stamp-shine 2s ease-in-out 1s both;
}
@keyframes naisu-stamp-enter {
  from { transform: translate(-101%, -40%); opacity: 0; }
  to { transform: translate(0, 0); opacity: 1; }
}
@keyframes naisu-stamp-exit {
  from { transform: translate(0, 0); }
  to { transform: translate(101%, 0); }
}
@keyframes naisu-stamp-swing {
  0% { rotate: 18deg; }
  40% { rotate: -4deg; }
  70% { rotate: 2deg; }
  100% { rotate: 0deg; }
}
@keyframes naisu-stamp-tip {
  from { rotate: 0deg; }
  to { rotate: 12deg; }
}
@keyframes naisu-stamp-shine {
  from {
    clip-path: polygon(-60px 0, 0 0, -40% 100%, calc(-40% - 60px) 100%);
  }
  40%, to {
    clip-path: polygon(140% 0, 160% 0, 120% 100%, 100% 100%);
  }
}
`
