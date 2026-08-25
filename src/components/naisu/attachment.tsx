"use client"

import { FileIcon, XIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

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
        "inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#FDFDFC] px-2 py-1 ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      <FileIcon className="size-3 shrink-0 text-[#9C9C9B]" strokeWidth={2.5} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] text-[#111111]">{name}</p>
        {size ? <p className="text-[9px] text-[#9C9C9B]">{size}</p> : null}
      </div>
      {onRemove ? (
        <motion.button
          type="button"
          onClick={onRemove}
          whileTap={{ scale: 0.9 }}
          transition={springs.snappy}
          className="flex size-4 shrink-0 items-center justify-center rounded text-[#9C9C9B] hover:text-[#111111]"
          aria-label="Remove"
        >
          <XIcon className="size-2.5" strokeWidth={2.5} />
        </motion.button>
      ) : null}
    </div>
  )
}
