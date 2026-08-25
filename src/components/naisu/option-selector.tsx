"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs, tweens } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type SelectorOption = { id: string; label: string }

export type OptionSelectorProps = {
  options: SelectorOption[]
  value?: string
  onChange?: (id: string) => void
  /** Replay open → glide → select → close on a loop. */
  autoplay?: boolean
  /** Trigger chrome. */
  appearance?: "soft" | "ring" | "field"
  /** Show a status dot before the label (agent style). */
  showDot?: boolean
  /** Menu alignment / width. */
  menu?: "start" | "end" | "stretch"
  className?: string
}

const STEP_MS = 700

export function OptionSelector({
  options,
  value,
  onChange,
  autoplay = false,
  appearance = "soft",
  showDot = false,
  menu = "end",
  className,
}: OptionSelectorProps) {
  const highlightId = React.useId()
  const [tookOver, setTookOver] = React.useState(false)
  const [picked, setPicked] = React.useState<string | null>(null)
  const [manualOpen, setManualOpen] = React.useState(false)
  const [tick, setTick] = React.useState(0)

  const onChangeRef = React.useRef(onChange)
  const optionsRef = React.useRef(options)
  React.useEffect(() => {
    onChangeRef.current = onChange
    optionsRef.current = options
  })

  const count = options.length
  const total = count + 3
  const playing = autoplay && !tookOver

  React.useEffect(() => {
    if (!playing) return
    let t = 0
    const id = window.setInterval(() => {
      t += 1
      setTick(t)
      if (t % total !== count + 1) return
      const next =
        optionsRef.current[(Math.floor(t / total) + count - 1) % count]
      if (!next) return
      setPicked(next.id)
      onChangeRef.current?.(next.id)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [playing, total, count])

  const phase = tick % total
  const loop = Math.floor(tick / total)
  const cursor = phase < 1 ? -1 : Math.min(phase, count) - 1
  const active = cursor < 0 ? -1 : (loop + cursor) % count

  const selectedId = picked ?? value ?? options[0]?.id
  const open = playing ? phase >= 1 && phase <= count + 1 : manualOpen
  const selected = options.find((o) => o.id === selectedId) ?? options[0]

  function pick(id: string) {
    setTookOver(true)
    setPicked(id)
    setManualOpen(false)
    onChange?.(id)
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setTookOver(true)
          setManualOpen((v) => !v)
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-[#111111]",
          appearance === "soft" && "border border-transparent bg-[#315FEA]/8",
          appearance === "ring" &&
            "bg-[#FDFDFC] shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-[#111111]/8",
          appearance === "field" &&
            "w-full justify-between bg-[#FDFDFC] py-2 shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-[#111111]/8"
        )}
      >
        {showDot ? (
          <span className="size-1.5 shrink-0 rounded-full bg-[#315FEA]" />
        ) : null}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={selected?.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={tweens.crossfade}
            className={cn(appearance === "field" && "truncate")}
          >
            {selected?.label}
          </motion.span>
        </AnimatePresence>
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
            className={cn(
              "absolute top-full z-10 mt-1 origin-top rounded-lg bg-[#FDFDFC] p-1 shadow-[0_8px_24px_rgba(16,24,40,0.1)] ring-1 ring-[#111111]/6",
              menu === "end" && "right-0 min-w-[120px]",
              menu === "start" && "left-0 min-w-[130px]",
              menu === "stretch" && "right-0 left-0"
            )}
          >
            {options.map((option, i) => {
              const lit = playing ? i === active : option.id === selectedId
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => pick(option.id)}
                  className="relative flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11px]"
                >
                  {lit ? (
                    <motion.span
                      layoutId={highlightId}
                      transition={springs.smooth}
                      className="absolute inset-0 rounded-md bg-[#315FEA]"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative flex-1 truncate",
                      lit ? "text-[#FDFDFC]" : "text-[#111111]"
                    )}
                  >
                    {option.label}
                  </span>
                  {option.id === selectedId ? (
                    <CheckIcon
                      className={cn(
                        "relative size-3 shrink-0",
                        lit ? "text-[#FDFDFC]" : "text-[#9C9C9B]"
                      )}
                      strokeWidth={3}
                    />
                  ) : null}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
