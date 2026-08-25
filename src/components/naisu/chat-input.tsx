"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ChatInputProps = {
  placeholder?: string
  onSend?: (value: string) => void
  className?: string
}

export function ChatInput({
  placeholder = "Message…",
  onSend,
  className,
}: ChatInputProps) {
  const [value, setValue] = React.useState("")

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue("")
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-2xl bg-[#FDFDFC] p-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_18px_rgba(16,24,40,0.07)] ring-1 ring-[#111111]/6",
        className
      )}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-[11px] text-[#111111] outline-none placeholder:text-[#9C9C9B]"
      />
      <motion.button
        type="button"
        onClick={submit}
        whileTap={{ scale: 0.92 }}
        transition={springs.snappy}
        className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-[#315FEA] text-white"
        aria-label="Send"
      >
        <ArrowUpIcon className="size-3" strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
