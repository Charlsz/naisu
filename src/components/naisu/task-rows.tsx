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
  /** Static highlight index when autoplay is off. */
  activeIndex?: number
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
  activeIndex = 2,
  className,
}: TaskRowsProps) {
  const [active, setActive] = React.useState(activeIndex)

  React.useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % (tasks.length + 1)),
      1500
    )
    return () => window.clearInterval(id)
  }, [autoplay, tasks.length])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {tasks.map((task, i) => {
        const done = i < active
        const running = i === active

        return (
          <motion.div
            key={task.title}
            animate={{ scale: running ? 1 : 0.98 }}
            transition={springs.smooth}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-full px-3 py-2 transition-colors",
              running
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground ring-1 ring-border"
            )}
          >
            <span className="flex size-4 shrink-0 items-center justify-center">
              {running ? (
                <span
                  className="block size-3 rounded-full border border-primary-foreground border-t-transparent"
                  style={{ animation: "naisu-spin 0.7s linear infinite" }}
                />
              ) : done ? (
                <CheckIcon className="size-3.5 text-foreground" strokeWidth={3} />
              ) : (
                <span className="size-2 rounded-full bg-muted-foreground/60" />
              )}
            </span>

            <span
              className={cn(
                "truncate text-sm",
                !running && !done && "text-muted-foreground"
              )}
            >
              {task.title}
            </span>

            {task.meta ? (
              <span
                className={cn(
                  "ml-auto shrink-0 text-[13px]",
                  running ? "text-primary-foreground/70" : "text-muted-foreground"
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
