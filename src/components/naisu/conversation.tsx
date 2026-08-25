"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ConversationProps = {
  children?: React.ReactNode
  tabs?: string[]
  placeholder?: string
  onSend?: (value: string) => void
  className?: string
}

export function Conversation({
  children,
  tabs = ["Chat", "Plan"],
  placeholder = "Reply…",
  onSend,
  className,
}: ConversationProps) {
  const [tab, setTab] = React.useState(tabs[0])
  const [value, setValue] = React.useState("")
  const uid = React.useId()

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue("")
  }

  return (
    <div
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl bg-[#D9D9D9]/40 ring-1 ring-[#9C9C9B]/30",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-0.5 border-b border-[#9C9C9B]/25 px-1.5 py-1">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className="relative rounded-lg px-1.5 py-0.5 text-[9px]"
          >
            {tab === item ? (
              <motion.span
                layoutId={`naisu-conversation-tab-${uid}`}
                transition={springs.snappy}
                className="absolute inset-0 rounded-lg bg-[#111111]"
              />
            ) : null}
            <span
              className={cn(
                "relative",
                tab === item ? "text-[#FDFDFC]" : "text-[#9C9C9B]"
              )}
            >
              {item}
            </span>
          </button>
        ))}
        <span className="ml-auto pr-1 font-mono text-[8px] text-[#9C9C9B]">
          naisu
        </span>
      </div>

      <div className="naisu-demo-scroll flex-1 space-y-1.5 overflow-y-auto p-2">
        {children}
      </div>

      <div className="flex shrink-0 items-center gap-1 border-t border-[#9C9C9B]/25 bg-[#FDFDFC]/60 p-1">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-1.5 text-[10px] text-[#111111] outline-none placeholder:text-[#9C9C9B]"
        />
        <motion.button
          type="button"
          onClick={submit}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          aria-label="Send"
          className="flex size-5 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-[#FDFDFC]"
        >
          <ArrowUpIcon className="size-3" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
