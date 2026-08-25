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
        "rounded-xl bg-[#FDFDFC] p-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_4px_14px_rgba(16,24,40,0.06)] ring-1 ring-[#111111]/6",
        className
      )}
    >
      <p className="min-h-[2.6em] text-[11px] leading-relaxed text-[#111111]">
        <span>{visible}</span>
        {streaming ? (
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="ml-px inline-block h-[0.95em] w-[2px] translate-y-[2px] bg-[#111111] align-baseline"
          />
        ) : cite ? (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
            className="ml-1 inline-flex items-center rounded bg-[#111111]/8 px-1 font-mono text-[8px] text-[#111111]"
          >
            {cite}
          </motion.span>
        ) : null}
      </p>

      <div className="mt-1.5 min-h-[52px] border-t border-[#D9D9D9] pt-1.5">
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
                    className="ml-auto flex items-center gap-0.5 rounded-lg px-1 py-0.5 text-[9px] text-[#9C9C9B] hover:text-[#111111]"
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
                        <span className="truncate font-mono text-[9px] text-[#111111]">
                          {source.label}
                        </span>
                        {source.meta ? (
                          <span className="shrink-0 text-[8px] text-[#9C9C9B]">
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
                      className="rounded-lg border border-[#D9D9D9] px-1.5 py-0.5 text-[9px] text-[#9C9C9B] transition-colors hover:text-[#111111]"
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
      className="flex size-5 items-center justify-center rounded-lg text-[#9C9C9B] transition-colors hover:bg-[#111111]/5 hover:text-[#111111]"
    >
      {children}
    </button>
  )
}
