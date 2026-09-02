"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

export type CodeBlockProps = {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = "tsx", className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-primary text-primary-foreground",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-primary-foreground/10 px-3 py-2">
        <span className="text-[13px] text-muted-foreground">{language}</span>
        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          className={cn(
            "flex min-h-9 items-center gap-1.5 rounded-md px-2 text-[13px] text-muted-foreground hover:text-primary-foreground",
            focusRing
          )}
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
