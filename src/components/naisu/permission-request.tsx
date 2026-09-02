"use client"

import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

export type PermissionRequestProps = {
  title: string
  description?: string
  onAllow?: () => void
  onDeny?: () => void
  className?: string
}

export function PermissionRequest({
  title,
  description,
  onAllow,
  onDeny,
  className,
}: PermissionRequestProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-background p-4 ring-1 ring-border",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-3 flex gap-2">
        <motion.button
          type="button"
          onClick={onDeny}
          whileTap={{ scale: 0.96 }}
          transition={springs.snappy}
          className={cn(
            "min-h-11 flex-1 rounded-lg px-3 text-sm text-muted-foreground ring-1 ring-border",
            focusRing
          )}
        >
          Deny
        </motion.button>
        <motion.button
          type="button"
          onClick={onAllow}
          whileTap={{ scale: 0.96 }}
          transition={springs.snappy}
          className={cn(
            "min-h-11 flex-1 rounded-lg bg-primary px-3 text-sm text-primary-foreground",
            focusRing
          )}
        >
          Allow
        </motion.button>
      </div>
    </div>
  )
}
