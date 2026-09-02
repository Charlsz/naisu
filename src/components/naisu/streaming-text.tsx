"use client"

import * as React from "react"
import {
  BookmarkIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  RefreshCwIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type StreamingSource = { label: string; meta?: string }

export type StreamingTextProps = {
  text?: string
  loop?: boolean
  speed?: number
  cite?: string
  sources?: StreamingSource[]
  followUps?: string[]
  /** Start fully rendered (gallery / settled state). */
  complete?: boolean
  className?: string
}

const DEFAULT_TEXT = "Patched model.ts and re-ran the suite. 12 tests pass."

const DEFAULT_SOURCES: StreamingSource[] = [
  { label: "model.ts", meta: "L18–42" },
  { label: "parser.ts", meta: "L7" },
]

const DEFAULT_FOLLOW_UPS = ["Show the diff", "Run again"]

export function StreamingText({
  text = DEFAULT_TEXT,
  loop = true,
  speed = 28,
  cite = "model.ts",
  sources = DEFAULT_SOURCES,
  followUps = DEFAULT_FOLLOW_UPS,
  complete = false,
  className,
}: StreamingTextProps) {
  const chars = React.useMemo(() => Array.from(text), [text])
  const [shown, setShown] = React.useState(complete ? chars.length : 0)
  const [copied, setCopied] = React.useState(false)
  const [openSources, setOpenSources] = React.useState(false)
  const streaming = shown < chars.length
  const visible = chars.slice(0, shown).join("")

  React.useEffect(() => {
    if (complete) {
      setShown(chars.length)
      return
    }
    if (!streaming) return
    const id = window.setTimeout(() => setShown((n) => n + 1), speed)
    return () => window.clearTimeout(id)
  }, [shown, streaming, speed, complete, chars.length])

  React.useEffect(() => {
    if (streaming || !loop) return
    const id = window.setTimeout(() => {
      setShown(0)
      setOpenSources(false)
      setCopied(false)
    }, 3200)
    return () => window.clearTimeout(id)
  }, [streaming, loop])

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)]",
        "primitive-card-pad",
        className
      )}
    >
      <p className="min-h-[2.6em] text-[15px] leading-relaxed text-ink">
        <span>{visible}</span>
        {streaming ? (
          <span className="stream-caret is-streaming" />
        ) : cite ? (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
            className="ml-1 inline-flex items-center rounded-[4px] bg-hover px-1.5 font-mono text-[12px] text-ink"
          >
            {cite}
          </motion.span>
        ) : null}
      </p>

      <div className="mt-2.5 min-h-[40px] border-t border-line pt-2.5">
        <AnimatePresence initial={false}>
          {!streaming ? (
            <motion.div
              key="footer"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={springs.soft}
            >
              <div className="flex items-center gap-0.5">
                <IconAction
                  label="Copy"
                  onClick={() => {
                    setCopied(true)
                    window.setTimeout(() => setCopied(false), 1200)
                  }}
                >
                  {copied ? (
                    <CheckIcon className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    <CopyIcon className="size-3.5" strokeWidth={2.5} />
                  )}
                </IconAction>
                <IconAction label="Retry" onClick={() => setShown(0)}>
                  <RefreshCwIcon className="size-3.5" strokeWidth={2.5} />
                </IconAction>
                <IconAction label="Save">
                  <BookmarkIcon className="size-3.5" strokeWidth={2.5} />
                </IconAction>

                {sources.length ? (
                  <button
                    type="button"
                    onClick={() => setOpenSources((v) => !v)}
                    className="ml-auto flex h-[32px] items-center gap-1.5 rounded-[var(--radius-control)] px-2.5 text-[13px] text-ink-2 transition-colors hover:bg-hover hover:text-ink"
                  >
                    {sources.length} sources
                    <motion.span
                      animate={{ rotate: openSources ? 180 : 0 }}
                      transition={springs.snappy}
                      className="flex"
                    >
                      <ChevronDownIcon className="size-3" strokeWidth={2.5} />
                    </motion.span>
                  </button>
                ) : null}
              </div>

              <AnimatePresence initial={false}>
                {openSources ? (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springs.soft}
                    className="mt-2 overflow-hidden"
                  >
                    {sources.map((source) => (
                      <li
                        key={source.label}
                        className="flex items-center justify-between gap-2 py-1"
                      >
                        <span className="truncate font-mono text-[13px] text-ink">
                          {source.label}
                        </span>
                        {source.meta ? (
                          <span className="shrink-0 text-[12px] text-ink-3">
                            {source.meta}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>

              {followUps.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {followUps.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="h-[28px] rounded-[var(--radius-control)] px-2.5 text-[13px] text-ink-2 shadow-[var(--shadow-hairline)] transition-all hover:bg-hover hover:text-ink"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="primitive-icon-button text-ink-2 transition-all hover:bg-hover hover:text-ink"
    >
      {children}
    </button>
  )
}
