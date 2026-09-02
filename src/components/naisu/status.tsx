"use client"

import { cn } from "@/lib/utils"

export type StatusTone = "neutral" | "active" | "error"

export type StatusProps = {
  label: string
  tone?: StatusTone
  className?: string
}

const dot: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground",
  active: "bg-foreground animate-pulse",
  error: "bg-destructive",
}

export function Status({ label, tone = "neutral", className }: StatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-[13px] text-foreground ring-1 ring-border",
        className
      )}
    >
      <span className={cn("size-2 rounded-full", dot[tone])} />
      {label}
    </span>
  )
}
