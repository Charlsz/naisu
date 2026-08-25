"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AnimMarqueeProps = {
  className?: string
}

/** Horizontal marquee of label chips. */
export function AnimMarquee({ className }: AnimMarqueeProps) {
  const items = ["ship", "review", "merge", "deploy", "observe", "iterate"]
  return (
    <div className={cn("naisu-marquee", className)}>
      <style>{CSS}</style>
      <div className="naisu-marquee__track">
        {[...items, ...items].map((label, i) => (
          <span key={`${label}-${i}`} className="naisu-marquee__chip">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

const CSS = `
.naisu-marquee {
  display: flex; align-items: center;
  width: 100%; height: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.naisu-marquee__track {
  display: flex; gap: 10px;
  width: max-content;
  animation: naisu-marquee 12s linear infinite;
}
.naisu-marquee__chip {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 999px;
  background: #FDFDFC;
  color: #111111;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 2px rgba(16,24,40,0.06);
  outline: 1px solid rgba(16,24,40,0.08);
}
@keyframes naisu-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`
