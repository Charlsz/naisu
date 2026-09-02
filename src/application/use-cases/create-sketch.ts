import type { BoardSize, SketchDocument, Stroke } from "@/domain/sketch/types"

export function createSketchDocument(input: {
  name?: string
  board?: BoardSize
  strokes?: Stroke[]
  seed?: number
}): SketchDocument {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: input.name ?? "Untitled",
    board: input.board ?? { w: 800, h: 600 },
    strokes: input.strokes ?? [],
    seed: input.seed ?? (Math.random() * 0xffffffff) >>> 0,
    createdAt: now,
    updatedAt: now,
  }
}

export function touchSketch(
  sketch: SketchDocument,
  patch: Partial<Pick<SketchDocument, "name" | "board" | "strokes" | "seed">>
): SketchDocument {
  return {
    ...sketch,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
}
