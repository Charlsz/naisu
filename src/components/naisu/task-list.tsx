"use client"

import { cn } from "@/lib/utils"

import { Task, type TaskProps } from "./task"

export type TaskListProps = {
  tasks: Pick<TaskProps, "title" | "meta" | "status">[]
  className?: string
}

export function TaskList({ tasks, className }: TaskListProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {tasks.map((task, i) => (
        <Task key={i} {...task} />
      ))}
    </div>
  )
}
