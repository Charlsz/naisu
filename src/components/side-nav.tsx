"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { useSound } from "@/components/sound-provider"
import { components } from "@/content/components"
import { cn } from "@/lib/utils"

const PixelEarth = dynamic(() => import("@/components/pixel-earth"), {
  ssr: false,
  loading: () => (
    <div className="size-[176px] shrink-0" aria-hidden />
  ),
})

/** Nav column width (w-44) — earth fills it exactly */
const NAV_WIDTH_PX = 176

export function SideNav({ activeId }: { activeId?: string }) {
  const { muted, toggle } = useSound()
  const listRef = React.useRef<HTMLElement>(null)
  const [canScrollUp, setCanScrollUp] = React.useState(false)
  const [canScrollDown, setCanScrollDown] = React.useState(false)

  const syncFades = React.useCallback(() => {
    const el = listRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const max = scrollHeight - clientHeight
    setCanScrollUp(scrollTop > 1)
    setCanScrollDown(max > 1 && scrollTop < max - 1)
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

  // Keep the active item visible in the nav list
  React.useEffect(() => {
    if (!activeId || !listRef.current) return
    const btn = listRef.current.querySelector<HTMLElement>(
      `[data-nav-id="${activeId}"]`
    )
    btn?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [activeId])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const absoluteTop = window.scrollY + rect.top
    const offset = Math.min(96, window.innerHeight * 0.12)
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    )
    const top = Math.min(Math.max(0, absoluteTop - offset), maxScroll)

    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <aside
      data-side-nav
      className="pointer-events-none fixed top-4 bottom-0 left-4 z-40 flex w-44 flex-col gap-4 pb-3"
    >
      <div className="pointer-events-auto flex shrink-0 items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Naisu — top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex size-8 shrink-0 items-center justify-center transition-transform active:scale-95"
        >
          <Image
            src="/naisu_white.png"
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
            className="flex size-8 items-center justify-center transition-opacity hover:opacity-70 active:scale-95"
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
            className="flex size-8 items-center justify-center transition-opacity hover:opacity-70 active:scale-95"
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

      <div className="pointer-events-auto relative min-h-0 flex-1">
        <nav
          ref={listRef}
          aria-label="Components"
          className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex flex-col gap-1">
            {components.map((item) => {
              const active = activeId === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    data-nav-id={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left text-[11px] leading-tight transition-transform transition-colors active:scale-[0.98]",
                      active
                        ? "bg-[#111111] font-medium text-[#FDFDFC]"
                        : "font-normal text-[#111111] hover:bg-[#111111]/8"
                    )}
                  >
                    <span className="w-4 shrink-0 tabular-nums opacity-70">
                      {item.index}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Soft white edge blur — only when more content sits that way */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-white blur-[2px] transition-opacity duration-200",
            canScrollUp ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-white blur-[2px] transition-opacity duration-200",
            canScrollDown ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div
        className="pointer-events-auto mt-auto shrink-0"
        aria-label="Pixel earth"
      >
        <PixelEarth size={NAV_WIDTH_PX} />
      </div>
    </aside>
  )
}
