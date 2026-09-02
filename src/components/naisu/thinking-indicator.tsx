"use client"

import * as React from "react"
import { BrainIcon, ChevronDownIcon, ListIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ThinkingVariant = "Steps" | "Reasoning"

export type ThinkingStep = { label: string; done?: boolean }

export type ThinkingIndicatorProps = {
  variant?: ThinkingVariant
  steps?: ThinkingStep[]
  loop?: boolean
  /** Start collapsed with a completed trace (gallery / settled state). */
  settled?: boolean
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
}

const TICK = 780

export function ThinkingIndicator({
  variant = "Steps",
  steps,
  loop = true,
  settled = false,
  className,
}: ThinkingIndicatorProps) {
  const preset = PRESETS[variant]
  const trace = React.useMemo(
    () => steps?.map((s) => s.label) ?? preset.trace,
    [steps, preset]
  )

  const [count, setCount] = React.useState(settled ? trace.length : 0)
  const [open, setOpen] = React.useState(settled)
  const [touched, setTouched] = React.useState(settled)
  const done = count >= trace.length

  React.useEffect(() => {
    if (settled || done) return
    const id = window.setTimeout(() => setCount((c) => c + 1), TICK)
    return () => window.clearTimeout(id)
  }, [count, done, settled])

  React.useEffect(() => {
    if (settled) return
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
  }, [done, loop, touched, settled])

  const Icon = preset.icon
  const seconds = Math.max(1, Math.round((trace.length * TICK) / 1000))

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => {
          setTouched(true)
          setOpen((v) => !v)
        }}
        className="primitive-card-bar flex w-full items-center gap-2.5 text-left transition-colors hover:bg-hover"
      >
        <Icon className="size-4 shrink-0 text-ink-3" strokeWidth={2.25} />
        {done ? (
          <span className="flex-1 truncate text-[14px] text-ink-2">
            {preset.done(seconds)}
          </span>
        ) : (
          <span className="naisu-shimmer flex-1 truncate text-[14px] font-medium">
            {preset.working}...
          </span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={springs.snappy}
          className="shrink-0"
        >
          <ChevronDownIcon className="size-4 text-ink-3" strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.soft}
            className="overflow-hidden border-t border-line"
          >
            <ul className="flex flex-col gap-2 primitive-card-pad">
              {trace.slice(0, Math.max(count, 1)).map((line, i) => (
                <li
                  key={line}
                  className="flex items-center gap-2.5"
                  style={{ animation: "naisu-fade-up 0.24s var(--ease-out-strong) both" }}
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      i < count - 1 || done ? "bg-ink" : "bg-ink-3"
                    )}
                  />
                  <span
                    className={cn(
                      "truncate text-[13px]",
                      i === count - 1 && !done
                        ? "text-ink"
                        : "text-ink-2"
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
