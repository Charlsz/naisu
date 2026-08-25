"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type PopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** Lightweight popover anchored under a trigger button. */
export function Popover({ trigger, children, className }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    window.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="outline-none"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={springs.snappy}
            className={cn(
              "absolute top-full left-1/2 z-20 mt-2.5 min-w-[148px] -translate-x-1/2 rounded-xl bg-[#FDFDFC] p-2.5 shadow-[0_14px_32px_rgba(16,24,40,0.16)] ring-1 ring-[#101828]/10",
              className
            )}
          >
            <span
              aria-hidden
              className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-[#FDFDFC] shadow-[-1px_-1px_0_rgba(16,24,40,0.08)]"
            />
            <div className="relative">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
