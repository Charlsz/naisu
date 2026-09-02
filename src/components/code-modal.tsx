"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon, CopyIcon, XIcon } from "lucide-react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

export function CodeModal({
  title,
  code,
  sourcePath,
  onClose,
  onCopy,
  copied,
}: {
  title: string
  code: string
  sourcePath?: string
  onClose: () => void
  onCopy: () => void
  copied: boolean
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal
        aria-label={`${title} code`}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 4 }}
        transition={springs.snappy}
        className="flex max-h-[min(80vh,560px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-background shadow-[var(--shadow-soft)] ring-1 ring-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{title}</p>
            {sourcePath ? (
              <p className="truncate text-[13px] text-muted-foreground">{sourcePath}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onCopy}
              className={cn(
                "flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-muted",
                focusRing
              )}
            >
              {copied ? (
                <CheckIcon className="size-4" />
              ) : (
                <CopyIcon className="size-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-muted",
                focusRing
              )}
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
        {sourcePath ? (
          <p className="border-b border-border px-4 py-2 text-[13px] text-muted-foreground">
            Copy from the repository path above. Components assume foundation tokens from{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px] text-foreground">
              src/app/globals.css
            </code>
            .
          </p>
        ) : null}
        <pre className="overflow-auto p-4 text-[13px] leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      </motion.div>
    </motion.div>
  )
}
