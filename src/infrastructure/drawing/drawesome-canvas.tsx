"use client"

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react"
import {
  Draw,
  type DrawHandle,
  type Stroke as DrawesomeStroke,
} from "drawesome"
import "drawesome/styles.css"

import type { DrawingSurfaceHandle } from "@/application/ports/drawing-surface"
import type { Stroke } from "@/domain/sketch/types"
import {
  DRAWESOME_ALL_TOOLS,
  toDomainStrokes,
  toDrawesomeStrokes,
} from "@/infrastructure/drawing/drawesome-mapper"

export type DrawesomeCanvasProps = {
  className?: string
  style?: CSSProperties
  background?: string
  onStrokesChange?: (strokes: Stroke[]) => void
}

/**
 * Drawesome lives only in infrastructure.
 * Presentation mounts this and talks via DrawingSurfaceHandle / callbacks.
 */
export const DrawesomeCanvas = forwardRef<
  DrawingSurfaceHandle,
  DrawesomeCanvasProps
>(function DrawesomeCanvas(
  {
    className,
    style,
    background = "transparent",
    onStrokesChange,
  },
  ref
) {
  const drawRef = useRef<DrawHandle>(null)

  useImperativeHandle(
    ref,
    (): DrawingSurfaceHandle => ({
      getStrokes: () => toDomainStrokes(drawRef.current?.getStrokes() ?? []),
      setStrokes: (strokes: Stroke[]) => {
        drawRef.current?.setStrokes(toDrawesomeStrokes(strokes))
      },
      getSize: () => drawRef.current?.getSize() ?? { w: 800, h: 600 },
      toSvg: () => drawRef.current?.toSvg() ?? "",
      toPng: (scale) => {
        if (!drawRef.current) {
          return Promise.reject(new Error("Drawing surface not ready"))
        }
        return drawRef.current.toPng(scale)
      },
      undo: () => drawRef.current?.undo(),
      redo: () => drawRef.current?.redo(),
      clear: () => drawRef.current?.clear(),
    }),
    []
  )

  return (
    <div
      className={className}
      style={{
        position: "relative",
        height: "100%",
        minHeight: 480,
        width: "100%",
        ...style,
      }}
    >
      <Draw
        ref={drawRef}
        background={background}
        tools={DRAWESOME_ALL_TOOLS}
        eraser
        theme="light"
        look="studio"
        depth="soft"
        placement="bottom"
        align="center"
        inset={16}
        drawWhenMinimized
        style={{ height: "100%", width: "100%", minHeight: 480 }}
        onChange={(strokes: DrawesomeStroke[]) => {
          onStrokesChange?.(toDomainStrokes(strokes))
        }}
      />
    </div>
  )
})
