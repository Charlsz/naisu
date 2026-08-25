"use client"

import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

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
        "rounded-xl bg-[#FDFDFC] p-2.5 ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      <p className="text-[10px] font-medium text-[#111111]">{title}</p>
      {description ? (
        <p className="mt-0.5 text-[9px] text-[#9C9C9B]">{description}</p>
      ) : null}
      <div className="mt-2 flex gap-1.5">
        <motion.button
          type="button"
          onClick={onDeny}
          whileTap={{ scale: 0.96 }}
          transition={springs.snappy}
          className="flex-1 rounded-lg px-2 py-1 text-[10px] text-[#9C9C9B] ring-1 ring-[#9C9C9B]/40"
        >
          Deny
        </motion.button>
        <motion.button
          type="button"
          onClick={onAllow}
          whileTap={{ scale: 0.96 }}
          transition={springs.snappy}
          className="flex-1 rounded-lg bg-[#111111] px-2 py-1 text-[10px] text-[#FDFDFC]"
        >
          Allow
        </motion.button>
      </div>
    </div>
  )
}
