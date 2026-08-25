"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  CheckIcon,
  RefreshCwIcon,
  ScissorsIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const LEAD = "Ship note: "
const PICKED = "hold canary at 5% until errors cool."
const REWRITE = "keep canary at 5% until errors stay under 0.2%."

type Mode = "idle" | "thinking" | "streaming" | "result"

const iconCls = "size-3 shrink-0"
const control =
  "inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full px-2 text-[10px] text-[#111111] transition-colors hover:bg-[#315FEA]/8 active:scale-[0.96]"
const primary =
  "inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full bg-[#315FEA] px-2 text-[10px] text-white active:scale-[0.96]"

export type SelectionActionsProps = {
  className?: string
}

/** Compact contextual edit bar anchored under a text highlight. */
export function SelectionActions({ className }: SelectionActionsProps) {
  const [shown, setShown] = React.useState(false)
  const [mode, setMode] = React.useState<Mode>("idle")
  const [action, setAction] = React.useState("Improve")
  const [kept, setKept] = React.useState(false)
  const [streamed, setStreamed] = React.useState(0)
  const [anchor, setAnchor] = React.useState({ x: 0, y: 0 })
  const [positioned, setPositioned] = React.useState(false)

  const hostRef = React.useRef<HTMLDivElement>(null)
  const selectionRef = React.useRef<HTMLSpanElement>(null)
  const frameRef = React.useRef<number | null>(null)
  const rewriteChars = React.useMemo(() => Array.from(REWRITE), [])

  React.useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 200)
    return () => window.clearTimeout(t)
  }, [])

  React.useEffect(() => {
    if (mode !== "thinking") return
    const t = window.setTimeout(() => {
      setStreamed(0)
      setMode("streaming")
    }, 550)
    return () => window.clearTimeout(t)
  }, [mode])

  React.useEffect(() => {
    if (mode !== "streaming") return
    if (streamed >= rewriteChars.length) {
      setMode("result")
      return
    }
    const id = window.setTimeout(() => setStreamed((n) => n + 1), 16)
    return () => window.clearTimeout(id)
  }, [mode, streamed, rewriteChars.length])

  const place = React.useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const host = hostRef.current
      const selection = selectionRef.current
      if (!host || !selection) return
      const bounds = selection.getBoundingClientRect()
      const lines = Array.from(selection.getClientRects())
      const last = lines.at(-1)
      if (!last) return
      const hostBounds = host.getBoundingClientRect()
      const next = {
        x: Math.round(bounds.left - hostBounds.left + bounds.width / 2),
        y: Math.round(last.bottom - hostBounds.top + 6),
      }
      setAnchor((c) => (c.x === next.x && c.y === next.y ? c : next))
      setPositioned(true)
    })
  }, [])

  React.useLayoutEffect(() => {
    place()
  }, [mode, place])

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const ro = new ResizeObserver(place)
    ro.observe(host)
    return () => {
      ro.disconnect()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [place])

  const run = (next: string) => {
    setAction(next)
    setMode("thinking")
  }

  const resetChrome = () => {
    setStreamed(0)
    setMode("idle")
  }

  const busy = mode === "thinking" || mode === "streaming"
  const visible = shown && positioned
  const baseText = kept ? REWRITE : PICKED
  const selectionText =
    mode === "idle" || mode === "thinking"
      ? baseText
      : mode === "streaming"
        ? rewriteChars.slice(0, streamed).join("")
        : REWRITE

  return (
    <div className={cn("w-full max-w-[260px]", className)}>
      <div ref={hostRef} className="relative select-none pb-11">
        <p className="text-[11px] leading-snug text-[#344054]">
          {LEAD}
          <span
            ref={selectionRef}
            className="box-decoration-clone rounded-[3px] bg-[#315FEA]/14 text-[#111111]"
          >
            {selectionText}
          </span>
        </p>

        <div
          className="absolute top-0 left-0 z-10"
          style={{
            transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`,
            transition: "transform 280ms cubic-bezier(0.23,1,0.32,1), opacity 160ms ease-out",
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          <div className="flex h-8 w-fit max-w-[min(100vw-32px,260px)] items-center gap-0.5 overflow-hidden rounded-full bg-[#FDFDFC] p-0.5 shadow-[0_4px_16px_rgba(16,24,40,0.12)] ring-1 ring-[#101828]/8">
            {busy ? (
              <span className="inline-flex h-6 items-center gap-1 px-2 text-[10px] text-[#667085]">
                <span
                  className="size-2.5 shrink-0 rounded-full border border-[#C5D1E1] border-t-[#315FEA]"
                  style={{ animation: "naisu-spin 700ms linear infinite" }}
                />
                {action}…
              </span>
            ) : null}

            {mode === "result" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setKept(true)
                    resetChrome()
                  }}
                  className={primary}
                >
                  <CheckIcon className={iconCls} strokeWidth={2.4} />
                  Keep
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setKept(false)
                    resetChrome()
                  }}
                  className={control}
                >
                  <XIcon className={iconCls} strokeWidth={2} />
                  Undo
                </button>
                <button
                  type="button"
                  aria-label="Retry"
                  onClick={() => run(action)}
                  className="flex size-6 items-center justify-center rounded-full text-[#9C9C9B] hover:bg-[#111111]/5"
                >
                  <RefreshCwIcon className={iconCls} strokeWidth={2} />
                </button>
              </>
            ) : null}

            {mode === "idle" ? (
              <>
                <button type="button" onClick={() => run("Improve")} className={control}>
                  <SparklesIcon className={iconCls} strokeWidth={1.8} />
                  Improve
                </button>
                <button type="button" onClick={() => run("Shorten")} className={control}>
                  <ScissorsIcon className={iconCls} strokeWidth={1.8} />
                  Shorten
                </button>
                <button
                  type="button"
                  aria-label="Send"
                  onClick={() => run("Improve")}
                  className="flex size-6 items-center justify-center rounded-full bg-[#315FEA] text-white"
                >
                  <ArrowUpIcon className="size-3" strokeWidth={2.4} />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
