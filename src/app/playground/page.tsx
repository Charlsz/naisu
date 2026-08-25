"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, CopyIcon } from "lucide-react"

import { VintageKeyboard } from "@/components/ui/vintage-keyboard"
import { playgroundProjects } from "@/content/playground"
import { componentSources } from "@/content/sources"
import { cn } from "@/lib/utils"

export default function PlaygroundPage() {
  const [activeId, setActiveId] = React.useState(playgroundProjects[0]?.id)
  const active =
    playgroundProjects.find((p) => p.id === activeId) ?? playgroundProjects[0]
  const source = active ? componentSources[active.id] : ""

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111111]">
      <header className="sticky top-0 z-30 border-b border-[#101828]/8 bg-[#F4F5F7]/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[12px] font-medium tracking-tight text-[#111111]"
            >
              naisu
            </Link>
            <span className="text-[#9C9C9B]">/</span>
            <span className="text-[12px] text-[#667085]">Playground</span>
          </div>
          <Link
            href="/"
            className="text-[11px] text-[#667085] transition-colors hover:text-[#111111]"
          >
            Components
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1200px] gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-16 md:self-start">
          <p className="mb-3 text-[10px] font-medium tracking-wide text-[#9C9C9B] uppercase">
            Projects
          </p>
          <ul className="space-y-1">
            {playgroundProjects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(project.id)}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors",
                    activeId === project.id
                      ? "bg-[#111111] text-[#FDFDFC]"
                      : "text-[#344054] hover:bg-[#111111]/5"
                  )}
                >
                  {project.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="min-w-0">
          {active ? (
            <>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-[18px] font-medium tracking-tight">
                    {active.title}
                  </h1>
                  <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-[#667085]">
                    {active.blurb}
                  </p>
                </div>
                <CopySource code={source} />
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#FAFAFA] ring-1 ring-[#101828]/8">
                {active.id === "vintage-keyboard" ? (
                  <VintageKeyboard />
                ) : null}
              </div>

              <div className="mt-4 space-y-1.5 text-[11px] leading-relaxed text-[#667085]">
                <p>
                  Save as{" "}
                  <code className="rounded bg-[#111111]/5 px-1 py-0.5 text-[10px]">
                    components/ui/vintage-keyboard.tsx
                  </code>
                  , then:
                </p>
                <pre className="overflow-x-auto rounded-lg bg-[#111111] p-3 text-[10px] text-[#FDFDFC]">
                  {`import { VintageKeyboard } from "@/components/ui/vintage-keyboard"

export default function Page() {
  return <VintageKeyboard />
}`}
                </pre>
                <p>
                  Needs React client components, Tailwind CSS, and TypeScript.
                  No extra npm packages.
                </p>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  )
}

function CopySource({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!code}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#FDFDFC] px-2.5 text-[11px] text-[#111111] shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-[#101828]/10 disabled:opacity-40"
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy component"}
    </button>
  )
}
