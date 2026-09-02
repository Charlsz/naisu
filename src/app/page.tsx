"use client"

import * as React from "react"

import { ClickFeedback } from "@/components/click-feedback"
import { ComponentCard } from "@/components/component-card"
import { galleryDemos } from "@/components/demos-gallery"
import { SideNav } from "@/components/side-nav"
import { SoundProvider } from "@/components/sound-provider"
import { categories, categoryIds } from "@/content/components"
import { sourceFileById } from "@/content/source-files"
import { componentSources } from "@/content/sources"

function panelCode(id: string, label: string, hint?: string) {
  const path = sourceFileById[id]
  return (
    componentSources[id] ??
    (path
      ? `// ${path}\n// Open this file in the repository to copy the component.`
      : hint
        ? `// ${label} · ${hint}`
        : `// ${label}`)
  )
}

const demos: Record<string, React.ComponentType> = {
  ...galleryDemos,
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

  return (
    <SoundProvider>
      <ClickFeedback />
      <SideNav activeId={activeId} />

      <main className="mx-auto min-h-screen max-w-[1280px] px-4 pt-28 pb-24 md:pl-52 md:pr-12 md:pt-12">
        <header className="mb-12 max-w-xl">
          <p className="text-[13px] font-medium text-muted-foreground">AI-native UI kit</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight text-foreground">
            Crafted primitives for agent and chat interfaces.
          </h1>
        </header>

        <div className="flex flex-col gap-16">
          {categories.map((cat, i) => {
            const panels = cat.items.flatMap((item) => {
              if (item.variants?.length) {
                return item.variants.map((v) => {
                  const Demo = demos[v.id]
                  return {
                    id: v.id,
                    hint: v.hint
                      ? `${item.label} · ${v.hint}`
                      : item.label,
                    code: panelCode(v.id, item.label, v.hint),
                    children: Demo ? <Demo /> : null,
                  }
                })
              }

              const Demo = demos[item.id]
              return [
                {
                  id: item.id,
                  hint: item.label,
                  code: panelCode(item.id, item.label),
                  children: Demo ? <Demo /> : null,
                },
              ]
            })

            return (
              <ComponentCard
                key={cat.id}
                id={cat.id}
                index={String(i + 1).padStart(2, "0")}
                title={cat.label}
                panels={panels}
                dense={cat.dense}
                stage={cat.stage}
                escape={cat.escape}
                fullWidth={cat.fullWidth}
              />
            )
          })}
        </div>
      </main>
    </SoundProvider>
  )
}
