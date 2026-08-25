"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { XIcon } from "lucide-react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type SystemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  /** Use absolute overlay (gallery) vs fixed page overlay. */
  contained?: boolean
  className?: string
}

/** Modal dialog with backdrop, escape-to-close, and optional contained mode. */
export function SystemDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  contained = false,
  className,
}: SystemDialogProps) {
  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", onKey)
    if (!contained) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        window.removeEventListener("keydown", onKey)
        document.body.style.overflow = prev
      }
    }
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange, contained])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={cn(
            "z-50 flex items-center justify-center p-3",
            contained
              ? "absolute inset-0 bg-[#101828]/35 backdrop-blur-[2px]"
              : "fixed inset-0 bg-[#101828]/40 backdrop-blur-[2px]"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="naisu-dialog-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={springs.snappy}
            className={cn(
              "w-full max-w-[220px] rounded-2xl bg-[#FDFDFC] p-3.5 shadow-[0_16px_40px_rgba(16,24,40,0.18)] ring-1 ring-[#101828]/8",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p
                  id="naisu-dialog-title"
                  className="text-[12px] font-medium text-[#111111]"
                >
                  {title}
                </p>
                {description ? (
                  <p className="mt-1 text-[10px] leading-relaxed text-[#667085]">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#9C9C9B] transition-colors hover:bg-[#111111]/5 hover:text-[#111111]"
                aria-label="Close"
              >
                <XIcon className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>
            {children ? <div className="mt-3">{children}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
