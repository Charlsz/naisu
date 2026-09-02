"use client"

import { FileIcon, XIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

export type AttachmentProps = {
  name: string
  size?: string
  onRemove?: () => void
  className?: string
}

export function Attachment({ name, size, onRemove, className }: AttachmentProps) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-lg bg-background px-3 py-2 ring-1 ring-border",
        className
      )}
    >
      <FileIcon className="size-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground">{name}</p>
        {size ? <p className="text-[13px] text-muted-foreground">{size}</p> : null}
      </div>
      {onRemove ? (
        <motion.button
          type="button"
          onClick={onRemove}
          whileTap={{ scale: 0.9 }}
          transition={springs.snappy}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground",
            focusRing
          )}
          aria-label="Remove"
        >
          <XIcon className="size-3.5" strokeWidth={2.5} />
        </motion.button>
      ) : null}
    </div>
  )
}
