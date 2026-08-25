"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"

import { useSound } from "@/components/sound-provider"
import { categories } from "@/content/components"
import { springs } from "@/lib/motion"
import { smoothScrollTo } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

const PixelEarth = dynamic(() => import("@/components/pixel-earth"), {
  ssr: false,
  loading: () => (
    <div className="hidden size-[176px] shrink-0 md:block" aria-hidden />
  ),
})

const NAV_WIDTH_PX = 176

let scrollRaf = 0
const scrollRafRef = { current: 0 }

/** Scroll the page so `id` sits just under the sticky offset. */
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const rect = el.getBoundingClientRect()
  const absoluteTop = window.scrollY + rect.top
  const offset = Math.min(72, window.innerHeight * 0.08)
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
  const [canScrollUp, setCanScrollUp] = React.useState(false)
  const [canScrollDown, setCanScrollDown] = React.useState(false)
  const navigatingRef = React.useRef(false)

  const syncFades = React.useCallback(() => {
    const el = listRef.current
    if (!el) return
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = el
    const maxY = scrollHeight - clientHeight
    const maxX = scrollWidth - clientWidth
    setCanScrollUp(scrollTop > 1 || scrollLeft > 1)
    setCanScrollDown(
      (maxY > 1 && scrollTop < maxY - 1) || (maxX > 1 && scrollLeft < maxX - 1)
    )
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
        "fixed inset-x-0 top-0 bg-[#FDFDFC]/90 px-3 pt-3 pb-2 backdrop-blur-md",
        "md:inset-x-auto md:top-4 md:bottom-0 md:left-4 md:w-44 md:bg-transparent md:px-0 md:pt-0 md:pb-3 md:backdrop-blur-none"
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
          className="flex size-8 shrink-0 items-center justify-center active:scale-95"
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
            className="relative flex size-8 items-center justify-center overflow-hidden active:scale-95"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={muted ? "off" : "on"}
                initial={{ opacity: 0, scale: 0.7, rotate: muted ? -12 : 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotate: muted ? 12 : -12 }}
                transition={springs.snappy}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={muted ? "/volume-off.png" : "/volume-on.png"}
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 object-contain"
                />
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href="https://github.com/Charlsz/naisu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex size-8 items-center justify-center active:scale-95"
          >
            <Image
              src="/github.png"
              alt=""
              width={16}
              height={16}
              className="size-4 object-contain"
            />
          </a>
          <Link
            href="/playground"
            aria-label="Playground"
            className="flex size-8 items-center justify-center text-[10px] font-medium text-[#667085] active:scale-95 hover:text-[#111111]"
          >
            play
          </Link>
        </div>
      </div>

      <div className="pointer-events-auto relative min-h-0 md:flex-1">
        <nav
          ref={listRef}
          aria-label="Components"
          className={cn(
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "overflow-x-auto overflow-y-hidden",
            "md:h-full md:overflow-x-hidden md:overflow-y-auto"
          )}
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
                      "relative flex h-8 items-center gap-2 rounded-lg px-2 text-left text-[11px] leading-tight transition-colors active:scale-[0.98]",
                      "w-auto md:w-full",
                      active
                        ? "font-medium text-[#FDFDFC]"
                        : "font-normal text-[#111111] hover:bg-[#111111]/8"
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId={`naisu-nav-active-${navHighlightId}`}
                        transition={springs.snappy}
                        className="absolute inset-0 rounded-lg bg-[#111111]"
                      />
                    ) : null}
                    <span className="relative w-4 shrink-0 tabular-nums opacity-70">
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
            "pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#FDFDFC] to-transparent transition-opacity duration-200 md:inset-x-0 md:top-0 md:bottom-auto md:h-0.5 md:w-auto md:bg-white md:bg-none md:blur-[2px]",
            canScrollUp ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#FDFDFC] to-transparent transition-opacity duration-200 md:inset-x-0 md:top-auto md:bottom-0 md:h-0.5 md:w-auto md:bg-white md:bg-none md:blur-[2px]",
            canScrollDown ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div
        className="pointer-events-auto mt-auto hidden shrink-0 md:block"
        aria-label="Pixel earth"
      >
        <PixelEarth size={NAV_WIDTH_PX} />
      </div>
    </aside>
  )
}
