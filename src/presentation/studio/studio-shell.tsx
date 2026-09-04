"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState, useTransition } from "react"

import type { DrawingSurfaceHandle } from "@/application/ports/drawing-surface"
import { exportComponent } from "@/application/use-cases/export-component"
import {
  createSketchDocument,
  touchSketch,
} from "@/application/use-cases/create-sketch"
import { polishSketch } from "@/application/use-cases/polish-sketch"
import { FlowButton } from "@/components/ui/flow-button"
import type { DrawnComponent } from "@/domain/component/types"
import type { SketchDocument, Stroke } from "@/domain/sketch/types"
import { stampStrokeTiming } from "@/domain/sketch/timing"
import { container } from "@/infrastructure/composition/container"
import { DrawesomeCanvas } from "@/infrastructure/drawing/drawesome-canvas"
import { ComponentPreviewPanel } from "@/presentation/studio/component-preview-panel"

/**
 * Studio talks to use-cases + infrastructure canvas adapter.
 * Vendor packages stay behind the adapter.
 */
export function StudioShell() {
  const surfaceRef = useRef<DrawingSurfaceHandle>(null)
  const hideCopiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sketchOriginMs = useRef<number | null>(null)
  const trackedStrokesRef = useRef<Stroke[]>([])
  const [sketch, setSketch] = useState<SketchDocument>(() =>
    createSketchDocument({ board: { w: 800, h: 560 } })
  )
  const [component, setComponent] = useState<DrawnComponent | null>(null)
  const [showCopied, setShowCopied] = useState(false)
  const [copiedLabel, setCopiedLabel] = useState("Copied!")
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    return () => {
      if (hideCopiedTimer.current) clearTimeout(hideCopiedTimer.current)
    }
  }, [])

  function trackStrokes(strokes: Stroke[]): Stroke[] {
    const ink = strokes.filter((s) => !s.erased)
    if (ink.length === 0) {
      sketchOriginMs.current = null
      trackedStrokesRef.current = strokes
      return strokes
    }

    const now = performance.now()
    if (sketchOriginMs.current == null) {
      sketchOriginMs.current = now
    }

    const tracked = stampStrokeTiming(
      trackedStrokesRef.current,
      strokes,
      now,
      sketchOriginMs.current
    )
    trackedStrokesRef.current = tracked
    return tracked
  }

  function onStrokesChange(strokes: Stroke[]) {
    const tracked = trackStrokes(strokes)
    const size = surfaceRef.current?.getSize()
    setSketch((current) =>
      touchSketch(current, {
        strokes: tracked,
        board: size ?? current.board,
      })
    )
    setComponent((current) => {
      if (!current?.polished) return null
      const sameIds =
        current.sketch.strokes.length === tracked.length &&
        current.sketch.strokes.every((s, i) => s.id === tracked[i]?.id)
      if (!sameIds) return null
      return {
        ...current,
        sketch: touchSketch(current.sketch, {
          strokes: tracked,
          board: size ?? current.sketch.board,
        }),
      }
    })
  }

  function onPolish() {
    if (sketch.strokes.length === 0) return
    startTransition(() => {
      const liveStrokes = trackStrokes(
        surfaceRef.current?.getStrokes() ?? sketch.strokes
      )
      const size = surfaceRef.current?.getSize() ?? sketch.board
      const base = touchSketch(sketch, { strokes: liveStrokes, board: size })
      const result = polishSketch(container.polisher, base, {
        amount: 0.88,
        pulse: 2.4,
      })
      setComponent(result)
      setSketch(result.sketch)
      trackedStrokesRef.current = result.sketch.strokes
      surfaceRef.current?.setStrokes(result.sketch.strokes)
    })
  }

  async function onCopy(format: "react-svg" | "react-svg-animated") {
    if (sketch.strokes.length === 0) return
    const liveStrokes = trackStrokes(
      surfaceRef.current?.getStrokes() ?? sketch.strokes
    )
    const size = surfaceRef.current?.getSize() ?? sketch.board
    const liveSketch = touchSketch(sketch, {
      strokes: liveStrokes,
      board: size,
    })
    const drawn: DrawnComponent = component
      ? { ...component, sketch: liveSketch }
      : {
          sketch: liveSketch,
          polished: false,
        }

    try {
      await exportComponent(container.exporter, drawn, format, {
        copy: true,
      })
      if (hideCopiedTimer.current) clearTimeout(hideCopiedTimer.current)
      setCopiedLabel(
        format === "react-svg-animated" ? "Animation copied!" : "Copied!"
      )
      setShowCopied(true)
      hideCopiedTimer.current = setTimeout(() => setShowCopied(false), 1400)
    } catch {
      // Clipboard may be blocked; stay quiet in the UI.
    }
  }

  const hasInk = sketch.strokes.some((s) => !s.erased)

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex items-center gap-4">
        <Image
          src="/naisu.png"
          alt="Naisu"
          width={48}
          height={48}
          priority
          className="size-12 shrink-0 rounded-xl object-cover"
        />
        <h1 className="text-3xl font-medium tracking-tight text-foreground">
          Draw a component. Make it nice.
        </h1>
      </header>

      <div
        className="relative h-[min(70vh,560px)] overflow-hidden rounded-xl border border-foreground/10"
        style={{
          backgroundImage:
            "linear-gradient(#ecece8 1px, transparent 1px), linear-gradient(90deg, #ecece8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundColor: "#f7f7f4",
        }}
      >
        <DrawesomeCanvas
          ref={surfaceRef}
          className="absolute inset-0 h-full w-full"
          onStrokesChange={onStrokesChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FlowButton
          type="button"
          onClick={onPolish}
          disabled={pending || !hasInk}
          borderColor="#fdfdfc"
          className="bg-foreground text-background hover:bg-foreground/90 hover:text-background"
        >
          Polish lines
        </FlowButton>
        <FlowButton
          type="button"
          onClick={() => onCopy("react-svg")}
          disabled={!hasInk}
          borderColor="#111111"
        >
          Copy component
        </FlowButton>
        <FlowButton
          type="button"
          onClick={() => onCopy("react-svg-animated")}
          disabled={!hasInk}
          borderColor="#111111"
        >
          Copy animation component
        </FlowButton>
      </div>

      <ComponentPreviewPanel />

      <AnimatePresence>
        {showCopied ? (
          <motion.div
            key="copied"
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{
              type: "tween",
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <span className="rounded-full bg-foreground px-4 py-2 text-sm font-[550] text-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              {copiedLabel}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
