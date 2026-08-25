"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type AgentStatusValue = "idle" | "running" | "waiting"

export type AgentStatusProps = {
  status?: AgentStatusValue
  /** Cycle idle → running → waiting on a loop. */
  autoplay?: boolean
  interval?: number
  className?: string
}

const labels: Record<AgentStatusValue, string> = {
  idle: "Idle",
  running: "Running",
  waiting: "Waiting",
}

const CYCLE: AgentStatusValue[] = ["idle", "running", "waiting"]

export function AgentStatus({
  status = "idle",
  autoplay = false,
  interval = 1600,
  className,
}: AgentStatusProps) {
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % CYCLE.length),
      interval
    )
    return () => window.clearInterval(id)
  }, [autoplay, interval])

  const current = autoplay ? CYCLE[step] : status

  return (
    <div
      className={cn(
        "inline-flex h-5 min-w-[84px] items-center gap-1.5",
        className
      )}
    >
      <span className="flex size-2.5 shrink-0 items-center justify-center">
        {current === "running" ? (
          <span
            className="block size-2.5 rounded-full border border-[#315FEA] border-t-transparent"
            style={{ animation: "naisu-spin 0.7s linear infinite" }}
          />
        ) : (
          <span
            className={cn(
              "block size-1.5 rounded-full",
              current === "idle" ? "bg-[#9C9C9B]" : "bg-[#111111]",
              current === "waiting" && "animate-pulse"
            )}
          />
        )}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springs.snappy}
          className="text-[11px] text-[#111111]"
        >
          {labels[current]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
