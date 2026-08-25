"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ToolOption = { id: string; label: string; enabled?: boolean }

export type ToolSelectorProps = {
  tools: ToolOption[]
  onToggle?: (id: string) => void
  /** Replay open → glide → toggle → close on a loop. */
  autoplay?: boolean
  className?: string
}

const STEP_MS = 700

export function ToolSelector({
  tools,
  onToggle,
  autoplay = false,
  className,
}: ToolSelectorProps) {
  const highlightId = React.useId()
  const [tookOver, setTookOver] = React.useState(false)
  const [manualOpen, setManualOpen] = React.useState(false)
  const [tick, setTick] = React.useState(0)
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(tools.map((t) => [t.id, Boolean(t.enabled)]))
  )

  const onToggleRef = React.useRef(onToggle)
  const toolsRef = React.useRef(tools)
  React.useEffect(() => {
    onToggleRef.current = onToggle
    toolsRef.current = tools
  })

  const count = tools.length
  const total = count + 3
  const playing = autoplay && !tookOver

  React.useEffect(() => {
    if (!playing) return
    let t = 0
    const id = window.setInterval(() => {
      t += 1
      setTick(t)
      if (t % total !== count + 1) return
      const tool = toolsRef.current[(Math.floor(t / total) + count - 1) % count]
      if (!tool) return
      setEnabled((prev) => ({ ...prev, [tool.id]: !prev[tool.id] }))
      onToggleRef.current?.(tool.id)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [playing, total, count])

  const phase = tick % total
  const loop = Math.floor(tick / total)
  const cursor = phase < 1 ? -1 : Math.min(phase, count) - 1
  const active = cursor < 0 ? -1 : (loop + cursor) % count

  const open = playing ? phase >= 1 && phase <= count + 1 : manualOpen
  const activeCount = tools.filter((t) => enabled[t.id]).length

  function toggle(id: string) {
    setTookOver(true)
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
    onToggle?.(id)
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setTookOver(true)
          setManualOpen((v) => !v)
        }}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-[#111111] ring-1 ring-[#9C9C9B]/40"
      >
        Tools
        <motion.span
          key={activeCount}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springs.snappy}
          className="rounded-full bg-[#111111] px-1.5 text-[9px] text-[#FDFDFC]"
        >
          {activeCount}
        </motion.span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={springs.snappy}
          className="flex"
        >
          <ChevronDownIcon className="size-3 text-[#9C9C9B]" strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={springs.snappy}
            className="absolute top-full left-0 z-10 mt-1 min-w-[130px] origin-top rounded-lg bg-[#FDFDFC] p-0.5 ring-1 ring-[#9C9C9B]/40"
          >
            {tools.map((tool, i) => {
              const lit = playing && i === active
              const on = enabled[tool.id]
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggle(tool.id)}
                  className="relative flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px]"
                >
                  {lit ? (
                    <motion.span
                      layoutId={highlightId}
                      transition={springs.smooth}
                      className="absolute inset-0 rounded-md bg-[#111111]"
                    />
                  ) : null}
                  <motion.span
                    animate={{
                      backgroundColor: on ? "#111111" : "rgba(0,0,0,0)",
                    }}
                    transition={springs.snappy}
                    className={cn(
                      "relative flex size-3 shrink-0 items-center justify-center rounded-[4px] ring-1",
                      lit ? "ring-[#FDFDFC]/70" : "ring-[#9C9C9B]/60"
                    )}
                  >
                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.span
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={springs.snappy}
                          className="flex"
                        >
                          <CheckIcon
                            className="size-2 text-[#FDFDFC]"
                            strokeWidth={4}
                          />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.span>
                  <span
                    className={cn(
                      "relative flex-1 truncate",
                      lit
                        ? "text-[#FDFDFC]"
                        : on
                          ? "text-[#111111]"
                          : "text-[#9C9C9B]"
                    )}
                  >
                    {tool.label}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
