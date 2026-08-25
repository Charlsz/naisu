"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type HoverBorderProps = {
  label?: string
  className?: string
  children?: React.ReactNode
}

/**
 * Card with a rotating conic highlight on its own border, not the stage.
 */
export function HoverBorder({
  label = "Deploy",
  className,
  children,
}: HoverBorderProps) {
  return (
    <div
      className={cn(
        "relative size-[7.5rem] overflow-hidden rounded-2xl p-px shadow-[0_8px_24px_rgba(16,24,40,0.1)]",
        className
      )}
    >
      <motion.div
        aria-hidden
        className="absolute inset-[-45%]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 38%, #315FEA 50%, transparent 62%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative flex size-full items-center justify-center rounded-[15px] bg-[#FDFDFC] text-[11px] font-medium text-[#111111]">
        {children ?? label}
      </div>
    </div>
  )
}
