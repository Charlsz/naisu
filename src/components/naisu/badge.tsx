"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type BadgeProps = {
  children: React.ReactNode
  variant?: "default" | "outline" | "soft"
  className?: string
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium",
        variant === "default" && "bg-[#315FEA] text-white",
        variant === "soft" && "bg-[#315FEA]/12 text-[#244FD1]",
        variant === "outline" &&
          "bg-[#FDFDFC] text-[#111111] shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[#111111]/8",
        className
      )}
    >
      {children}
    </span>
  )
}
