"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type SpinnerProps = {
  size?: "sm" | "md"
  className?: string
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  const dim = size === "sm" ? "size-4" : "size-6"

  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={cn(dim, className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#9C9C9B"
        strokeWidth="2.5"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 42"
      />
    </motion.svg>
  )
}
