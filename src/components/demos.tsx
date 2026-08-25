"use client"

import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import {
  Info as InfoIcon,
  Search as SearchIcon,
  X as XIcon,
} from "lucide-react"

import { CompareReveal } from "@/components/motiq/compare-reveal"
import { CursorSpotlight } from "@/components/naisu/cursor-spotlight"
import { HoverBorder } from "@/components/naisu/hover-border"
import { CoolScrollbar } from "@/components/naisu/cool-scrollbar"
import { ReadingNotebook, LOREM_PARAGRAPHS } from "@/components/naisu/reading-notebook"
import { ClickShockwave } from "@/components/ui/click-shockwave"
import { ContinuousSlider } from "@/components/ui/continuous-slider"
import { springs } from "@/lib/motion"
import { cn } from "@/lib/utils"

function usePointer(ref: React.RefObject<HTMLElement | null>) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x.set(e.clientX - r.left - r.width / 2)
      y.set(e.clientY - r.top - r.height / 2)
    }
    const leave = () => {
      x.set(0)
      y.set(0)
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
    }
  }, [ref, x, y])

  return { x, y }
}

function useCycle(length: number, ms: number) {
  const [i, setI] = React.useState(0)
  React.useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % length), ms)
    return () => window.clearInterval(t)
  }, [length, ms])
  return i
}

/** 01 */
export function MagneticButtonDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  const { x, y } = usePointer(ref)
  const sx = useSpring(x, springs.soft)
  const sy = useSpring(y, springs.soft)
  const tx = useTransform(sx, (v) => v * 0.28)
  const ty = useTransform(sy, (v) => v * 0.28)

  return (
    <div ref={ref} className="flex size-full items-center justify-center">
      <motion.button
        type="button"
        style={{ x: tx, y: ty }}
        className="rounded-full bg-[#111111] px-4 py-2 text-xs font-medium text-[#FDFDFC]"
        whileTap={{ scale: 0.96 }}
      >
        Magnetic
      </motion.button>
    </div>
  )
}

/** 02 */
export function HoverRevealDemo() {
  return (
    <motion.div
      className="relative flex size-full items-center justify-center overflow-hidden"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.div
        variants={{
          rest: { scale: 1, opacity: 1 },
          hover: { scale: 0.55, opacity: 0.3 },
        }}
        transition={springs.snappy}
        className="size-14 rounded-2xl bg-[#111111]"
      />
      <motion.p
        variants={{
          rest: { opacity: 0, y: 10 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={springs.smooth}
        className="absolute inset-x-4 bottom-4 text-center text-[11px] text-[#111111]"
      >
        Revealed
      </motion.p>
    </motion.div>
  )
}

/** Soft vignette spotlight that follows the pointer. */
export function CursorSpotlightDemo() {
  return (
    <div className="size-full min-h-0 p-2">
      <CursorSpotlight className="size-full rounded-xl" />
    </div>
  )
}

/** 04 - counts forever; resets only on remount / reload */
export function NumberCounterDemo() {
  const [n, setN] = React.useState(1)

  React.useEffect(() => {
    const t = window.setInterval(() => setN((v) => v + 1), 900)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="flex size-full items-center justify-center">
      <div className="relative h-10 w-16 overflow-hidden text-2xl font-semibold tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={n}
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={springs.snappy}
            className="absolute inset-0 flex items-center justify-center"
          >
            {String(n).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** 05 Toggle - press only */
export function ToggleDemo() {
  const [on, setOn] = React.useState(false)

  return (
    <div className="flex size-full items-center justify-center">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "flex h-8 w-14 items-center rounded-full p-1 transition-colors",
          on ? "bg-[#111111]" : "bg-[#9C9C9B]"
        )}
      >
        <motion.span
          className="size-6 rounded-full bg-[#FDFDFC] shadow-sm"
          animate={{ x: on ? 24 : 0 }}
          transition={springs.snappy}
        />
      </button>
    </div>
  )
}

/** 06a - Ink stroke (ma / brush feel) */
export function CheckboxInkDemo() {
  const [checked, setChecked] = React.useState(false)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => setChecked((v) => !v)}
        className="flex size-12 items-center justify-center rounded-xl border-[3px] border-[#111111] bg-[#FDFDFC] p-2 transition-transform active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="size-full" fill="none">
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="#111111"
            strokeWidth="3.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ ...springs.smooth, opacity: { duration: 0.12 } }}
          />
        </svg>
      </button>
    </div>
  )
}

/** 06b - Seal / hanko press */
export function CheckboxSealDemo() {
  const [checked, setChecked] = React.useState(false)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => setChecked((v) => !v)}
        className="relative flex size-12 items-center justify-center rounded-full border-[3px] border-[#111111] bg-[#FDFDFC] transition-transform active:scale-95"
      >
        <motion.span
          className="absolute inset-1 rounded-full bg-[#111111]"
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={springs.snappy}
        />
        <motion.span
          className="relative z-10 font-serif text-sm text-[#FDFDFC]"
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          OK
        </motion.span>
      </button>
    </div>
  )
}

/** 06c - Bloom fill from corner */
export function CheckboxBloomDemo() {
  const [checked, setChecked] = React.useState(false)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => setChecked((v) => !v)}
        className="relative size-12 overflow-hidden rounded-xl border-[3px] border-[#111111] bg-[#FDFDFC] transition-transform active:scale-95"
      >
        <motion.span
          className="absolute -bottom-2 -left-2 size-16 rounded-full bg-[#111111]"
          initial={false}
          animate={{ scale: checked ? 1.35 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        />
        <svg
          viewBox="0 0 24 24"
          className="relative z-10 size-full p-2"
          fill="none"
        >
          <motion.path
            d="M6 12.5l4 4 8-9"
            stroke={checked ? "#FDFDFC" : "transparent"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ delay: checked ? 0.08 : 0, duration: 0.28 }}
          />
        </svg>
      </button>
    </div>
  )
}

/** 07 */
export function LoadingIndicatorDemo() {
  return (
    <div className="flex size-full items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-[#111111]"
          animate={{ y: [0, -7, 0], opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: 0.65,
            repeat: Infinity,
            delay: i * 0.11,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/** 08 Progress - slower; margins inside grid; % follows tip */
export function ProgressIndicatorDemo() {
  const [p, setP] = React.useState(8)

  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const cycle = 7200
    const tick = (now: number) => {
      const t = ((now - start) % cycle) / cycle
      const wave = t < 0.5 ? t * 2 : 1 - (t - 0.5) * 2
      const eased = wave * wave * (3 - 2 * wave)
      setP(Math.round(8 + eased * 84))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="flex size-full items-center justify-center px-8 py-8">
      <div className="relative h-8 w-full max-w-full">
        <div
          className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-[#111111]"
          style={{ width: `min(${p}%, calc(100% - 40px))` }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 text-[11px] font-medium tabular-nums text-[#111111]"
          style={{ left: `calc(min(${p}%, calc(100% - 40px)) + 8px)` }}
        >
          {p}%
        </span>
      </div>
    </div>
  )
}

/** 09 Expanding search - real-ish demo, centered icon, thick border */
const SEARCH_ITEMS = [
  "Magnetic button",
  "Hover reveal",
  "Number counter",
  "Animated tabs",
  "Cool scrollbar",
  "Morphing icon",
]

export function ExpandingSearchDemo() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = SEARCH_ITEMS.filter((item) =>
    item.toLowerCase().includes(query.trim().toLowerCase())
  ).slice(0, 4)

  React.useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function close() {
    setOpen(false)
    setQuery("")
  }

  return (
    <div className="relative flex size-full items-center justify-center p-8">
      <div className="relative">
        <motion.div
          className="relative flex h-10 items-center overflow-hidden rounded-full border-[3px] border-[#111111] bg-[#FDFDFC]"
          animate={{ width: open ? 220 : 40 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <button
            type="button"
            aria-label={open ? "Focus search" : "Open search"}
            className="absolute top-0 left-0 z-10 flex size-10 items-center justify-center"
            onClick={() => {
              if (!open) setOpen(true)
              else inputRef.current?.focus()
            }}
          >
            <SearchIcon className="size-4 text-[#111111]" strokeWidth={2.5} />
          </button>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close()
            }}
            placeholder="Search components…"
            className={cn(
              "h-full w-full bg-transparent pr-8 pl-10 text-xs text-[#111111] outline-none placeholder:text-[#9C9C9B]",
              !open && "pointer-events-none opacity-0"
            )}
          />

          {open && query ? (
            <button
              type="button"
              aria-label="Clear"
              className="absolute top-0 right-0 flex size-10 items-center justify-center text-[#9C9C9B] hover:text-[#111111]"
              onClick={() => setQuery("")}
            >
              <XIcon className="size-3.5" strokeWidth={2.5} />
            </button>
          ) : null}
        </motion.div>

        <AnimatePresence>
          {open && query.trim() && (
            <motion.ul
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={springs.snappy}
              className="absolute top-12 left-0 z-20 w-[220px] overflow-hidden rounded-2xl border-[3px] border-[#111111] bg-[#FDFDFC]"
            >
              {results.length === 0 ? (
                <li className="px-4 py-2 text-[11px] text-[#9C9C9B]">
                  No matches
                </li>
              ) : (
                results.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-[11px] text-[#111111] transition-colors hover:bg-[#111111]/5"
                      onClick={() => {
                        setQuery(item)
                        close()
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** 10a - drops in from above the trigger */
export function TooltipDropDemo() {
  const [show, setShow] = React.useState(false)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <div className="relative flex flex-col items-center">
        <div className="relative mb-2 h-8 w-full">
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg bg-[#111111] px-2 py-1 text-[10px] whitespace-nowrap text-[#FDFDFC]"
              >
                Shortcut hint
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          className="rounded-full border-[3px] border-[#111111] bg-[#FDFDFC] p-2 transition-transform active:scale-95"
          onPointerEnter={() => setShow(true)}
          onPointerLeave={() => setShow(false)}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
        >
          <InfoIcon className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

/** 10b - soft spring from top with caret */
export function TooltipSoftDemo() {
  const [show, setShow] = React.useState(false)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <div className="relative flex flex-col items-center">
        <div className="relative mb-2 h-10 w-full">
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={springs.soft}
                className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center"
              >
                <span className="rounded-xl bg-[#111111] px-3 py-1.5 text-[10px] whitespace-nowrap text-[#FDFDFC]">
                  Soft tip
                </span>
                <span className="mt-[-1px] size-2 rotate-45 bg-[#111111]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          className="rounded-full border-[3px] border-[#111111] bg-[#FDFDFC] p-2 transition-transform active:scale-95"
          onPointerEnter={() => setShow(true)}
          onPointerLeave={() => setShow(false)}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
        >
          <InfoIcon className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

/** 09 Morph carousel - slower morph + index updates when shape lands */
export function CardTiltDemo() {
  // Circle radius = half the side (28 for 56×56), not 999 - interpolates cleanly
  const frames = [
    { r: 8, w: 72, h: 48 },
    { r: 28, w: 56, h: 56 },
    { r: 16, w: 96, h: 40 },
    { r: 4, w: 64, h: 64 },
  ]
  const [i, setI] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let frame = 0
    let waitTimer = 0

    async function loop() {
      while (!cancelled && el) {
        const next = (frame + 1) % frames.length
        const target = frames[next]
        // Advance the indicator as soon as this shape is the target
        setI(next)
        const controls = animate(
          el,
          {
            width: `${target.w}px`,
            height: `${target.h}px`,
            borderRadius: `${target.r}px`,
          },
          { duration: 1.35, ease: [0.22, 1, 0.36, 1] }
        )
        await controls
        if (cancelled) break
        frame = next
        await new Promise<void>((resolve) => {
          waitTimer = window.setTimeout(resolve, 900)
        })
      }
    }

    void loop()
    return () => {
      cancelled = true
      window.clearTimeout(waitTimer)
    }
  }, [])

  return (
    <div className="flex size-full items-center justify-center gap-4 p-8">
      <div
        ref={ref}
        className="bg-[#111111] will-change-[width,height,border-radius]"
        style={{
          width: frames[0].w,
          height: frames[0].h,
          borderRadius: frames[0].r,
        }}
      />
      <div className="flex flex-col gap-1">
        {frames.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1 w-4 rounded-full transition-colors duration-300",
              idx === i ? "bg-[#111111]" : "bg-[#9C9C9B]/50"
            )}
          />
        ))}
      </div>
    </div>
  )
}

/** 12 Morphing icon - path morph play ↔ pause */
export function MorphingIconDemo() {
  const [play, setPlay] = React.useState(true)

  // Shared control points so the glyph feels like one shape reshaping
  const playD =
    "M8.5 6.2c0-.9 1-1.5 1.8-1L18 11.2c.7.4.7 1.4 0 1.8L10.3 18.8c-.8.5-1.8-.1-1.8-1V6.2Z"
  const pauseD =
    "M7.2 5.5c0-.3.3-.5.6-.5h2.4c.3 0 .6.2.6.5v13c0 .3-.3.5-.6.5H7.8c-.3 0-.6-.2-.6-.5v-13Zm6 0c0-.3.3-.5.6-.5h2.4c.3 0 .6.2.6.5v13c0 .3-.3.5-.6.5h-2.4c-.3 0-.6-.2-.6-.5v-13Z"

  return (
    <div className="flex size-full items-center justify-center p-8">
      <button
        type="button"
        aria-label={play ? "Pause" : "Play"}
        onClick={() => setPlay((v) => !v)}
        className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#111111] bg-[#FDFDFC] text-[#111111] transition-transform active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
          <motion.path
            initial={false}
            animate={{ d: play ? playD : pauseD }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </button>
    </div>
  )
}

/** 13a Pill tabs */
export function TabsPillDemo() {
  const tabs = ["Overview", "Details", "Activity"]
  const [active, setActive] = React.useState(0)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <div className="flex gap-1 rounded-xl bg-[#FDFDFC] p-1">
        {tabs.map((t, idx) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(idx)}
            className={cn(
              "relative z-10 h-8 px-4 text-[11px] leading-tight transition-colors",
              active === idx ? "text-[#FDFDFC]" : "text-[#9C9C9B]"
            )}
          >
            {active === idx && (
              <motion.span
                layoutId="tabs-pill-solo"
                className="absolute inset-0 -z-10 rounded-lg bg-[#111111]"
                transition={springs.snappy}
              />
            )}
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

/** 13b Underline tabs */
export function TabsUnderlineDemo() {
  const tabs = ["Overview", "Details", "Activity"]
  const [active, setActive] = React.useState(0)

  return (
    <div className="flex size-full items-center justify-center p-8">
      <div className="relative flex gap-8">
        {tabs.map((t, idx) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(idx)}
            className={cn(
              "relative pb-2 text-[11px]",
              active === idx ? "text-[#111111]" : "text-[#9C9C9B]"
            )}
          >
            {t}
            {active === idx && (
              <motion.span
                layoutId="tabs-underline-solo"
                className="absolute inset-x-0 bottom-0 h-[3px] bg-[#111111]"
                transition={springs.snappy}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Continuous slider - full stage width */
const SLIDER_ITEMS = [
  { id: "apple", name: "Apple" },
  { id: "google", name: "Google" },
  { id: "stripe", name: "Stripe" },
  { id: "nintendo", name: "Nintendo" },
  { id: "figma", name: "Figma" },
  { id: "linear", name: "Linear" },
  { id: "vercel", name: "Vercel" },
  { id: "notion", name: "Notion" },
]

export function InfiniteSliderDemo() {
  return (
    <div className="flex h-full w-full min-w-0 max-w-full items-center px-1 sm:px-3">
      <ContinuousSlider
        items={SLIDER_ITEMS}
        duration={42}
        hoverSlowdown={2.75}
        gap={56}
        fade
        className="w-full"
      />
    </div>
  )
}

/** 15 Click shockwave - expanding rings from pointer */
export function ClickShockwaveDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <ClickShockwave label="Click anywhere" className="min-h-[160px]" />
    </div>
  )
}

/** Compare reveal: same stage height as neighbors; media stays 16:10. */
export function CompareRevealDemo() {
  return (
    <div className="flex size-full min-h-0 w-full items-center justify-center">
      <CompareReveal
        className="max-h-full w-full rounded-lg"
        labels={["", ""]}
        aria-label="Compare color and roughness maps"
        before={{ src: "/texture_0.png", alt: "Earth color map" }}
        after={{ src: "/texture_1.png", alt: "Earth roughness map" }}
      />
    </div>
  )
}

/** 15 Circular progress + chat */
export function CircularProgressDemo() {
  const messages = ["Sending…", "Thinking…", "Done."]
  const i = useCycle(messages.length, 2200)
  const r = 16
  const c = 2 * Math.PI * r

  return (
    <div className="flex size-full items-center justify-center gap-4 px-8">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={r}
          stroke="#9C9C9B"
          strokeWidth="2.5"
          fill="none"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          stroke="#111111"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
          strokeDasharray={c}
          animate={{ strokeDashoffset: [c, 0, c] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <div className="flex w-28 flex-col gap-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={messages[i]}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg bg-[#FDFDFC] px-2 py-1.5 text-[10px] text-[#111111]"
          >
            {messages[i]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Hover border - animated stroke on the card itself */
export function HoverBorderDemo() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <HoverBorder label="Ship it" />
    </div>
  )
}

/** Cool scrollbar: plain text + rail. Copy source is cool-scrollbar.tsx. */
export function CoolScrollbarDemo() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const body = React.useMemo(
    () => [...LOREM_PARAGRAPHS, ...LOREM_PARAGRAPHS, ...LOREM_PARAGRAPHS],
    []
  )

  return (
    <div className="relative size-full min-h-0">
      <div
        ref={scrollerRef}
        className="naisu-demo-scroll absolute inset-0 overflow-y-auto py-2 pr-12 pl-1 sm:pr-14"
      >
        <div className="space-y-3 text-[11px] leading-relaxed text-[#344054]">
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
      <CoolScrollbar containerRef={scrollerRef} lines={26} />
    </div>
  )
}

/** Reading notebook: fake site chrome + article (no cool rail). */
export function ReadingNotebookDemo() {
  return (
    <div className="flex size-full min-h-0 items-stretch justify-center p-1.5 sm:p-2">
      <ReadingNotebook
        paragraphs={[...LOREM_PARAGRAPHS, ...LOREM_PARAGRAPHS]}
        className="h-full max-h-full w-full"
      />
    </div>
  )
}

