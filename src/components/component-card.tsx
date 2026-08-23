"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon, CodeIcon, CopyIcon, XIcon } from "lucide-react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function ComponentCard({
  title,
  index,
  id,
  panels,
}: {
  title: string
  index: string
  id: string
  panels: {
    id: string
    code: string
    hint?: string
    children: React.ReactNode
  }[]
}) {
  return (
    <section id={id} data-naisu-section className="scroll-mt-8">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-[11px] font-medium tracking-tight text-[#111111]">
          <span className="mr-2 text-[#9C9C9B]">{index}</span>
          {title}
        </h2>
      </div>

      <div
        className={cn(
          "grid gap-4",
          panels.length > 1
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-" +
                Math.min(panels.length, 3)
            : "grid-cols-1"
        )}
        style={
          panels.length > 1
            ? {
                gridTemplateColumns: `repeat(${Math.min(panels.length, 3)}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {panels.map((panel) => (
          <DemoPanel
            key={panel.id}
            title={title}
            hint={panel.hint}
            code={panel.code}
          >
            {panel.children}
          </DemoPanel>
        ))}
      </div>
    </section>
  )
}

function DemoPanel({
  title,
  hint,
  code,
  children,
}: {
  title: string
  hint?: string
  code: string
  children: React.ReactNode
}) {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const modalTitle = hint ? `${title} — ${hint}` : title

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div data-component-grid className="flex flex-col gap-2">
      {hint ? (
        <p className="px-1 text-[10px] text-[#9C9C9B]">{hint}</p>
      ) : null}

      <div className="group relative h-[min(36vh,260px)] min-h-[180px] overflow-hidden rounded-[24px] bg-[#D9D9D9]">
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={copy}
            className="flex size-8 items-center justify-center rounded-lg bg-[#FDFDFC] text-[#111111] shadow-sm transition-transform active:scale-95"
            aria-label="Copy"
          >
            {copied ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-8 items-center justify-center rounded-lg bg-[#FDFDFC] text-[#111111] shadow-sm transition-transform active:scale-95"
            aria-label="Code"
          >
            <CodeIcon className="size-3.5" />
          </button>
        </div>

        <div className="size-full">{children}</div>
      </div>

      <AnimatePresence>
        {open && (
          <CodeModal
            title={modalTitle}
            code={code}
            onClose={() => setOpen(false)}
            onCopy={copy}
            copied={copied}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CodeModal({
  title,
  code,
  onClose,
  onCopy,
  copied,
}: {
  title: string
  code: string
  onClose: () => void
  onCopy: () => void
  copied: boolean
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal
        aria-label={`${title} code`}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 4 }}
        transition={springs.snappy}
        className="flex max-h-[min(80vh,560px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#9C9C9B] bg-[#FDFDFC]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#9C9C9B]/40 px-4 py-2">
          <p className="truncate text-xs font-medium text-[#111111]">{title}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onCopy}
              className="flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] text-[#111111] transition-transform hover:bg-[#111111]/5 active:scale-95"
            >
              {copied ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg transition-transform hover:bg-[#111111]/5 active:scale-95"
              aria-label="Close"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        </div>
        <pre className="overflow-auto p-4 text-[11px] leading-relaxed text-[#111111]">
          <code>{code}</code>
        </pre>
      </motion.div>
    </motion.div>
  )
}
