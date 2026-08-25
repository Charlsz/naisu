"use client"

import * as React from "react"
import {
  BrainIcon,
  ChevronDownIcon,
  ListIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ThinkingVariant = "Steps" | "Reasoning" | "Search" | "Coding"

export type ThinkingStep = { label: string; done?: boolean }

export type ThinkingIndicatorProps = {
  variant?: ThinkingVariant
  steps?: ThinkingStep[]
  loop?: boolean
  className?: string
}

const PRESETS: Record<
  ThinkingVariant,
  {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
    working: string
    done: (s: number) => string
    trace: string[]
  }
> = {
  Steps: {
    icon: ListIcon,
    working: "Thinking",
    done: (s) => `Thought for ${s}s`,
    trace: ["Scan repo", "Locate model.ts", "Draft patch", "Check types"],
  },
  Reasoning: {
    icon: BrainIcon,
    working: "Reasoning",
    done: (s) => `Reasoned for ${s}s`,
    trace: [
      "parse() drops null ids",
      "The guard runs too late",
      "Return early instead",
      "Signature stays stable",
    ],
  },
  Search: {
    icon: SearchIcon,
    working: "Searching",
    done: (s) => `Searched for ${s}s`,
    trace: [
      "grep parseModel",
      "12 matches · 4 files",
      "Open model.ts",
      "Narrow to L18–42",
    ],
  },
  Coding: {
    icon: TerminalIcon,
    working: "Writing code",
    done: (s) => `Coded for ${s}s`,
    trace: [
      "model.ts +12 −3",
      "parser.ts +4 −0",
      "Run type check",
      "12 tests pass",
    ],
  },
}

const TICK = 780

export function ThinkingIndicator({
  variant = "Steps",
  steps,
  loop = true,
  className,
}: ThinkingIndicatorProps) {
  const preset = PRESETS[variant]
  const trace = React.useMemo(
    () => steps?.map((s) => s.label) ?? preset.trace,
    [steps, preset]
  )

  const [count, setCount] = React.useState(0)
  const [open, setOpen] = React.useState(true)
  const [touched, setTouched] = React.useState(false)
  const done = count >= trace.length

  React.useEffect(() => {
    if (done) return
    const id = window.setTimeout(() => setCount((c) => c + 1), TICK)
    return () => window.clearTimeout(id)
  }, [count, done])

  React.useEffect(() => {
    if (!done) return
    if (!touched) {
      const collapse = window.setTimeout(() => setOpen(false), 500)
      if (!loop) return () => window.clearTimeout(collapse)
      const restart = window.setTimeout(() => {
        setCount(0)
        setOpen(true)
      }, 2600)
      return () => {
        window.clearTimeout(collapse)
        window.clearTimeout(restart)
      }
    }
    if (!loop) return
    const restart = window.setTimeout(() => setCount(0), 2600)
    return () => window.clearTimeout(restart)
  }, [done, loop, touched])

  const Icon = preset.icon
  const seconds = Math.max(1, Math.round((trace.length * TICK) / 1000))

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-[#FDFDFC] ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      <button
        type="button"
        onClick={() => {
          setTouched(true)
          setOpen((v) => !v)
        }}
        className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left"
      >
        <Icon className="size-3 shrink-0 text-[#9C9C9B]" strokeWidth={2.25} />
        {done ? (
          <span className="flex-1 truncate text-[10px] text-[#9C9C9B]">
            {preset.done(seconds)}
          </span>
        ) : (
          <span className="naisu-shimmer flex-1 truncate text-[10px] font-medium">
            {preset.working}…
          </span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={springs.snappy}
          className="shrink-0"
        >
          <ChevronDownIcon className="size-3 text-[#9C9C9B]" strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.soft}
            className="overflow-hidden border-t border-[#9C9C9B]/20"
          >
            <ul className="flex flex-col gap-1 px-2.5 py-1.5">
              {trace.slice(0, Math.max(count, 1)).map((line, i) => (
                <li
                  key={line}
                  className="flex items-center gap-1.5"
                  style={{ animation: "naisu-fade-up 0.24s ease-out both" }}
                >
                  <span
                    className={cn(
                      "size-1 shrink-0 rounded-full",
                      i < count - 1 || done
                        ? "bg-[#111111]"
                        : "bg-[#9C9C9B]/60"
                    )}
                  />
                  <span
                    className={cn(
                      "truncate text-[9px]",
                      i === count - 1 && !done
                        ? "text-[#111111]"
                        : "text-[#9C9C9B]"
                    )}
                  >
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
