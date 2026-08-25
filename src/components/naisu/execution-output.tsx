"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { tweens } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ExecutionOutputProps = {
  output: string
  /** Reveal one line at a time, then loop. */
  stream?: boolean
  interval?: number
  className?: string
}

export function ExecutionOutput({
  output,
  stream = false,
  interval = 700,
  className,
}: ExecutionOutputProps) {
  const lines = React.useMemo(() => output.split("\n"), [output])
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (!stream) return
    const id = window.setInterval(() => setTick((t) => t + 1), interval)
    return () => window.clearInterval(id)
  }, [stream, interval])

  const count = stream
    ? Math.min((tick % (lines.length + 2)) + 1, lines.length)
    : lines.length

  return (
    <div
      className={cn(
        "max-h-32 overflow-hidden rounded-xl bg-[#111111] p-2 font-mono text-[9px] leading-relaxed text-[#FDFDFC]",
        className
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {lines.slice(0, count).map((line, i) => (
          <motion.p
            key={`${i}-${line}`}
            layout
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={tweens.entrance}
            className="truncate"
          >
            {line || "\u00A0"}
          </motion.p>
        ))}
      </AnimatePresence>

      {stream ? (
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block h-2 w-1.5 bg-[#FDFDFC] align-middle"
        />
      ) : null}
    </div>
  )
}
