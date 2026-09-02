import type { PathFrames, RoughOptions, RoughRendererPort } from "@/application/ports/rough-renderer"

/**
 * In-house rough paths for hand-made UI chrome.
 * Keeps the product independent of any single sketch library.
 */
export const memoryRoughRenderer: RoughRendererPort = {
  id: "memory-rough",
  roundedRect(x, y, w, h, r, options) {
    return frames(() => wobbleRoundedRect(x, y, w, h, r, options), options)
  },
  line(x1, y1, x2, y2, options) {
    return frames(() => wobbleLine(x1, y1, x2, y2, options), options)
  },
  circle(cx, cy, radius, options) {
    return frames(() => wobbleCircle(cx, cy, radius, options), options)
  },
}

function frames(
  build: (jitter: number) => string,
  options?: RoughOptions
): PathFrames {
  const seed = options?.seed ?? 1
  const boil = options?.boil ?? 0.3
  return {
    seed,
    paths: [build(0), build(boil), build(-boil)],
  }
}

function wobbleRoundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  options?: RoughOptions
) {
  const rough = options?.roughness ?? 1
  const j = (n: number) => n + (hash(seedKey(options?.seed, n)) - 0.5) * rough * 1.4
  const rr = Math.min(r, w / 2, h / 2)
  return [
    `M${j(x + rr)} ${j(y)}`,
    `L${j(x + w - rr)} ${j(y)}`,
    `Q${j(x + w)} ${j(y)} ${j(x + w)} ${j(y + rr)}`,
    `L${j(x + w)} ${j(y + h - rr)}`,
    `Q${j(x + w)} ${j(y + h)} ${j(x + w - rr)} ${j(y + h)}`,
    `L${j(x + rr)} ${j(y + h)}`,
    `Q${j(x)} ${j(y + h)} ${j(x)} ${j(y + h - rr)}`,
    `L${j(x)} ${j(y + rr)}`,
    `Q${j(x)} ${j(y)} ${j(x + rr)} ${j(y)}`,
    "Z",
  ].join(" ")
}

function wobbleLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: RoughOptions
) {
  const rough = options?.roughness ?? 1
  const mx = (x1 + x2) / 2 + (hash(seedKey(options?.seed, 3)) - 0.5) * rough * 2
  const my = (y1 + y2) / 2 + (hash(seedKey(options?.seed, 4)) - 0.5) * rough * 2
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`
}

function wobbleCircle(
  cx: number,
  cy: number,
  radius: number,
  options?: RoughOptions
) {
  const rough = options?.roughness ?? 1
  const steps = 12
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const rr = radius + (hash(seedKey(options?.seed, i)) - 0.5) * rough * 1.5
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `${pts.join(" ")} Z`
}

function seedKey(seed: number | undefined, n: number) {
  return ((seed ?? 1) * 73856093) ^ (n * 19349663)
}

function hash(n: number) {
  let t = n >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
