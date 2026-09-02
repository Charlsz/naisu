/**
 * Rough / hand-drawn path generation for finished UI chrome.
 * Drawably implements this; we can also ship a tiny in-house renderer.
 * Presentation asks for shapes — never imports drawably directly.
 */

export type RoughOptions = {
  seed?: number
  roughness?: number
  boil?: number
  stroke?: string
  fill?: string
  width?: number
}

/** Three path variants for optional “boiling” animation. */
export type PathFrames = {
  paths: [string, string, string]
  seed: number
}

export type RoughRendererPort = {
  readonly id: string
  roundedRect: (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    options?: RoughOptions
  ) => PathFrames
  line: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: RoughOptions
  ) => PathFrames
  circle: (
    cx: number,
    cy: number,
    radius: number,
    options?: RoughOptions
  ) => PathFrames
}
