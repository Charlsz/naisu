"use client"

import * as React from "react"

import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type MessageRole = "user" | "assistant"

export type MessageProps = {
  role: MessageRole
  children: React.ReactNode
  className?: string
}

export function Message({ role, children, className }: MessageProps) {
  const isUser = role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.soft}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed",
          isUser
            ? "bg-[#315FEA] text-white shadow-[0_2px_8px_rgba(49,95,234,0.22)]"
            : "bg-[#FDFDFC] text-[#111111] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_4px_14px_rgba(16,24,40,0.06)] ring-1 ring-[#111111]/6"
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}
