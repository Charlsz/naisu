"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { XIcon } from "lucide-react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

export type SystemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  contained?: boolean
  className?: string
}

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
            "z-50 flex items-center justify-center p-4",
            contained
              ? "absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
              : "fixed inset-0 bg-foreground/40 backdrop-blur-[2px]"
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
              "w-full max-w-sm rounded-2xl bg-background p-4 shadow-[var(--shadow-soft)] ring-1 ring-border",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  id="naisu-dialog-title"
                  className="text-sm font-medium text-foreground"
                >
                  {title}
                </p>
                {description ? (
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  focusRing
                )}
                aria-label="Close"
              >
                <XIcon className="size-4" strokeWidth={2.5} />
              </button>
            </div>
            {children ? <div className="mt-4">{children}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
