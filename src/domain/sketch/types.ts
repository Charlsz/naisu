/**
 * Vendor-agnostic drawing primitives.
 * Adapters (Drawesome, custom canvas, etc.) map into these types.
 */

export type Point = {
  x: number
  y: number
  /** Pressure 0–1 when available; omit if the surface does not report it. */
  pressure?: number
  /** Timestamp in ms relative to stroke start (optional). */
  t?: number
}

export type PenKind =
  | "pencil"
  | "pen"
  | "marker"
  | "fineliner"
  | "highlighter"
  | "brush"
  | "fountain"
  | "eraser"
  | "unknown"

export type Stroke = {
  id: string
  points: Point[]
  color: string
  size: number
  opacity: number
  pen: PenKind
  /** Soft delete / erase residue — exporters may skip these. */
  erased?: boolean
  /** When this stroke began, ms after the first ink on the board. */
  startedAt?: number
  /** How long the gesture lasted (ms). Used for draw-self animation. */
  durationMs?: number
}

export type BoardSize = {
  w: number
  h: number
}

export type SketchDocument = {
  id: string
  name: string
  board: BoardSize
  strokes: Stroke[]
  /** Seed used for reproducible polish / rough variants. */
  seed: number
  createdAt: string
  updatedAt: string
}

export type PolishOptions = {
  /** 0 = raw strokes, 1 = heavily smoothed. Keeps a “human pulse” below ~0.85. */
  amount?: number
  /** Extra wobble after smoothing (px). Higher = more hand-drawn. */
  pulse?: number
  /** Deterministic randomness for polish. */
  seed?: number
}
