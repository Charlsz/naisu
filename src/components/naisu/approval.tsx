"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ApprovalChoice = { id: string; label: string }

export type ApprovalQuestion = {
  id: string
  title: string
  multiple?: boolean
  choices: ApprovalChoice[]
}

export type ApprovalProps = {
  questions?: ApprovalQuestion[]
  /** Legacy single-question shape. */
  title?: string
  choices?: ApprovalChoice[]
  selected?: string
  onSelect?: (id: string) => void
  onComplete?: () => void
  className?: string
}

const DEFAULT_QUESTIONS: ApprovalQuestion[] = [
  {
    id: "scope",
    title: "Ship the patch?",
    choices: [
      { id: "patch", label: "Patch in place" },
      { id: "module", label: "New module" },
    ],
  },
  {
    id: "checks",
    title: "Run before merge",
    multiple: true,
    choices: [
      { id: "types", label: "Type check" },
      { id: "tests", label: "Unit tests" },
    ],
  },
  {
    id: "branch",
    title: "Target branch",
    choices: [
      { id: "main", label: "main" },
      { id: "next", label: "next" },
    ],
  },
]

export function Approval({
  questions,
  title,
  choices,
  selected,
  onSelect,
  onComplete,
  className,
}: ApprovalProps) {
  const list = React.useMemo<ApprovalQuestion[]>(() => {
    if (questions?.length) return questions
    if (choices?.length) return [{ id: "single", title: title ?? "Approve", choices }]
    return DEFAULT_QUESTIONS
  }, [questions, choices, title])

  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({})
  const [done, setDone] = React.useState(false)
  const uid = React.useId()

  const question = list[Math.min(step, list.length - 1)]
  const picked = answers[question.id] ?? (selected ? [selected] : [])

  function toggle(id: string) {
    onSelect?.(id)
    setAnswers((prev) => {
      const current = prev[question.id] ?? (selected ? [selected] : [])
      if (!question.multiple) return { ...prev, [question.id]: [id] }
      return {
        ...prev,
        [question.id]: current.includes(id)
          ? current.filter((v) => v !== id)
          : [...current, id],
      }
    })
  }

  function advance() {
    if (step + 1 >= list.length) {
      setDone(true)
      onComplete?.()
      return
    }
    setStep((s) => s + 1)
  }

  React.useEffect(() => {
    if (!done) return
    const id = window.setTimeout(() => {
      setDone(false)
      setStep(0)
      setAnswers({})
    }, 2400)
    return () => window.clearTimeout(id)
  }, [done])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-[#FDFDFC] ring-1 ring-[#9C9C9B]/40",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#9C9C9B]/20 px-2.5 py-1.5">
        <p className="text-[10px] font-medium text-[#111111]">Approval</p>
        <RollingCounter value={done ? list.length : step + 1} total={list.length} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.snappy}
            className="flex items-center gap-1.5 px-2.5 py-4"
          >
            <span className="flex size-4 items-center justify-center rounded-full bg-[#111111] text-[#FDFDFC]">
              <CheckIcon className="size-2.5" strokeWidth={3} />
            </span>
            <p className="text-[10px] text-[#111111]">Approved</p>
          </motion.div>
        ) : (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={springs.smooth}
            className="p-2.5"
          >
            <p className="text-[10px] font-medium text-[#111111]">
              {question.title}
            </p>
            <div className="mt-1.5 flex flex-col gap-1">
              {question.choices.map((choice) => {
                const active = picked.includes(choice.id)
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => toggle(choice.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-left text-[10px] transition-colors",
                      active
                        ? "bg-[#111111]/5 text-[#111111]"
                        : "text-[#9C9C9B] hover:bg-[#111111]/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-3 shrink-0 items-center justify-center border transition-colors",
                        question.multiple ? "rounded-[3px]" : "rounded-full",
                        active
                          ? "border-[#111111] bg-[#111111]"
                          : "border-[#9C9C9B]/60"
                      )}
                    >
                      {active ? (
                        question.multiple ? (
                          <CheckIcon
                            className="size-2 text-[#FDFDFC]"
                            strokeWidth={3.5}
                          />
                        ) : (
                          <motion.span
                            layoutId={`naisu-approval-dot-${uid}-${question.id}`}
                            transition={springs.snappy}
                            className="size-1 rounded-full bg-[#FDFDFC]"
                          />
                        )
                      ) : null}
                    </span>
                    <span className="truncate">{choice.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!done ? (
        <div className="flex items-center gap-1 border-t border-[#9C9C9B]/20 px-2 py-1.5">
          <button
            type="button"
            onClick={advance}
            className="rounded-lg px-2 py-1 text-[10px] text-[#9C9C9B] transition-colors hover:text-[#111111]"
          >
            Skip
          </button>
          <motion.button
            type="button"
            onClick={advance}
            whileTap={{ scale: 0.96 }}
            transition={springs.snappy}
            className="ml-auto rounded-lg bg-[#111111] px-2.5 py-1 text-[10px] text-[#FDFDFC]"
          >
            {step + 1 === list.length ? "Approve" : "Continue"}
          </motion.button>
        </div>
      ) : null}
    </div>
  )
}

function RollingCounter({ value, total }: { value: number; total: number }) {
  return (
    <span className="flex items-center font-mono text-[9px] text-[#9C9C9B]">
      <span className="relative inline-flex h-3 w-[6px] overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={springs.snappy}
            className="absolute inset-0 text-center text-[#111111]"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      /{total}
    </span>
  )
}
