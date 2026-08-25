"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type TooltipProps = {
  content: string
  children: React.ReactNode
  className?: string
}

/** Soft tooltip that appears above its trigger on hover/focus. */
export function Tooltip({ content, children, className }: TooltipProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div
      className={cn("relative inline-flex", className)}
      onPointerEnter={() => setShow(true)}
      onPointerLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show ? (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 3, scale: 0.97 }}
            transition={springs.snappy}
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 -translate-x-1/2 rounded-lg bg-[#111111] px-2.5 py-1.5 text-[10px] font-medium tracking-wide whitespace-nowrap text-[#FDFDFC] shadow-[0_10px_24px_rgba(16,24,40,0.28)]"
          >
            {content}
            <span
              aria-hidden
              className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-[5px] border-transparent border-t-[#111111]"
            />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
