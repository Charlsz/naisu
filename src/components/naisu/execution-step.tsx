"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ExecutionStepStatus = "pending" | "running" | "done" | "failed"

export type ExecutionStepProps = {
  label: string
  status?: ExecutionStepStatus
  detail?: string
  /** Cycle pending → running → done on a loop. */
  autoplay?: boolean
  interval?: number
  className?: string
}

const CYCLE: ExecutionStepStatus[] = ["pending", "running", "done"]

/** Single pipeline step with status marker + optional detail. */
export function ExecutionStep({
  label,
  status = "pending",
  detail,
  autoplay = false,
  interval = 1100,
  className,
}: ExecutionStepProps) {
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
    <div className={cn("flex items-start gap-2 py-0.5", className)}>
      <span className="mt-px flex size-3 shrink-0 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={springs.snappy}
            className="flex items-center justify-center"
          >
            <StepMarker status={current} />
          </motion.span>
        </AnimatePresence>
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[10px] transition-colors",
            current === "pending" ? "text-[#9C9C9B]" : "text-[#111111]"
          )}
        >
          {label}
        </p>
        {detail ? <p className="text-[9px] text-[#9C9C9B]">{detail}</p> : null}
      </div>
    </div>
  )
}

function StepMarker({ status }: { status: ExecutionStepStatus }) {
  if (status === "running") {
    return (
      <span
        className="block size-3 rounded-full border border-[#315FEA] border-t-transparent"
        style={{ animation: "naisu-spin 0.7s linear infinite" }}
      />
    )
  }

  if (status === "done") {
    return (
      <span className="flex size-3 items-center justify-center rounded-full bg-[#128A55]">
        <CheckIcon className="size-2 text-white" strokeWidth={4} />
      </span>
    )
  }

  if (status === "failed") {
    return (
      <span className="flex size-3 items-center justify-center rounded-full bg-[#E9564A]">
        <XIcon className="size-2 text-white" strokeWidth={4} />
      </span>
    )
  }

  return <span className="block size-1.5 rounded-full bg-[#9C9C9B]/70" />
}
