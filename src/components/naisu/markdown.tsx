"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type MarkdownProps = {
  content: string
  className?: string
}

function inline(text: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1 py-px font-mono text-[13px] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export function Markdown({ content, className }: MarkdownProps) {
  const lines = content.split("\n")

  return (
    <div className={cn("space-y-2 text-[15px] leading-relaxed text-foreground", className)}>
      {lines.map((line, i) => {
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex gap-1.5 pl-1">
              <span className="text-muted-foreground">·</span>
              <span>{inline(line.slice(2))}</span>
            </div>
          )
        }
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i}>{inline(line)}</p>
      })}
    </div>
  )
}
