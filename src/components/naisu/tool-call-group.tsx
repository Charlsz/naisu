"use client"

import { cn } from "@/lib/utils"

import { ToolCall, type ToolCallProps } from "./tool-call"

export type ToolCallGroupProps = {
  calls: Pick<ToolCallProps, "name" | "status">[]
  className?: string
}

export function ToolCallGroup({ calls, className }: ToolCallGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {calls.map((call, i) => (
        <ToolCall key={i} name={call.name} status={call.status} />
      ))}
    </div>
  )
}
