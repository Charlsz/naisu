"use client"

import * as React from "react"

import { ClickFeedback } from "@/components/click-feedback"
import { DemoStage, SectionDivider } from "@/components/component-card"
import { galleryDemos } from "@/components/demos-gallery"
import { SideNav } from "@/components/side-nav"
import { SoundProvider } from "@/components/sound-provider"
import { categories, categoryIds } from "@/content/components"
import { sourceFileById } from "@/content/source-files"
import { componentSources } from "@/content/sources"

function panelCode(id: string, label: string) {
  const path = sourceFileById[id]
  if (componentSources[id]) return componentSources[id]
  if (path) {
    return `// ${path}\n// Open this file in the repository to copy the component.\n// Requires foundation tokens from src/app/globals.css.`
  }
  return `// ${label}\n// Component source is available in the repository.`
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])

  React.useEffect(() => {
    function sync() {
      if (!ids.length) return

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      if (window.scrollY <= 8) {
        setActive(ids[0])
        return
      }
      if (maxScroll > 0 && window.scrollY >= maxScroll - 8) {
        setActive(ids[ids.length - 1])
        return
      }

      const marker = window.innerHeight * 0.22
      let best = ids[0]
      let bestScore = Number.POSITIVE_INFINITY

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        const score = top <= marker ? marker - top : (top - marker) * 1.35
        if (score < bestScore) {
          bestScore = score
          best = id
        }
      }

      setActive(best)
    }

    sync()
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [ids])

  return active
}

export default function HomePage() {
  const ids = React.useMemo(() => categoryIds(), [])
  const activeId = useActiveSection(ids)

  let panelIndex = 0

  return (
    <SoundProvider>
      <ClickFeedback />
      <SideNav activeId={activeId} />

      <main className="mx-auto min-h-screen max-w-[1280px] px-4 pt-28 pb-24 md:pl-52 md:pr-12 md:pt-12">
        <header className="mb-20 max-w-[640px]">
          <p className="text-[13px] font-medium tracking-tight text-ink-3">
            AI-native UI kit
          </p>
          <h1 className="mt-2 text-[32px] font-medium leading-tight tracking-tight text-ink">
            Crafted primitives for agent and chat interfaces.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            Follow one coding agent as it patches <code className="rounded-[4px] bg-hover px-1.5 py-0.5 font-mono text-[13px] text-ink">parse()</code> in{" "}
            <span className="font-medium text-ink">payments-api</span>.
          </p>
        </header>

        <div className="flex flex-col gap-28">
          {categories.map((cat, catIndex) => {
            const sectionPanels = cat.items.flatMap((item) => {
              if (item.variants?.length) {
                return item.variants.map((variant) => {
                  panelIndex += 1
                  const Demo = galleryDemos[variant.id]
                  return (
                    <DemoStage
                      key={variant.id}
                      id={variant.id}
                      index={String(panelIndex).padStart(2, "0")}
                      title={`${item.label} / ${variant.label}`}
                      description={variant.description}
                      code={panelCode(variant.id, `${item.label} / ${variant.label}`)}
                      sourcePath={sourceFileById[variant.id]}
                      escape={cat.escape}
                      hero={cat.hero && variant.id === "conversation"}
                    >
                      {Demo ? <Demo /> : null}
                    </DemoStage>
                  )
                })
              }

              panelIndex += 1
              const Demo = galleryDemos[item.id]
              return (
                <DemoStage
                  key={item.id}
                  id={item.id}
                  index={String(panelIndex).padStart(2, "0")}
                  title={item.label}
                  description={item.description}
                  code={panelCode(item.id, item.label)}
                  sourcePath={sourceFileById[item.id]}
                  escape={cat.escape}
                  hero={cat.hero && item.id === "conversation"}
                >
                  {Demo ? <Demo /> : null}
                </DemoStage>
              )
            })

            return (
              <section key={cat.id} className="flex flex-col gap-20">
                <SectionDivider
                  id={cat.id}
                  index={String(catIndex + 1).padStart(2, "0")}
                  title={cat.label}
                  description={cat.description}
                />
                <div className="flex flex-col gap-24">{sectionPanels}</div>
              </section>
            )
          })}
        </div>
      </main>
    </SoundProvider>
  )
}
