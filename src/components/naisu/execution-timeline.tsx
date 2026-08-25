"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

import { ExecutionStep, type ExecutionStepProps } from "./execution-step"

export type TimelineStep = Pick<
  ExecutionStepProps,
  "label" | "status" | "detail"
> & {
  meta?: string
}

export type ExecutionTimelineProps = {
  steps?: TimelineStep[]
  /** Reveal steps one by one, completing each as the next begins. */
  autoplay?: boolean
  interval?: number
  title?: string
  className?: string
}

const DEFAULT_STEPS: TimelineStep[] = [
  {
    label: "Install dependencies",
    detail: "npm ci · lockfile verified",
    meta: "12s",
  },
  {
    label: "Typecheck",
    detail: "tsc --noEmit · 0 errors",
    meta: "8s",
  },
  {
    label: "Canary deploy",
    detail: "payments-api @ 5% traffic",
    meta: "41s",
  },
  {
    label: "Promote to prod",
    detail: "health green · p99 214ms",
    meta: "6s",
  },
]

/**
 * Production-style vertical timeline: soft rail, timestamp meta, staged reveal.
 */
export function ExecutionTimeline({
  steps = DEFAULT_STEPS,
  autoplay = false,
  interval = 1100,
  title = "Release pipeline",
  className,
}: ExecutionTimelineProps) {
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(() => setTick((t) => t + 1), interval)
    return () => window.clearInterval(id)
  }, [autoplay, interval])

  const cursor = tick % (steps.length + 2)
  const visible = autoplay
    ? steps.slice(0, Math.min(cursor + 1, steps.length))
    : steps
  const showLine = visible.length > 1
  const doneCount = autoplay
    ? Math.min(cursor, steps.length)
    : steps.filter((s) => s.status === "done").length

  return (
    <div
      className={cn(
        "w-full max-w-[260px] overflow-hidden rounded-xl bg-[#FDFDFC] p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)] ring-1 ring-[#101828]/6",
        className
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-[#111111]">{title}</p>
          <p className="text-[9px] text-[#9C9C9B]">
            {doneCount}/{steps.length} complete
          </p>
        </div>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[9px] font-medium",
            autoplay
              ? "bg-[#315FEA]/10 text-[#244FD1]"
              : "bg-[#111111]/6 text-[#667085]"
          )}
        >
          {autoplay ? "live" : "idle"}
        </span>
      </div>

      <div className="relative">
        <AnimatePresence>
          {showLine ? (
            <motion.span
              key="rail"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={springs.smooth}
              className="absolute top-3.5 bottom-3.5 left-[5.5px] w-px origin-top bg-[#DCE4EF]"
            />
          ) : null}
        </AnimatePresence>

        <div className="relative flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {visible.map((step, i) => {
              const status = autoplay
                ? i < cursor
                  ? "done"
                  : "running"
                : (step.status ?? "pending")
              return (
                <motion.div
                  key={step.label}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={springs.smooth}
                  className="flex items-start gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <ExecutionStep
                      label={step.label}
                      detail={step.detail}
                      status={status}
                    />
                  </div>
                  {step.meta ? (
                    <span className="mt-1 shrink-0 font-mono text-[8px] text-[#9C9C9B]">
                      {step.meta}
                    </span>
                  ) : null}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
