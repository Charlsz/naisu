/**
 * Pure stroke polish — no UI, no vendor libs.
 * Turns shaky freehand into cleaner ink that still feels hand-made.
 */

import type { Point, PolishOptions, Stroke } from "./types"

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function lerp(a: Point, b: Point, t: number): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    pressure:
      a.pressure != null && b.pressure != null
        ? a.pressure + (b.pressure - a.pressure) * t
        : a.pressure ?? b.pressure,
    t: a.t != null && b.t != null ? a.t + (b.t - a.t) * t : a.t ?? b.t,
  }
}

/** Perpendicular unit vector from A → B. */
function normal(a: Point, b: Point): { x: number; y: number } {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  return { x: -dy / len, y: dx / len }
}

function pointLineDistance(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (dx === 0 && dy === 0) return distance(p, a)
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy))
  )
  return distance(p, { x: a.x + t * dx, y: a.y + t * dy })
}

/** Ramer–Douglas–Peucker — strips jitter without losing the gesture. */
function rdp(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points.slice()

  let maxDist = 0
  let index = 0
  const first = points[0]!
  const last = points[points.length - 1]!

  for (let i = 1; i < points.length - 1; i++) {
    const d = pointLineDistance(points[i]!, first, last)
    if (d > maxDist) {
      maxDist = d
      index = i
    }
  }

  if (maxDist > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon)
    const right = rdp(points.slice(index), epsilon)
    return [...left.slice(0, -1), ...right]
  }

  return [first, last]
}

/** Even spacing along the path so smoothing and pulse are consistent. */
function resample(points: Point[], spacing: number): Point[] {
  if (points.length < 2) return points.slice()
  const out: Point[] = [points[0]!]
  let budget = spacing

  for (let i = 1; i < points.length; i++) {
    let a = out[out.length - 1]!
    let b = points[i]!
    let seg = distance(a, b)

    while (seg >= budget) {
      const t = budget / seg
      const next = lerp(a, b, t)
      out.push(next)
      a = next
      seg = distance(a, b)
      budget = spacing
    }
    budget -= seg
  }

  const last = points[points.length - 1]!
  if (distance(out[out.length - 1]!, last) > spacing * 0.25) out.push(last)
  else out[out.length - 1] = last
  return out
}

function chaikin(points: Point[]): Point[] {
  if (points.length < 3) return points.slice()
  const out: Point[] = [points[0]!]
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    out.push(lerp(a, b, 0.25), lerp(a, b, 0.75))
  }
  out.push(points[points.length - 1]!)
  return out
}

/**
 * Low-frequency ink wobble perpendicular to the stroke —
 * readable “human pulse”, not tiny noise.
 */
function inkPulse(
  points: Point[],
  amplitude: number,
  rand: () => number,
  seed: number
): Point[] {
  if (amplitude <= 0 || points.length < 3) return points

  const total = pathLength(points) || 1
  let traveled = 0
  // 1–2 slow waves along the stroke + a slower drift
  const freq1 = 1.2 + rand() * 0.8
  const freq2 = 0.35 + rand() * 0.25
  const phase = rand() * Math.PI * 2

  return points.map((p, i) => {
    if (i === 0 || i === points.length - 1) return p
    const prev = points[i - 1]!
    traveled += distance(prev, p)
    const u = traveled / total
    const n = normal(prev, points[Math.min(i + 1, points.length - 1)]!)
    const wave =
      Math.sin(u * Math.PI * 2 * freq1 + phase) * 0.65 +
      Math.sin(u * Math.PI * 2 * freq2 + seed * 0.01) * 0.35
    const jitter = (rand() - 0.5) * 0.25
    const offset = amplitude * (wave + jitter)
    return {
      ...p,
      x: p.x + n.x * offset,
      y: p.y + n.y * offset,
    }
  })
}

function pathLength(points: Point[]) {
  let len = 0
  for (let i = 1; i < points.length; i++) len += distance(points[i - 1]!, points[i]!)
  return len
}

/**
 * Soften sharp corners: blend points near high-angle turns so
 * rectangles / buttons look drawn, not traced with a mouse.
 */
function softenCorners(points: Point[], amount: number): Point[] {
  if (points.length < 4 || amount <= 0) return points
  const out = points.slice()
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1]!
    const b = points[i]!
    const c = points[i + 1]!
    const ab = { x: b.x - a.x, y: b.y - a.y }
    const bc = { x: c.x - b.x, y: c.y - b.y }
    const lab = Math.hypot(ab.x, ab.y) || 1
    const lbc = Math.hypot(bc.x, bc.y) || 1
    const dot = (ab.x * bc.x + ab.y * bc.y) / (lab * lbc)
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)))
    if (angle < 0.9) continue // only soft bends — leave intentional corners partly
    const t = amount * 0.35
    out[i] = {
      ...b,
      x: b.x * (1 - t) + ((a.x + c.x) / 2) * t,
      y: b.y * (1 - t) + ((a.y + c.y) / 2) * t,
    }
  }
  return out
}

export function polishPoints(
  points: Point[],
  options: PolishOptions = {}
): Point[] {
  if (points.length < 2) return points.slice()

  const amount = Math.min(1, Math.max(0, options.amount ?? 0.82))
  // Visible ink wander — scales up so polish is obvious
  const pulse =
    options.pulse ?? 1.6 + amount * 1.4
  const rand = mulberry32(options.seed ?? 1)

  // Aggressive denoise → even samples → round → ink pulse
  const epsilon = 1.8 + amount * 3.2
  let next = rdp(points, epsilon)
  next = resample(next, 3.2 - amount * 0.8)
  next = softenCorners(next, amount)

  const iterations = Math.round(2 + amount * 3)
  for (let i = 0; i < iterations; i++) next = chaikin(next)

  next = resample(next, 2.4)
  next = inkPulse(next, pulse, rand, options.seed ?? 1)
  return next
}

export function polishStroke(stroke: Stroke, options: PolishOptions = {}): Stroke {
  if (stroke.erased || stroke.points.length < 2) return stroke
  const points = polishPoints(stroke.points, {
    ...options,
    seed: (options.seed ?? 1) ^ hashId(stroke.id),
  })
  // Keep draw-order timing so animation export still tracks the gesture.
  return {
    ...stroke,
    points: remapPointTimes(stroke.points, points),
  }
}

/** Spread original timing across polished samples so the gesture still reads. */
function remapPointTimes(from: Point[], to: Point[]): Point[] {
  const startT = from[0]?.t ?? 0
  const endT = from[from.length - 1]?.t ?? startT
  if (to.length <= 1) return to.map((p) => ({ ...p, t: startT }))
  const span = Math.max(0, endT - startT)
  return to.map((p, i) => ({
    ...p,
    t: startT + (span * i) / (to.length - 1),
  }))
}

export function polishStrokes(
  strokes: Stroke[],
  options: PolishOptions = {}
): Stroke[] {
  return strokes.map((s) => polishStroke(s, options))
}

function hashId(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
