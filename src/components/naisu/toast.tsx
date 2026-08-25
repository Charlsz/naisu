"use client"

import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ToastProps = {
  message: string
  variant?: "default" | "success"
  className?: string
}

export function Toast({ message, variant = "default", className }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.snappy}
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] shadow-[0_4px_16px_rgba(16,24,40,0.1)]",
        variant === "success"
          ? "bg-[#128A55] text-white"
          : "bg-[#FDFDFC] text-[#111111] ring-1 ring-[#111111]/8",
        className
      )}
    >
      {message}
    </motion.div>
  )
}
