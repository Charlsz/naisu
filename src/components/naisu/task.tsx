"use client"

import { cn } from "@/lib/utils"

import { TaskStatus, type TaskStatusValue } from "./task-status"

export type TaskProps = {
  title: string
  meta?: string
  status?: TaskStatusValue
  className?: string
}

export function Task({ title, meta, status = "pending", className }: TaskProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-[#D9D9D9] bg-[#FDFDFC] px-2.5 py-2",
        className
      )}
    >
      <p className="min-w-0 flex-1 truncate text-[10px] text-[#111111]">{title}</p>
      {meta ? <p className="shrink-0 text-[9px] text-[#9C9C9B]">{meta}</p> : null}
      <TaskStatus status={status} />
    </div>
  )
}
