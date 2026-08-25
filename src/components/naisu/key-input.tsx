"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type KeyInputProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function KeyInput({
  value = "",
  onChange,
  placeholder = "sk-…",
  className,
}: KeyInputProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg bg-[#FDFDFC] px-2 py-1 ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-mono text-[10px] text-[#111111] outline-none placeholder:text-[#9C9C9B]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="flex size-5 shrink-0 items-center justify-center text-[#9C9C9B] hover:text-[#111111]"
        aria-label={visible ? "Hide key" : "Show key"}
      >
        {visible ? (
          <EyeOffIcon className="size-3" strokeWidth={2.5} />
        ) : (
          <EyeIcon className="size-3" strokeWidth={2.5} />
        )}
      </button>
    </div>
  )
}
