"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type EmptyStateProps = {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#FDFDFC] p-5 text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)] ring-1 ring-[#101828]/6",
        className
      )}
    >
      <p className="text-[11px] font-medium text-[#111111]">{title}</p>
      {description ? (
        <p className="max-w-[200px] text-[10px] leading-relaxed text-[#9C9C9B]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
