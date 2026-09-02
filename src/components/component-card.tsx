"use client"

import * as React from "react"
import { CodeIcon } from "lucide-react"
import { AnimatePresence } from "motion/react"

import { CodeModal } from "@/components/code-modal"
import { cn } from "@/lib/utils"
import { focusRing } from "@/lib/utils"

export type StageKind = "default" | "square" | "dense" | "tall" | "wide"

export function ComponentCard({
  title,
  index,
  id,
  panels,
  dense = false,
  stage = "default",
  escape = false,
  fullWidth = false,
}: {
  title: string
  index?: string
  id: string
  panels: {
    id: string
    code: string
    hint?: string
    children: React.ReactNode
  }[]
  dense?: boolean
  stage?: StageKind
  escape?: boolean
  fullWidth?: boolean
}) {
  const resolvedStage: StageKind = dense ? "dense" : stage

  const minCol =
    fullWidth || resolvedStage === "wide"
      ? 640
      : resolvedStage === "square"
        ? 220
        : resolvedStage === "dense"
          ? 280
          : resolvedStage === "tall"
            ? 320
            : 280

  return (
    <section id={id} data-naisu-section className="scroll-mt-24 md:scroll-mt-10">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          {index ? (
            <span className="mr-2 tabular-nums text-muted-foreground">{index}</span>
          ) : null}
          {title}
        </h2>
      </div>

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: fullWidth
            ? "1fr"
            : `repeat(auto-fill, minmax(min(100%, ${minCol}px), 1fr))`,
        }}
      >
        {panels.map((panel) => (
          <DemoPanel
            key={panel.id}
            id={panel.id}
            title={panel.hint ?? title}
            hint={panel.hint}
            code={panel.code}
            stage={resolvedStage}
            escape={escape}
          >
            {panel.children}
          </DemoPanel>
        ))}
      </div>
    </section>
  )
}

function DemoPanel({
  id,
  title,
  hint,
  code,
  children,
  stage,
  escape,
}: {
  id: string
  title: string
  hint?: string
  code: string
  children: React.ReactNode
  stage: StageKind
  escape: boolean
}) {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div id={id} data-component-grid className="group/panel flex min-w-0 scroll-mt-24 flex-col gap-2 md:scroll-mt-10">
      {hint ? (
        <p className="px-1 text-[13px] font-medium text-muted-foreground">{hint}</p>
      ) : null}

      <div
        className={cn(
          "relative isolate rounded-2xl bg-surface ring-1 ring-border",
          escape ? "overflow-visible" : "overflow-hidden",
          stage === "dense" && "aspect-[21/9] min-h-[180px]",
          stage === "square" && "aspect-square min-h-[220px]",
          stage === "default" && "aspect-[4/3] min-h-[240px]",
          stage === "tall" && "aspect-[3/4] min-h-[280px] sm:aspect-[4/3]",
          stage === "wide" && "min-h-[260px] aspect-[21/9] sm:min-h-[300px]"
        )}
      >
        <div aria-hidden className="naisu-stage-grid pointer-events-none absolute inset-0 rounded-2xl" />

        <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-100 transition-opacity focus-within:opacity-100 md:opacity-0 md:group-hover/panel:opacity-100 md:group-focus-within/panel:opacity-100">
          <button
            type="button"
            onClick={copy}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg bg-background text-foreground shadow-[var(--shadow-soft)] ring-1 ring-border transition-transform active:scale-95",
              focusRing
            )}
            aria-label="Copy"
          >
            {copied ? (
              <span className="text-xs font-medium">OK</span>
            ) : (
              <span className="text-xs font-medium">Copy</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg bg-background text-foreground shadow-[var(--shadow-soft)] ring-1 ring-border transition-transform active:scale-95",
              focusRing
            )}
            aria-label="Code"
          >
            <CodeIcon className="size-4" />
          </button>
        </div>

        <div
          className={cn(
            "relative z-0 size-full min-h-0 min-w-0 p-4 sm:p-6",
            escape ? "overflow-visible" : "overflow-hidden"
          )}
        >
          <div
            className={cn(
              "flex size-full min-h-0 min-w-0 items-center justify-center",
              escape ? "overflow-visible" : "overflow-hidden"
            )}
          >
            {children}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <CodeModal
            title={title}
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
