"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn, focusRing } from "@/lib/utils"

export type PromptModel = { id: string; label: string }

export type PromptInputProps = {
  placeholder?: string
  models?: PromptModel[]
  onSend?: (value: string) => void
  className?: string
}

const DEFAULT_MODELS: PromptModel[] = [
  { id: "fast", label: "Fast" },
  { id: "balanced", label: "Balanced" },
  { id: "deep", label: "Deep" },
]

const ATTACHMENTS = ["model.ts", "parser.ts"]

export function PromptInput({
  placeholder = "Ask anything…",
  models = DEFAULT_MODELS,
  onSend,
  className,
}: PromptInputProps) {
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState(models[0].id)
  const [open, setOpen] = React.useState(false)
  const [files, setFiles] = React.useState<string[]>([])

  const activeModel = models.find((m) => m.id === model) ?? models[0]

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue("")
    setFiles([])
  }

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl bg-background p-2 ring-1 ring-border",
        className
      )}
    >
      <AnimatePresence initial={false}>
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.soft}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {files.map((file) => (
              <span
                key={file}
                className="mb-1 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 ring-1 ring-border"
                style={{ animation: "naisu-pop-in 0.2s ease-out both" }}
              >
                <span className="font-mono text-[13px] text-foreground">{file}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFiles((prev) => prev.filter((f) => f !== file))
                  }
                  aria-label={`Remove ${file}`}
                  className={cn("flex text-muted-foreground hover:text-foreground", focusRing)}
                >
                  <XIcon className="size-3.5" strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder={placeholder}
        rows={2}
        className="resize-none bg-transparent px-2 py-1 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />

      <div className="flex items-center gap-2 px-1">
        <motion.button
          type="button"
          onClick={() =>
            setFiles((prev) =>
              prev.length >= ATTACHMENTS.length
                ? prev
                : [...prev, ATTACHMENTS[prev.length]]
            )
          }
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          aria-label="Attach"
          className={cn(
            "flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            focusRing
          )}
        >
          <PlusIcon className="size-4" strokeWidth={2.5} />
        </motion.button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex min-h-9 items-center gap-1 rounded-lg px-3 text-[13px] text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground",
              focusRing
            )}
          >
            {activeModel.label}
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={springs.snappy}
              className="flex"
            >
              <ChevronDownIcon className="size-3.5" strokeWidth={2.5} />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={springs.snappy}
                className="absolute bottom-full left-0 z-10 mb-1 w-28 origin-bottom-left overflow-hidden rounded-lg bg-background p-1 ring-1 ring-border"
              >
                {models.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setModel(item.id)
                        setOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-muted",
                        focusRing
                      )}
                    >
                      <span className="flex size-3 shrink-0 items-center justify-center">
                        {item.id === model ? (
                          <CheckIcon className="size-3" strokeWidth={3} />
                        ) : null}
                      </span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={submit}
          whileTap={{ scale: 0.92 }}
          transition={springs.snappy}
          aria-label="Send"
          className={cn(
            "ml-auto flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground",
            focusRing
          )}
        >
          <ArrowUpIcon className="size-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}
