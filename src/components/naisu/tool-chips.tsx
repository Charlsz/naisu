"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ToolDiff = { file: string; added: number; removed: number }

export type ToolChipItem = {
  name: string
  arg?: string
  status?: "running" | "done"
  output?: string[]
  diffs?: ToolDiff[]
}

export type ToolChipsProps = {
  tools?: ToolChipItem[]
  /** Walk the expand → detail → collapse sequence on a loop. */
  autoplay?: boolean
  className?: string
}

const DEFAULT_TOOLS: ToolChipItem[] = [
  {
    name: "grep",
    arg: "parseModel",
    status: "done",
    output: ["12 matches · 4 files", "model.ts L18"],
  },
  {
    name: "edit",
    arg: "model.ts",
    status: "done",
    diffs: [
      { file: "model.ts", added: 12, removed: 3 },
      { file: "parser.ts", added: 4, removed: 0 },
    ],
  },
  { name: "test", arg: "npm test", status: "running", output: ["12 passing"] },
]

const STEP_MS = 900

export function ToolChips({
  tools = DEFAULT_TOOLS,
  autoplay = false,
  className,
}: ToolChipsProps) {
  const [tookOver, setTookOver] = React.useState(false)
  const [manualIndex, setManualIndex] = React.useState<number | null>(1)
  const [tick, setTick] = React.useState(0)

  const playing = autoplay && !tookOver

  React.useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setTick((t) => t + 1), STEP_MS)
    return () => window.clearInterval(id)
  }, [playing])

  // open each tool for 2 beats, then 1 beat closed between
  const cycle = tools.length * 3
  const phase = tick % cycle
  const openIndex = playing
    ? phase % 3 < 2
      ? Math.floor(phase / 3)
      : null
    : manualIndex

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-[#FDFDFC] ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      {tools.map((tool, i) => {
        const open = openIndex === i
        return (
          <div
            key={`${tool.name}-${i}`}
            className={cn(i > 0 && "border-t border-[#9C9C9B]/20")}
          >
            <button
              type="button"
              onClick={() => {
                setTookOver(true)
                setManualIndex(open ? null : i)
              }}
              className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left"
            >
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={springs.snappy}
                className="flex shrink-0"
              >
                <ChevronRightIcon
                  className="size-2.5 text-[#9C9C9B]"
                  strokeWidth={2.5}
                />
              </motion.span>
              <span className="font-mono text-[9px] text-[#111111]">
                {tool.name}
              </span>
              {tool.arg ? (
                <span className="truncate font-mono text-[9px] text-[#9C9C9B]">
                  {tool.arg}
                </span>
              ) : null}
              <span className="ml-auto shrink-0">
                {tool.status === "running" ? (
                  <span className="inline-flex items-center gap-1 text-[8px] font-medium uppercase tracking-wide text-[#9C9C9B]">
                    <span
                      className="block size-1.5 rounded-full border border-[#9C9C9B] border-t-transparent"
                      style={{ animation: "naisu-spin 0.7s linear infinite" }}
                    />
                    loading
                  </span>
                ) : (
                  <span className="text-[8px] tracking-wide text-[#9C9C9B] uppercase">
                    ok
                  </span>
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={springs.smooth}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-1 px-2 pb-1.5 pl-5">
                    {tool.output?.map((line) => (
                      <motion.p
                        key={line}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.snappy}
                        className="truncate font-mono text-[9px] text-[#9C9C9B]"
                      >
                        {line}
                      </motion.p>
                    ))}
                    {tool.diffs?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {tool.diffs.map((diff) => (
                          <DiffChip key={diff.file} {...diff} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function DiffChip({ file, added, removed }: ToolDiff) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springs.snappy}
      className="inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 ring-1 ring-[#9C9C9B]/30"
    >
      <span className="font-mono text-[9px] text-[#111111]">{file}</span>
      <span className="font-mono text-[8px] text-[#111111]">+{added}</span>
      <span className="font-mono text-[8px] text-[#9C9C9B]">−{removed}</span>
    </motion.span>
  )
}
