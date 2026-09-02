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
  className,
}: StreamingTextProps) {
  const chars = React.useMemo(() => Array.from(text), [text])
  const [shown, setShown] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const [openSources, setOpenSources] = React.useState(false)
  const streaming = shown < chars.length
  const visible = chars.slice(0, shown).join("")

  React.useEffect(() => {
    if (!streaming) return
    const id = window.setTimeout(() => setShown((n) => n + 1), speed)
    return () => window.clearTimeout(id)
  }, [shown, streaming, speed])

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
        "rounded-xl bg-background p-3 shadow-[var(--shadow-soft)] ring-1 ring-border",
        className
      )}
    >
      <p className="min-h-[2.6em] text-sm leading-relaxed text-foreground">
        <span>{visible}</span>
        {streaming ? (
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="ml-px inline-block h-[0.95em] w-[2px] translate-y-[2px] bg-foreground align-baseline"
          />
        ) : cite ? (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
            className="ml-1 inline-flex items-center rounded bg-muted px-1.5 font-mono text-[12px] text-foreground"
          >
            {cite}
          </motion.span>
        ) : null}
      </p>

      <div className="mt-2 min-h-[52px] border-t border-border pt-2">
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
                    <CheckIcon className="size-3" strokeWidth={2.5} />
                  ) : (
                    <CopyIcon className="size-3" strokeWidth={2.5} />
                  )}
                </IconAction>
                <IconAction label="Retry" onClick={() => setShown(0)}>
                  <RefreshCwIcon className="size-3" strokeWidth={2.5} />
                </IconAction>
                <IconAction label="Save">
                  <BookmarkIcon className="size-3" strokeWidth={2.5} />
                </IconAction>

                {sources.length ? (
                  <button
                    type="button"
                    onClick={() => setOpenSources((v) => !v)}
                    className="ml-auto flex min-h-9 items-center gap-1 rounded-lg px-2 text-[13px] text-muted-foreground hover:text-foreground"
                  >
                    {sources.length} sources
                    <motion.span
                      animate={{ rotate: openSources ? 180 : 0 }}
                      transition={springs.snappy}
                      className="flex"
                    >
                      <ChevronDownIcon className="size-2.5" strokeWidth={2.5} />
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
                    className="overflow-hidden"
                  >
                    {sources.map((source) => (
                      <li
                        key={source.label}
                        className="flex items-center justify-between gap-2 py-0.5"
                      >
                        <span className="truncate font-mono text-[13px] text-foreground">
                          {source.label}
                        </span>
                        {source.meta ? (
                          <span className="shrink-0 text-[12px] text-muted-foreground">
                            {source.meta}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>

              {followUps.length ? (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {followUps.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-lg border border-border px-2 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  )
}
