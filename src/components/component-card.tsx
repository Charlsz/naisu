"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon, CodeIcon, CopyIcon, XIcon } from "lucide-react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

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
  /** Force a single full-width column (e.g. Scroll demos). */
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
            ? 280
            : 260

  return (
    <section id={id} data-naisu-section className="scroll-mt-10">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[11px] font-medium tracking-tight text-[#111111]">
          {index ? (
            <span className="mr-2 tabular-nums text-[#9C9C9B]">{index}</span>
          ) : null}
          {title}
        </h2>
      </div>

      <div
        className="grid gap-4"
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
            spanFull={
              panel.id === "continuous-slider" || panel.id === "anim-marquee"
            }
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
  spanFull = false,
}: {
  id: string
  title: string
  hint?: string
  code: string
  children: React.ReactNode
  stage: StageKind
  escape: boolean
  spanFull?: boolean
}) {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div
      id={id}
      data-component-grid
      className={cn(
        "flex min-w-0 scroll-mt-10 flex-col gap-1.5",
        spanFull && "col-span-full"
      )}
    >
      {hint ? (
        <p className="px-1 text-[10px] text-[#9C9C9B]">{hint}</p>
      ) : null}

      <div
        className={cn(
          "group relative isolate rounded-2xl",
          "bg-[#EEF2F7]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(16,24,40,0.04),0_10px_28px_rgba(16,24,40,0.06)]",
          "ring-1 ring-[#101828]/6",
          escape ? "overflow-visible" : "overflow-hidden",
          stage === "dense" && "aspect-[21/9] min-h-[160px]",
          stage === "square" && "aspect-square min-h-[200px]",
          stage === "default" && "aspect-[4/3] min-h-[220px]",
          stage === "tall" && "aspect-[3/4] min-h-[260px] sm:aspect-[4/3]",
          stage === "wide" && "min-h-[240px] aspect-[21/9] sm:min-h-[280px]",
          id === "reading-notebook" &&
            "!aspect-[5/4] !min-h-[200px] sm:!min-h-[220px]",
          id === "cool-scrollbar" &&
            "!aspect-[5/4] !min-h-[200px] sm:!min-h-[220px]",
          (id === "continuous-slider" || id === "anim-marquee") &&
            "!aspect-[28/5] !min-h-[112px] sm:!min-h-[124px]",
          id === "anim-corner" && "!pl-0"
        )}
      >
        {/* Soft canvas texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.55]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(16,24,40,0.09) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 45%, #000 35%, transparent 100%)",
          }}
        />

        <div className="absolute top-2.5 right-2.5 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
          <button
            type="button"
            onClick={copy}
            className="flex size-7 items-center justify-center rounded-lg bg-[#FDFDFC] text-[#111111] shadow-[0_1px_3px_rgba(16,24,40,0.1)] ring-1 ring-[#101828]/8 transition-transform active:scale-95"
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
            className="flex size-7 items-center justify-center rounded-lg bg-[#FDFDFC] text-[#111111] shadow-[0_1px_3px_rgba(16,24,40,0.1)] ring-1 ring-[#101828]/8 transition-transform active:scale-95"
            aria-label="Code"
          >
            <CodeIcon className="size-3.5" />
          </button>
        </div>

        {/* Containment: full stage, centered, never overextends */}
        <div
          className={cn(
            "relative z-0 size-full min-h-0 min-w-0 p-3 sm:p-4",
            escape ? "overflow-visible" : "overflow-hidden",
            id === "compare-reveal" && "!p-2 sm:!p-3",
            id === "anim-corner" && "!p-1 sm:!p-1.5 !pl-0 sm:!pl-0",
            (id === "continuous-slider" || id === "anim-marquee") &&
              "!px-1 sm:!px-2"
          )}
        >
          <div
            className={cn(
              "flex size-full min-h-0 min-w-0 items-center justify-center",
              escape ? "overflow-visible" : "overflow-hidden",
              id === "anim-corner" && "!justify-start"
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
        className="flex max-h-[min(80vh,560px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-[#FDFDFC] shadow-[0_16px_48px_rgba(16,24,40,0.18)] ring-1 ring-[#101828]/8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#ECECEC] px-4 py-2.5">
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
