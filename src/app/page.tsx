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
  TabsPillDemo,
  TabsUnderlineDemo,
  ToggleDemo,
} from "@/components/demos"
import { CoolScrollbar } from "@/components/naisu/cool-scrollbar"
import { SideNav } from "@/components/side-nav"
import { SoundProvider } from "@/components/sound-provider"
import { components } from "@/content/components"
import { componentSources } from "@/content/sources"

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
  "click-shockwave": ClickShockwaveDemo,
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])

  React.useEffect(() => {
    function sync() {
      if (!ids.length) return

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      // Edge cases: pin first / last when you're at the page ends
      if (window.scrollY <= 8) {
        setActive(ids[0])
        return
      }
      if (maxScroll > 0 && window.scrollY >= maxScroll - 8) {
        setActive(ids[ids.length - 1])
        return
      }

      // Prefer the section whose top is nearest a line ~20% down the viewport
      const marker = window.innerHeight * 0.22
      let best = ids[0]
      let bestScore = Number.POSITIVE_INFINITY

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        // Sections that have crossed the marker score better
        const score =
          top <= marker ? marker - top : (top - marker) * 1.35
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
  const ids = components.map((c) => c.id)
  const activeId = useActiveSection(ids)

  return (
    <SoundProvider>
      <ClickFeedback />
      <SideNav activeId={activeId} />
      <CoolScrollbar />

      <main className="min-h-screen pr-8 pl-[11.5rem] pt-8 pb-16 sm:pl-52">
        <div id="top" className="sr-only">
          naisu
        </div>

        <div className="flex flex-col gap-8">
          {components.map((c) => {
            const panels = c.variants?.length
              ? c.variants.map((v) => {
                  const Demo = demos[v.id]
                  return {
                    id: v.id,
                    hint: v.hint,
                    code: componentSources[v.id] ?? `// ${c.label} — ${v.hint}`,
                    children: Demo ? <Demo /> : null,
                  }
                })
              : [
                  {
                    id: c.id,
                    code: componentSources[c.id] ?? `// ${c.label}`,
                    children: (() => {
                      const Demo = demos[c.id]
                      return Demo ? <Demo /> : null
                    })(),
                  },
                ]

            return (
              <ComponentCard
                key={c.id}
                id={c.id}
                index={c.index}
                title={c.label}
                panels={panels}
              />
            )
          })}
        </div>
      </main>
    </SoundProvider>
  )
}
