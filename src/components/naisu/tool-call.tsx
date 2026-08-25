"use client"

import { cn } from "@/lib/utils"

export type ToolCallStatus = "pending" | "running" | "done" | "error"

export type ToolCallProps = {
  name: string
  status?: ToolCallStatus
  className?: string
}

const statusLabel: Record<ToolCallStatus, string> = {
  pending: "…",
  running: "run",
  done: "ok",
  error: "err",
}

export function ToolCall({ name, status = "running", className }: ToolCallProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-[#D9D9D9] bg-[#FDFDFC] px-2.5 py-1.5",
        className
      )}
    >
      <span className="font-mono text-[10px] text-[#111111]">{name}</span>
      <span
        className={cn(
          "rounded px-1 py-px text-[8px] uppercase tracking-wide",
          status === "running" && "bg-[#111111]/10 text-[#111111]",
          status === "done" && "bg-[#111111] text-[#FDFDFC]",
          status === "error" && "bg-[#111111] text-[#FDFDFC]",
          status === "pending" && "text-[#9C9C9B]"
        )}
      >
        {statusLabel[status]}
      </span>
    </div>
  )
}