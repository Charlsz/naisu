"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

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
  placeholder = "Reply...",
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
        "flex size-full flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-border",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 py-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn("relative min-h-9 rounded-lg px-3 text-[13px]", focusRing)}
          >
            {tab === item ? (
              <motion.span
                layoutId={`naisu-conversation-tab-${uid}`}
                transition={springs.snappy}
                className="absolute inset-0 rounded-lg bg-primary"
              />
            ) : null}
            <span
              className={cn(
                "relative",
                tab === item ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {item}
            </span>
          </button>
        ))}
        <span className="ml-auto pr-2 font-mono text-[12px] text-muted-foreground">
          naisu
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">{children}</div>

      <div className="flex shrink-0 items-center gap-2 border-t border-border bg-background/80 p-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder={placeholder}
          className="min-h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          type="button"
          onClick={submit}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          aria-label="Send"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
            focusRing
          )}
        >
          <ArrowUpIcon className="size-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
