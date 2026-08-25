"use client"

import { cn } from "@/lib/utils"

export type StatusTone = "neutral" | "active" | "success" | "error"

export type StatusProps = {
  label: string
  tone?: StatusTone
  className?: string
}

const dot: Record<StatusTone, string> = {
  neutral: "bg-[#9C9C9B]",
  active: "bg-[#315FEA] animate-pulse",
  success: "bg-[#128A55]",
  error: "bg-[#E9564A]",
}

export function Status({ label, tone = "neutral", className }: StatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[#FDFDFC] px-2.5 py-1 text-[10px] text-[#111111] shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-[#111111]/6",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[tone])} />
      {label}
    </span>
  )
}
