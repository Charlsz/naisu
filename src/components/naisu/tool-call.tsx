"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ToolCallStatus = "pending" | "running" | "done" | "error"

export type ToolCallProps = {
  name: string
  status?: ToolCallStatus
  className?: string
}

const statusLabel: Record<ToolCallStatus, string> = {
  pending: "...",
  running: "run",
  done: "ok",
  error: "err",
}

export function ToolCall({ name, status = "running", className }: ToolCallProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-[var(--radius-control)] bg-surface px-3 py-2 shadow-[var(--shadow-hairline)]",
        className
      )}
    >
      <span className="font-mono text-[13px] text-ink">{name}</span>
      <span
        className={cn(
          "rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
          status === "running" && "bg-hover text-ink",
          status === "done" && "bg-ink text-[var(--page)]",
          status === "error" && "bg-destructive text-[var(--page)]",
          status === "pending" && "text-ink-3"
        )}
      >
        {statusLabel[status]}
      </span>
    </div>
  )
}

export type ToolCallGroupProps = {
  calls: Pick<ToolCallProps, "name" | "status">[]
  className?: string
}

export function ToolCallGroup({ calls, className }: ToolCallGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {calls.map((call, i) => (
        <ToolCall key={i} name={call.name} status={call.status} />
      ))}
    </div>
  )
}

export type ToolDiff = { file: string; added: number; removed: number }

export type ToolChipItem = {
  name: string
  arg?: string
  status?: "running" | "done"
  output?: string[]
  diffs?: ToolDiff[]
}

export type ToolCallChipsProps = {
  tools?: ToolChipItem[]
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

export function ToolCallChips({
  tools = DEFAULT_TOOLS,
  autoplay = false,
  className,
}: ToolCallChipsProps) {
  const [tookOver, setTookOver] = React.useState(false)
  const [manualIndex, setManualIndex] = React.useState<number | null>(1)
  const [tick, setTick] = React.useState(0)

  const playing = autoplay && !tookOver

  React.useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setTick((t) => t + 1), STEP_MS)
    return () => window.clearInterval(id)
  }, [playing])

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
        "flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)]",
        className
      )}
    >
      {tools.map((tool, i) => {
        const open = openIndex === i
        return (
          <div
            key={`${tool.name}-${i}`}
            className={cn(i > 0 && "border-t border-line")}
          >
            <button
              type="button"
              onClick={() => {
                setTookOver(true)
                setManualIndex(open ? null : i)
              }}
              className="flex w-full items-center gap-2.5 primitive-card-bar text-left transition-colors hover:bg-hover"
            >
              <motion.span
                animate={{ rotate: open ? 90 : 0 }}
                transition={springs.snappy}
                className="flex shrink-0"
              >
                <ChevronRightIcon
                  className="size-3.5 text-ink-3"
                  strokeWidth={2.5}
                />
              </motion.span>
              <span className="font-mono text-[13px] text-ink">
                {tool.name}
              </span>
              {tool.arg ? (
                <span className="truncate font-mono text-[13px] text-ink-2">
                  {tool.arg}
                </span>
              ) : null}
              <span className="ml-auto shrink-0">
                {tool.status === "running" ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-3">
                    <span
                      className="block size-2 rounded-full border border-ink-3 border-t-transparent"
                      style={{ animation: "naisu-spin 0.7s linear infinite" }}
                    />
                    loading
                  </span>
                ) : (
                  <span className="text-[11px] font-medium uppercase tracking-wide text-ink-3">
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
                  <div className="flex flex-col gap-2 primitive-card-pad pl-10">
                    {tool.output?.map((line) => (
                      <motion.p
                        key={line}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springs.snappy}
                        className="truncate font-mono text-[13px] text-ink-2"
                      >
                        {line}
                      </motion.p>
                    ))}
                    {tool.diffs?.length ? (
                      <div className="flex flex-wrap gap-1.5">
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
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] bg-hover px-2 py-1 shadow-[var(--shadow-hairline)]"
    >
      <span className="font-mono text-[12px] text-ink">{file}</span>
      <span className="font-mono text-[12px] text-ink">+{added}</span>
      <span className="font-mono text-[12px] text-ink-3">−{removed}</span>
    </motion.span>
  )
}
