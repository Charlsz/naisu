import type { DrawingSurfaceHandle } from "@/application/ports/drawing-surface"
import type { BoardSize, SketchDocument, Stroke } from "@/domain/sketch/types"
import { createSketchDocument } from "@/application/use-cases/create-sketch"

/**
 * Vendor-free surface for tests and early UI.
 * Swap for Drawesome via composition without changing use-cases.
 */
export function createMemoryDrawingHandle(
  initial?: Partial<SketchDocument>
): DrawingSurfaceHandle {
  let sketch = createSketchDocument(initial ?? {})

  return {
    getStrokes: () => sketch.strokes,
    setStrokes: (strokes: Stroke[]) => {
      sketch = { ...sketch, strokes, updatedAt: new Date().toISOString() }
    },
    getSize: (): BoardSize => sketch.board,
    toSvg: () => strokesToSvg(sketch.strokes, sketch.board),
    clear: () => {
      sketch = { ...sketch, strokes: [], updatedAt: new Date().toISOString() }
    },
  }
}

export const memoryDrawingSurface = {
  id: "memory",
  createHandle: createMemoryDrawingHandle,
}

function strokesToSvg(strokes: Stroke[], board: BoardSize): string {
  const paths = strokes
    .filter((s) => !s.erased && s.points.length > 0)
    .map((s) => {
      const d = s.points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ")
      return `<path d="${d}" fill="none" stroke="${escapeXml(s.color)}" stroke-width="${s.size}" stroke-linecap="round" stroke-linejoin="round" opacity="${s.opacity}" />`
    })
    .join("")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${board.w} ${board.h}" width="${board.w}" height="${board.h}">${paths}</svg>`
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
