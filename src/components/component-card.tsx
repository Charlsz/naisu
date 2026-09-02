"use client"

import * as React from "react"
import { CodeIcon } from "lucide-react"
import { AnimatePresence } from "motion/react"

import { CodeModal } from "@/components/code-modal"
import { cn, focusRing } from "@/lib/utils"

export type DemoStageProps = {
  id: string
  index: string
  title: string
  description: string
  code: string
  sourcePath?: string
  escape?: boolean
  hero?: boolean
  children: React.ReactNode
}

export function DemoStage({
  id,
  index,
  title,
  description,
  code,
  sourcePath,
  escape = false,
  hero = false,
  children,
}: DemoStageProps) {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <article
      id={id}
      data-component-stage
      className="scroll-mt-28 md:scroll-mt-24"
    >
      <header className="mb-5 max-w-[640px]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-6 shrink-0 tabular-nums text-[13px] font-medium text-ink-3">
            {index}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-medium leading-snug tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
              {description}
            </p>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "group/stage relative mx-auto w-full max-w-[640px] bg-surface shadow-[var(--shadow-card)]",
          "rounded-[var(--radius-card)]",
          escape ? "overflow-visible" : "overflow-hidden",
          hero ? "min-h-[420px]" : "min-h-[200px]"
        )}
      >
        <div
          className={cn(
            "absolute top-3 right-3 z-20 flex gap-2 opacity-100 transition-opacity focus-within:opacity-100 md:opacity-100"
          )}
        >
          <button
            type="button"
            onClick={copy}
            className={cn(
              "flex h-[32px] items-center justify-center bg-surface px-4 text-[13px] font-medium text-ink shadow-[var(--shadow-btn)]",
              "rounded-[var(--radius-control)] transition-all duration-150",
              "hover:shadow-[var(--shadow-raised)] active:scale-[0.98]",
              focusRing
            )}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex h-[32px] items-center gap-2 bg-surface px-4 text-[13px] font-medium text-ink shadow-[var(--shadow-btn)]",
              "rounded-[var(--radius-control)] transition-all duration-150",
              "hover:shadow-[var(--shadow-raised)] active:scale-[0.98]",
              focusRing
            )}
          >
            <CodeIcon className="size-4" aria-hidden />
            View code
          </button>
        </div>

        <div
          className={cn(
            "relative z-0 px-5 py-6 sm:px-8 sm:py-8",
            escape ? "overflow-visible" : "overflow-hidden"
          )}
        >
          <div className="mx-auto w-full">{children}</div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <CodeModal
            title={title}
            code={code}
            sourcePath={sourcePath}
            onClose={() => setOpen(false)}
            onCopy={copy}
            copied={copied}
          />
        )}
      </AnimatePresence>
    </article>
  )
}

export function SectionDivider({
  index,
  title,
  description,
  id,
}: {
  index: string
  title: string
  description: string
  id: string
}) {
  return (
    <div id={id} data-naisu-section className="scroll-mt-28 md:scroll-mt-24">
      <h2 className="text-[16px] font-medium leading-snug tracking-tight text-ink">
        <span className="mr-2 tabular-nums text-ink-3">{index}</span>
        {title}
      </h2>
      <p className="mt-2.5 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
        {description}
      </p>
    </div>
  )
}
