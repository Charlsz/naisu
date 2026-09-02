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
        "flex flex-col items-center justify-center gap-2 rounded-2xl bg-background p-8 text-center shadow-[var(--shadow-soft)] ring-1 ring-border",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-[240px] text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
