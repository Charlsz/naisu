"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { MotionButton } from "@/components/naisu/motion-button"

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <MotionButton
      type="button"
      variant="outline"
      size="xs"
      className="h-6 gap-1 border-[#9C9C9B] px-1.5 text-[11px] text-[#111111]"
      hoverScale={1}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </MotionButton>
  )
}
