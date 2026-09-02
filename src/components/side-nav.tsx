"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "motion/react"

import { useSound } from "@/components/sound-provider"
import { categories } from "@/content/components"
import { springs } from "@/lib/motion"
import { smoothScrollTo } from "@/lib/smooth-scroll"
import { cn, focusRing } from "@/lib/utils"

let scrollRaf = 0
const scrollRafRef = { current: 0 }

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const rect = el.getBoundingClientRect()
  const absoluteTop = window.scrollY + rect.top
  const offset = Math.min(88, window.innerHeight * 0.1)
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  )
  const top = Math.min(Math.max(0, absoluteTop - offset), maxScroll)

  scrollRafRef.current = scrollRaf
  smoothScrollTo({
    from: window.scrollY,
    to: top,
    duration: 420,
    apply: (y) => window.scrollTo(0, y),
    rafRef: scrollRafRef,
  })
  scrollRaf = scrollRafRef.current
}

export function SideNav({ activeId }: { activeId?: string }) {
  const { muted, toggle } = useSound()
  const navHighlightId = React.useId()
  const listRef = React.useRef<HTMLElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const navigatingRef = React.useRef(false)

  const syncFades = React.useCallback(() => {
    const el = listRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxX = scrollWidth - clientWidth
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(maxX > 1 && scrollLeft < maxX - 1)
  }, [])

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return

    syncFades()
    el.addEventListener("scroll", syncFades, { passive: true })
    const ro = new ResizeObserver(syncFades)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)

    return () => {
      el.removeEventListener("scroll", syncFades)
      ro.disconnect()
    }
  }, [syncFades])

  React.useEffect(() => {
    if (!activeId || !listRef.current || navigatingRef.current) return
    const btn = listRef.current.querySelector<HTMLElement>(
      `[data-nav-id="${activeId}"]`
    )
    btn?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    })
  }, [activeId])

  function scrollTo(id: string) {
    navigatingRef.current = true
    window.setTimeout(() => {
      navigatingRef.current = false
    }, 480)
    scrollToSection(id)
  }

  return (
    <aside
      data-side-nav
      className={cn(
        "pointer-events-none z-40 flex flex-col gap-3",
        "fixed inset-x-0 top-0 border-b border-border bg-background px-4 pt-3 pb-3",
        "md:inset-x-auto md:top-4 md:bottom-4 md:left-4 md:w-44 md:border-0 md:bg-transparent md:px-0 md:pt-0 md:pb-0"
      )}
    >
      <div className="pointer-events-auto flex shrink-0 items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Naisu top"
          onClick={() =>
            smoothScrollTo({
              from: window.scrollY,
              to: 0,
              duration: 380,
              apply: (y) => window.scrollTo(0, y),
              rafRef: scrollRafRef,
            })
          }
          className={cn("flex size-11 shrink-0 items-center justify-center", focusRing)}
        >
          <Image
            src="/naisu.png"
            alt=""
            width={32}
            height={32}
            className="size-8 object-contain"
            priority
          />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            aria-pressed={muted}
            onClick={toggle}
            className={cn(
              "relative flex size-11 items-center justify-center overflow-hidden",
              focusRing
            )}
          >
            <Image
              src={muted ? "/volume-off.png" : "/volume-on.png"}
              alt=""
              width={16}
              height={16}
              className="size-4 object-contain"
            />
          </button>

          <a
            href="https://github.com/Charlsz/naisu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={cn(
              "flex size-11 items-center justify-center",
              focusRing
            )}
          >
            <Image
              src="/github.png"
              alt=""
              width={16}
              height={16}
              className="size-4 object-contain"
            />
          </a>
        </div>
      </div>

      <div className="pointer-events-auto relative min-h-0 md:flex-1">
        <nav
          ref={listRef}
          aria-label="Components"
          className="overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto"
        >
          <ul className="flex flex-row gap-1 md:flex-col">
            {categories.map((cat, i) => {
              const index = String(i + 1).padStart(2, "0")
              const active = activeId === cat.id
              return (
                <li key={cat.id} className="shrink-0">
                  <button
                    type="button"
                    data-nav-id={cat.id}
                    onClick={() => scrollTo(cat.id)}
                    className={cn(
                      "relative flex h-11 min-w-[44px] items-center gap-2 rounded-lg px-3 text-left text-[13px] leading-tight transition-colors",
                      "w-auto md:w-full",
                      active
                        ? "font-medium text-primary-foreground"
                        : "font-normal text-foreground hover:bg-muted",
                      focusRing
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId={`naisu-nav-active-${navHighlightId}`}
                        transition={springs.snappy}
                        className="absolute inset-0 rounded-lg bg-primary"
                      />
                    ) : null}
                    <span className="relative w-5 shrink-0 tabular-nums text-muted-foreground">
                      {index}
                    </span>
                    <span className="relative truncate whitespace-nowrap">
                      {cat.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent transition-opacity duration-200 md:hidden",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 md:hidden",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </aside>
  )
}
