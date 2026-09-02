import type { BoardSize, SketchDocument, Stroke } from "@/domain/sketch/types"

/**
 * Capture surface for freehand input.
 * Drawesome (or tldraw / custom canvas) implements this — the app never imports them directly.
 */
export type DrawingSurfaceHandle = {
  getStrokes: () => Stroke[]
  setStrokes: (strokes: Stroke[]) => void
  getSize: () => BoardSize
  toSvg: () => string
  toPng?: (scale?: number) => Promise<Blob>
  undo?: () => void
  redo?: () => void
  clear: () => void
}

export type DrawingSurfacePort = {
  readonly id: string
  /**
   * Optional React mount target. Presentation passes a host element;
   * adapters that need a DOM node attach here.
   */
  mount?: (host: HTMLElement, initial?: Partial<SketchDocument>) => DrawingSurfaceHandle
  /** In-memory / headless surfaces can skip mount and expose a handle directly. */
  createHandle?: (initial?: Partial<SketchDocument>) => DrawingSurfaceHandle
}
