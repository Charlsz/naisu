"use client"

import * as React from "react"
import Image from "next/image"

import { useSound } from "@/components/sound-provider"
import { components } from "@/content/components"
import { cn } from "@/lib/utils"

export function SideNav({ activeId }: { activeId?: string }) {
  const { muted, toggle } = useSound()

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
    <aside className="pointer-events-none fixed top-4 left-4 z-40 flex w-44 flex-col gap-4">
      <div className="pointer-events-auto flex items-center justify-between gap-2">
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
            {/* volume-up: flaticon/6996058 · volume-off: flaticon/7640162 */}
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
            {/* Icon: https://www.flaticon.com/free-icon/github_3128308 */}
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

      <nav
        aria-label="Components"
        className="pointer-events-auto max-h-[calc(100vh-5.5rem)] overflow-y-auto"
      >
        <ul className="flex flex-col gap-1">
          {components.map((item) => {
            const active = activeId === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
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
    </aside>
  )
}
