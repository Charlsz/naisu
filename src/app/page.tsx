"use client"

import * as React from "react"

import { ClickFeedback } from "@/components/click-feedback"
import { ComponentCard } from "@/components/component-card"
import {
  CardTiltDemo,
  CheckboxBloomDemo,
  CheckboxInkDemo,
  CheckboxSealDemo,
  CircularProgressDemo,
  ClickShockwaveDemo,
  CompareRevealDemo,
  CoolScrollbarDemo,
  CursorSpotlightDemo,
  HoverBorderDemo,
  HoverRevealDemo,
  InfiniteSliderDemo,
  LoadingIndicatorDemo,
  MagneticButtonDemo,
  NumberCounterDemo,
  ReadingNotebookDemo,
  TabsPillDemo,
  TabsUnderlineDemo,
  ToggleDemo,
} from "@/components/demos"
import { galleryDemos } from "@/components/demos-gallery"
import { CoolScrollbar } from "@/components/naisu/cool-scrollbar"
import { SideNav } from "@/components/side-nav"
import { SoundProvider } from "@/components/sound-provider"
import { categories, categoryIds } from "@/content/components"
import { cssAnimTips } from "@/content/css-anim-tips"
import { componentSources } from "@/content/sources"

const cssAnimSources = Object.fromEntries(
  cssAnimTips.map((tip) => [
    tip.id,
    `/* ${tip.label} */\n${tip.css}\n\n${tip.html}`,
  ])
) as Record<string, string>

function panelCode(id: string, label: string, hint?: string) {
  return (
    componentSources[id] ??
    cssAnimSources[id] ??
    (hint ? `// ${label} · ${hint}` : `// ${label}`)
  )
}

const demos: Record<string, React.ComponentType> = {
  "magnetic-button": MagneticButtonDemo,
  "hover-reveal": HoverRevealDemo,
  "continuous-slider": InfiniteSliderDemo,
  "cursor-spotlight": CursorSpotlightDemo,
  "number-counter": NumberCounterDemo,
  toggle: ToggleDemo,
  "checkbox-ink": CheckboxInkDemo,
  "checkbox-seal": CheckboxSealDemo,
  "checkbox-bloom": CheckboxBloomDemo,
  "loading-indicator": LoadingIndicatorDemo,
  "card-tilt": CardTiltDemo,
  "tabs-pill": TabsPillDemo,
  "tabs-underline": TabsUnderlineDemo,
  "compare-reveal": CompareRevealDemo,
  "circular-progress": CircularProgressDemo,
  "hover-border": HoverBorderDemo,
  "cool-scrollbar": CoolScrollbarDemo,
  "reading-notebook": ReadingNotebookDemo,
  "click-shockwave": ClickShockwaveDemo,
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
      <CoolScrollbar />

      <main className="mx-auto min-h-screen max-w-[1680px] px-4 pt-28 pb-20 md:pl-52 md:pr-16 md:pt-10">
        <div id="top" className="sr-only">
          naisu
        </div>

        <div className="flex flex-col gap-12">
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
