"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

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
        "overflow-hidden rounded-xl bg-[#111111] text-[#FDFDFC]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#FDFDFC]/10 px-2 py-1">
        <span className="text-[9px] text-[#9C9C9B]">{language}</span>
        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] text-[#9C9C9B] hover:text-[#FDFDFC]"
        >
          {copied ? <CheckIcon className="size-2.5" /> : <CopyIcon className="size-2.5" />}
          {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>
      <pre className="overflow-x-auto p-2 text-[9px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
