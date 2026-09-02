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
        "inline-flex items-center rounded-lg px-4 py-2 text-sm shadow-[var(--shadow-soft)]",
        variant === "success"
          ? "bg-primary text-primary-foreground"
          : "bg-background text-foreground ring-1 ring-border",
        className
      )}
    >
      {message}
    </motion.div>
  )
}
