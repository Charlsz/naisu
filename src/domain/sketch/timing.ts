/**
 * Stamp draw-order timing onto strokes as the user inks.
 * Drawesome does not report timestamps — we infer them from stroke diffs.
 */

import type { Point, Stroke } from "./types"

export function pathLength(points: Point[]): number {
  let len = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!
    const b = points[i]!
    len += Math.hypot(b.x - a.x, b.y - a.y)
  }
  return len
}

/**
 * Merge live surface strokes with previously tracked timing.
 * New marks get `startedAt`; growing marks get relative point `t` values.
 */
export function stampStrokeTiming(
  previous: Stroke[],
  next: Stroke[],
  nowMs: number,
  sketchOriginMs: number
): Stroke[] {
  const prevById = new Map(previous.map((s) => [s.id, s]))

  return next.map((stroke) => {
    const prior = prevById.get(stroke.id)
    const startedAt =
      prior?.startedAt ??
      stroke.startedAt ??
      Math.max(0, nowMs - sketchOriginMs)

    if (stroke.erased) {
      return {
        ...stroke,
        startedAt,
        durationMs: prior?.durationMs ?? stroke.durationMs ?? 0,
      }
    }

    const points = stampPointTimes(prior, stroke, nowMs, sketchOriginMs, startedAt)
    const lastT = points[points.length - 1]?.t
    const durationMs =
      lastT != null
        ? Math.max(lastT, prior?.durationMs ?? 0)
        : (prior?.durationMs ?? stroke.durationMs ?? estimateDuration(points))

    return {
      ...stroke,
      startedAt,
      durationMs,
      points,
    }
  })
}

function stampPointTimes(
  prior: Stroke | undefined,
  stroke: Stroke,
  nowMs: number,
  sketchOriginMs: number,
  startedAt: number
): Point[] {
  const priorCount = prior?.points.length ?? 0
  const elapsed = Math.max(0, nowMs - sketchOriginMs - startedAt)

  return stroke.points.map((point, index) => {
    if (point.t != null) return point
    const priorPoint = prior?.points[index]
    if (priorPoint?.t != null) return { ...point, t: priorPoint.t }
    // Brand-new tip of the stroke — stamp wall time relative to stroke start.
    if (index >= priorCount) return { ...point, t: elapsed }
    // Older points we somehow missed: spread evenly across known duration.
    const span = prior?.durationMs ?? elapsed
    const t =
      stroke.points.length <= 1
        ? 0
        : (span * index) / (stroke.points.length - 1)
    return { ...point, t }
  })
}

/** Fallback when we never saw live growth (e.g. setStrokes / polish). */
export function estimateDuration(points: Point[], pxPerMs = 0.45): number {
  const len = pathLength(points)
  return Math.max(180, Math.min(2400, len / pxPerMs))
}

/** Delay before a stroke starts animating, relative to the first ink. */
export function strokeAnimationDelay(stroke: Stroke, originStartedAt: number): number {
  return Math.max(0, (stroke.startedAt ?? 0) - originStartedAt)
}

export function strokeAnimationDuration(stroke: Stroke): number {
  if (stroke.durationMs != null && stroke.durationMs > 0) {
    return Math.max(120, stroke.durationMs)
  }
  return estimateDuration(stroke.points)
}

export function activeInkStrokes(strokes: Stroke[]): Stroke[] {
  return strokes.filter((s) => !s.erased && s.points.length > 0)
}

export function earliestStartedAt(strokes: Stroke[]): number {
  const ink = activeInkStrokes(strokes)
  if (ink.length === 0) return 0
  return Math.min(...ink.map((s) => s.startedAt ?? 0))
}
