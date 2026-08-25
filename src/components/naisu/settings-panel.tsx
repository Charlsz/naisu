"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type SettingsRow = {
  id: string
  label: string
  control: React.ReactNode
}

export type SettingsPanelProps = {
  rows: SettingsRow[]
  className?: string
}

export function SettingsPanel({ rows, className }: SettingsPanelProps) {
  return (
    <div
      className={cn(
        "divide-y divide-[#9C9C9B]/25 rounded-xl bg-[#FDFDFC] ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      {rows.map((row) => (
        <div key={row.id} className="relative flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="text-[11px] text-[#111111]">{row.label}</span>
          {row.control}
        </div>
      ))}
    </div>
  )
}

export type SettingsToggleProps = {
  defaultOn?: boolean
  onChange?: (on: boolean) => void
  /** Flip on a timer so the panel reads as live. */
  autoplay?: boolean
  interval?: number
  className?: string
}

export function SettingsToggle({
  defaultOn = false,
  onChange,
  autoplay = false,
  interval = 2200,
  className,
}: SettingsToggleProps) {
  const [tookOver, setTookOver] = React.useState(false)
  const [on, setOn] = React.useState(defaultOn)

  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  })

  const playing = autoplay && !tookOver

  React.useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setOn((prev) => {
        onChangeRef.current?.(!prev)
        return !prev
      })
    }, interval)
    return () => window.clearInterval(id)
  }, [playing, interval])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        setTookOver(true)
        setOn((v) => !v)
        onChange?.(!on)
      }}
      className={cn(
        "flex h-4 w-7 shrink-0 items-center rounded-full p-0.5",
        className
      )}
      style={{ backgroundColor: on ? "#111111" : "rgba(156,156,155,0.35)" }}
    >
      <span
        className="block size-3 rounded-full bg-[#FDFDFC]"
        style={{ marginLeft: on ? "auto" : 0 }}
      />
    </button>
  )
}