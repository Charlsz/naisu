"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type CssAnimHostProps = {
  css: string
  html: string
  /** Milliseconds between remounts. 0 disables looping. */
  interval?: number
  className?: string
}

/**
 * Plays a self-contained CSS tip inside a shadow root so styles stay isolated.
 */
export function CssAnimHost({
  css,
  html,
  interval = 3600,
  className,
}: CssAnimHostProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    if (!interval || interval <= 0) return
    const id = window.setInterval(() => setCycle((c) => c + 1), interval)
    return () => window.clearInterval(id)
  }, [interval])

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const shadow =
      host.shadowRoot ?? host.attachShadow({ mode: "open" })

    shadow.innerHTML = `<style>${css}</style><div class="naisu-css-anim-root">${html}</div>`
  }, [css, html, cycle])

  return (
    <div
      ref={hostRef}
      className={cn("size-full min-h-[160px]", className)}
      aria-hidden
    />
  )
}
