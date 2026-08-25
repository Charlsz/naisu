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
    <span className="inline-flex items-center rounded-md bg-[#315FEA]/12 px-1.5 py-px text-[10px] font-medium text-[#244FD1]">
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
        tone === "green" && "bg-[#128A55]/12 text-[#128A55]",
        tone === "orange" && "bg-[#B86E00]/12 text-[#B86E00]",
        tone === "neutral" && "bg-[#111111]/6 text-[#111111]"
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
    tone: "#128A55",
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
    tone: "#B86E00",
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
  accent: "bg-[#315FEA] text-white hover:bg-[#244FD1]",
  primary: "bg-[#111111] text-[#FDFDFC] hover:opacity-90",
  success: "bg-[#128A55] text-white",
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
        "w-full overflow-hidden rounded-2xl bg-[#FDFDFC] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.06)]",
        className
      )}
    >
      <div className="px-3 pt-3 pb-2.5">
        <span className="text-[12px] font-medium text-[#111111]">
          Want me to apply this fix?
        </span>
        <p
          key={active.key}
          className="mt-1.5 min-h-[2.75rem] text-[11px] leading-relaxed text-[#667085]"
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
          <div className="border-t border-[#ECECEC] bg-[#F8FAFD] px-2 py-2">
            <p className="px-1.5 pb-1 text-[10px] font-medium text-[#9C9C9B]">
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
                className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors duration-100 hover:bg-[#315FEA]/6"
              >
                <Meter signal={o.signal} tone={o.tone} />
                <span className="min-w-0 flex-1 truncate text-[11px] text-[#111111]">
                  {o.short}
                </span>
                <span className="shrink-0 text-[10px] text-[#9C9C9B]">
                  {o.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#ECECEC] bg-[#FDFDFC] px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <Meter signal={active.signal} tone={active.tone} />
          <span className="truncate text-[11px] font-medium text-[#667085]">
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
              "h-7 rounded-lg px-2.5 text-[11px] transition-colors",
              accepted
                ? "pointer-events-none text-[#9C9C9B]/40"
                : "bg-[#111111]/5 text-[#111111] hover:bg-[#111111]/8"
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
              "flex h-7 min-w-[76px] items-center justify-center gap-1 rounded-lg px-2.5 text-[11px] transition-colors",
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
