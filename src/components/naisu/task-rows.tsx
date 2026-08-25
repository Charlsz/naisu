"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type TaskRow = { title: string; meta?: string }

export type TaskRowsProps = {
  tasks?: TaskRow[]
  autoplay?: boolean
  className?: string
}

const DEFAULT_TASKS: TaskRow[] = [
  { title: "Read model.ts", meta: "18 lines" },
  { title: "Apply patch", meta: "+12 −3" },
  { title: "Run tests", meta: "12 passing" },
]

export function TaskRows({
  tasks = DEFAULT_TASKS,
  autoplay = true,
  className,
}: TaskRowsProps) {
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % (tasks.length + 1)),
      1500
    )
    return () => window.clearInterval(id)
  }, [autoplay, tasks.length])

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {tasks.map((task, i) => {
        const done = i < active
        const running = i === active

        return (
          <motion.div
            key={task.title}
            animate={{ scale: running ? 1 : 0.98 }}
            transition={springs.smooth}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors",
              running
                ? "bg-[#111111] text-[#FDFDFC]"
                : "bg-[#FDFDFC] text-[#111111] ring-1 ring-[#9C9C9B]/30"
            )}
          >
            <span className="flex size-3 shrink-0 items-center justify-center">
              {running ? (
                <span
                  className="block size-2.5 rounded-full border border-[#FDFDFC] border-t-transparent"
                  style={{ animation: "naisu-spin 0.7s linear infinite" }}
                />
              ) : done ? (
                <CheckIcon
                  className="size-2.5 text-[#111111]"
                  strokeWidth={3}
                />
              ) : (
                <span className="size-1.5 rounded-full bg-[#9C9C9B]/60" />
              )}
            </span>

            <span
              className={cn(
                "truncate text-[10px]",
                !running && !done && "text-[#9C9C9B]"
              )}
            >
              {task.title}
            </span>

            {task.meta ? (
              <span
                className={cn(
                  "ml-auto shrink-0 text-[9px]",
                  running ? "text-[#FDFDFC]/70" : "text-[#9C9C9B]"
                )}
              >
                {task.meta}
              </span>
            ) : null}
          </motion.div>
        )
      })}
    </div>
  )
}
