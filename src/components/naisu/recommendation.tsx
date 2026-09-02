"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

type CtaTone = "accent" | "primary" | "success"

type Option = {
  key: string
  body: React.ReactNode
  short: string
  signal: number
  tone: string
  label: string
  cta: string
  ctaTone: CtaTone
}

function EntityChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[13px] font-medium text-foreground">
      {name}
    </span>
  )
}

function ValuePill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "green" | "orange"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-px text-[10px] font-medium",
        tone === "green" && "bg-muted text-foreground",
        tone === "orange" && "bg-muted text-muted-foreground",
        tone === "neutral" && "bg-muted text-foreground"
      )}
    >
      {children}
    </span>
  )
}

const OPTIONS: Option[] = [
  {
    key: "patch",
    body: (
      <>
        Patch <EntityChip name="parse()" /> in place. Move the guard earlier
        and keep the signature. Est.{" "}
        <ValuePill tone="green">~12 min</ValuePill>
      </>
    ),
    short: "Patch parse() in place · ~12 min",
    signal: 3,
    tone: "#1A1A1A",
    label: "High confidence",
    cta: "Accept",
    ctaTone: "accent",
  },
  {
    key: "extract",
    body: (
      <>
        Extract a shared <ValuePill>validateId()</ValuePill> helper before
        touching call sites.
      </>
    ),
    short: "Extract validateId() helper",
    signal: 2,
    tone: "#9C9C9B",
    label: "Needs review",
    cta: "Configure",
    ctaTone: "primary",
  },
  {
    key: "rewrite",
    body: (
      <>
        Fall back to a{" "}
        <span className="font-medium text-[#111111]">full module rewrite</span>{" "}
        across the parser surface.
      </>
    ),
    short: "Full module rewrite",
    signal: 0,
    tone: "#9C9C9B",
    label: "No signal",
    cta: "Accept rewrite",
    ctaTone: "primary",
  },
]

function Meter({ signal, tone }: { signal: number; tone: string }) {
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-1 rounded-full transition-colors duration-300"
          style={{
            height: 8 + bar * 2,
            background: bar < signal ? tone : "rgba(156,156,155,0.35)",
          }}
        />
      ))}
    </span>
  )
}

const CTA_CLASS: Record<CtaTone, string> = {
  accent: "bg-primary text-primary-foreground hover:opacity-90",
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  success: "bg-primary text-primary-foreground",
}

export type RecommendationProps = {
  className?: string
  onAccept?: () => void
}

/**
 * Recommendation card: shape stays put; Alternatives opens a drawer;
 * picking an option promotes it; primary CTA confirms.
 */
export function Recommendation({ className, onAccept }: RecommendationProps) {
  const [selected, setSelected] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [accepted, setAccepted] = React.useState(false)

  const active = OPTIONS[selected]
  const others = OPTIONS.map((o, i) => ({ o, i })).filter(
    ({ i }) => i !== selected
  )

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl bg-background shadow-[var(--shadow-soft)] ring-1 ring-border",
        className
      )}
    >
      <div className="px-3 pt-3 pb-2.5">
        <span className="text-sm font-medium text-foreground">
          Want me to apply this fix?
        </span>
        <p
          key={active.key}
          className="mt-2 min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground"
          style={{ animation: "naisu-fade-up 180ms ease-out both" }}
        >
          {active.body}
        </p>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border bg-muted px-3 py-2">
            <p className="px-1.5 pb-1 text-[13px] font-medium text-muted-foreground">
              Other options
            </p>
            {others.map(({ o, i }) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  setSelected(i)
                  setAccepted(false)
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors duration-100 hover:bg-background"
              >
                <Meter signal={o.signal} tone={o.tone} />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {o.short}
                </span>
                <span className="shrink-0 text-[13px] text-muted-foreground">
                  {o.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-background px-4 py-3">
        <span className="flex min-w-0 items-center gap-2">
          <Meter signal={active.signal} tone={active.tone} />
          <span className="truncate text-sm font-medium text-muted-foreground">
            {active.label}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-expanded={open}
            disabled={accepted}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "min-h-9 rounded-lg px-3 text-sm transition-colors",
              accepted
                ? "pointer-events-none text-muted-foreground/40"
                : "bg-muted text-foreground hover:bg-accent"
            )}
          >
            Alternatives
          </button>
          <motion.button
            type="button"
            disabled={accepted}
            whileTap={accepted ? undefined : { scale: 0.96 }}
            transition={springs.snappy}
            onClick={() => {
              if (accepted) return
              setAccepted(true)
              setOpen(false)
              onAccept?.()
            }}
            className={cn(
              "flex min-h-9 min-w-[88px] items-center justify-center gap-1 rounded-lg px-3 text-sm transition-colors",
              accepted ? CTA_CLASS.success : CTA_CLASS[active.ctaTone]
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {accepted ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={springs.snappy}
                  className="flex items-center gap-1"
                >
                  <CheckIcon className="size-3" strokeWidth={3} />
                  Accepted
                </motion.span>
              ) : (
                <motion.span
                  key={active.cta}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={springs.snappy}
                >
                  {active.cta}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </span>
      </div>
    </div>
  )
}
