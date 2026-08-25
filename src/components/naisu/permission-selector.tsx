"use client"

import * as React from "react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type PermissionLevel = "ask" | "auto" | "off"

export type PermissionSelectorProps = {
  value?: PermissionLevel
  onChange?: (value: PermissionLevel) => void
  /** Glide the pill through every level on a loop. */
  autoplay?: boolean
  className?: string
}

const options: { value: PermissionLevel; label: string }[] = [
  { value: "ask", label: "Ask" },
  { value: "auto", label: "Auto" },
  { value: "off", label: "Off" },
]

const STEP_MS = 1100

export function PermissionSelector({
  value,
  onChange,
  autoplay = false,
  className,
}: PermissionSelectorProps) {
  const pillId = React.useId()
  const [tookOver, setTookOver] = React.useState(false)
  const [override, setOverride] = React.useState<PermissionLevel | null>(null)

  const level = override ?? value ?? "ask"
  const playing = autoplay && !tookOver

  const onChangeRef = React.useRef(onChange)
  const levelRef = React.useRef(level)
  React.useEffect(() => {
    onChangeRef.current = onChange
    levelRef.current = level
  })

  React.useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      const at = options.findIndex((o) => o.value === levelRef.current)
      const next = options[(at + 1) % options.length]
      setOverride(next.value)
      onChangeRef.current?.(next.value)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [playing])

  function pick(next: PermissionLevel) {
    setTookOver(true)
    setOverride(next)
    onChange?.(next)
  }

  return (
    <div className={cn("inline-flex rounded-lg bg-[#111111]/5 p-0.5", className)}>
      {options.map((opt) => {
        const on = level === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => pick(opt.value)}
            className="relative rounded-md px-2.5 py-1 text-[10px]"
          >
            {on ? (
              <motion.span
                layoutId={pillId}
                transition={springs.smooth}
                className="absolute inset-0 rounded-md bg-[#111111]"
              />
            ) : null}
            <span
              className={cn(
                "relative",
                on ? "text-[#FDFDFC]" : "text-[#9C9C9B]"
              )}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
