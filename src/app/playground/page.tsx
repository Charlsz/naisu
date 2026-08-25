"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckIcon, CodeIcon, CopyIcon, XIcon } from "lucide-react"

import { ClickFeedback } from "@/components/click-feedback"
import { PlaygroundNav } from "@/components/playground-nav"
import { SoundProvider } from "@/components/sound-provider"
import { VintageKeyboard } from "@/components/ui/vintage-keyboard"
import { playgroundProjects } from "@/content/playground"
import { componentSources } from "@/content/sources"
import { springs } from "@/lib/motion"

export default function PlaygroundPage() {
  const [activeId, setActiveId] = React.useState(
    playgroundProjects[0]?.id ?? ""
  )
  const active =
    playgroundProjects.find((p) => p.id === activeId) ?? playgroundProjects[0]
  const source = active ? (componentSources[active.id] ?? "") : ""
  const [copied, setCopied] = React.useState(false)
  const [codeOpen, setCodeOpen] = React.useState(false)

  async function copy() {
    if (!source) return
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <SoundProvider>
      <ClickFeedback />
      <PlaygroundNav activeId={activeId} onSelect={setActiveId} />

      <main className="relative min-h-screen md:pl-52">
        <div className="absolute top-3 right-3 z-20 flex gap-1 max-md:top-14">
          <button
            type="button"
            onClick={copy}
            disabled={!source}
            className="flex size-7 items-center justify-center rounded-lg bg-[#FDFDFC] text-[#111111] shadow-[0_1px_3px_rgba(16,24,40,0.1)] ring-1 ring-[#101828]/8 transition-transform active:scale-95 disabled:opacity-40"
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
            onClick={() => setCodeOpen(true)}
            disabled={!source}
            className="flex size-7 items-center justify-center rounded-lg bg-[#FDFDFC] text-[#111111] shadow-[0_1px_3px_rgba(16,24,40,0.1)] ring-1 ring-[#101828]/8 transition-transform active:scale-95 disabled:opacity-40"
            aria-label="Code"
          >
            <CodeIcon className="size-3.5" />
          </button>
        </div>

        <div className="min-h-screen w-full">
          {active?.id === "vintage-keyboard" ? <VintageKeyboard /> : null}
        </div>
      </main>

      <AnimatePresence>
        {codeOpen && active ? (
          <CodeModal
            title={active.title}
            code={source}
            copied={copied}
            onCopy={copy}
            onClose={() => setCodeOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </SoundProvider>
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
              className="flex size-8 items-center justify-center rounded-lg transition-transform hover:bg-[#111111]/5 active:scale-95"
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
