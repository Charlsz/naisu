"use client"

import * as React from "react"

import { cn, focusRing } from "@/lib/utils"

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
        "divide-y divide-border rounded-xl bg-background ring-1 ring-border",
        className
      )}
    >
      {rows.map((row) => (
        <div
          key={row.id}
          className="relative flex min-h-12 items-center justify-between gap-3 px-4 py-3"
        >
          <span className="text-sm text-foreground">{row.label}</span>
          {row.control}
        </div>
      ))}
    </div>
  )
}

export type SettingsToggleProps = {
  defaultOn?: boolean
  onChange?: (on: boolean) => void
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
        "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors",
        on ? "bg-primary" : "bg-muted-foreground/35",
        focusRing,
        className
      )}
    >
      <span
        className="block size-5 rounded-full bg-background transition-[margin] duration-200"
        style={{ marginLeft: on ? "auto" : 0 }}
      />
    </button>
  )
}
