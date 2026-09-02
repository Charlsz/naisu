"use client"

import * as React from "react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ContextChunk = {
  title: string
  body: string
  source: string
}

export type ContextCardsProps = {
  chunks?: ContextChunk[]
  className?: string
}

const DEFAULT_CHUNKS: ContextChunk[] = [
  {
    title: "parse()",
    body: "The null guard runs after the early branch.",
    source: "model.ts · L18",
  },
  {
    title: "Model type",
    body: "id is optional in the schema definition.",
    source: "types.ts · L4",
  },
  {
    title: "Failing test",
    body: "Throws when id is missing from the payload.",
    source: "model.test.ts · L31",
  },
]

export function ContextCards({
  chunks = DEFAULT_CHUNKS,
  className,
}: ContextCardsProps) {
  const [active, setActive] = React.useState(0)

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {chunks.map((chunk, i) => (
        <motion.button
          key={chunk.title}
          type="button"
          onClick={() => setActive(i)}
          whileHover={{ y: -1 }}
          transition={springs.snappy}
          style={{
            animation: `naisu-fade-up 0.28s ease-out ${i * 0.06}s both`,
          }}
          className={cn(
            "rounded-lg bg-background px-3 py-2 text-left transition-shadow ring-1",
            active === i
              ? "shadow-[var(--shadow-soft)] ring-foreground/20"
              : "shadow-[var(--shadow-soft)] ring-border"
          )}
        >
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-foreground">
              {chunk.title}
            </p>
            <span className="ml-auto shrink-0 rounded px-1.5 font-mono text-[12px] text-muted-foreground ring-1 ring-border">
              {chunk.source}
            </span>
          </div>
          <p className="mt-1 truncate text-[13px] text-muted-foreground">
            {chunk.body}
          </p>
        </motion.button>
      ))}
    </div>
  )
}
