"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type TaskStatusValue = "pending" | "running" | "completed" | "failed"

export type TaskStatusProps = {
  status?: TaskStatusValue
  /** Cycle running → failed → completed on a loop. */
  autoplay?: boolean
  interval?: number
  className?: string
}

const labels: Record<TaskStatusValue, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Done",
  failed: "Failed",
}

const styles: Record<TaskStatusValue, string> = {
  pending: "bg-[#9C9C9B]/15 text-[#9C9C9B]",
  running: "bg-[#315FEA]/12 text-[#244FD1]",
  completed: "bg-[#128A55] text-white",
  failed: "bg-[#E9564A] text-white",
}

const CYCLE: TaskStatusValue[] = ["running", "failed", "completed"]

export function TaskStatus({
  status = "pending",
  autoplay = false,
  interval = 1400,
  className,
}: TaskStatusProps) {
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
    <span
      className={cn(
        "inline-flex h-5 min-w-[72px] shrink-0 items-center justify-center gap-1 rounded-full px-2 text-[9px] tracking-wide uppercase",
        styles[current],
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={springs.snappy}
          className="flex items-center gap-1"
        >
          <StatusMark status={current} />
          {labels[current]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function StatusMark({ status }: { status: TaskStatusValue }) {
  if (status === "running") {
    return (
      <span
        className="block size-2 rounded-full border border-current border-t-transparent"
        style={{ animation: "naisu-spin 0.7s linear infinite" }}
      />
    )
  }
  if (status === "completed") {
    return <CheckIcon className="size-2" strokeWidth={4} />
  }
  if (status === "failed") {
    return <XIcon className="size-2" strokeWidth={4} />
  }
  return <span className="block size-1.5 rounded-full bg-current opacity-70" />
}
