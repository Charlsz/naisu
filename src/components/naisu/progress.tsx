"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type ProgressProps = {
  value: number
  className?: string
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={false}
        animate={{ width: `${clamped}%` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />
    </div>
  )
}
