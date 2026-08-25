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
            "rounded-lg bg-[#FDFDFC] px-2 py-1.5 text-left transition-shadow",
            active === i
              ? "shadow-[0_2px_8px_rgba(49,95,234,0.12)] ring-1 ring-[#315FEA]/45"
              : "shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-[#111111]/6"
          )}
        >
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[10px] font-medium text-[#111111]">
              {chunk.title}
            </p>
            <span className="ml-auto shrink-0 rounded px-1 font-mono text-[8px] text-[#9C9C9B] ring-1 ring-[#9C9C9B]/30">
              {chunk.source}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[9px] text-[#9C9C9B]">
            {chunk.body}
          </p>
        </motion.button>
      ))}
    </div>
  )
}
