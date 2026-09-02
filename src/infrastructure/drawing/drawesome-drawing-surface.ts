import type { DrawingSurfacePort } from "@/application/ports/drawing-surface"

/**
 * Drawesome adapter id for the composition root.
 * The React surface lives in `drawesome-canvas.tsx`.
 */
export const drawesomeDrawingSurface: DrawingSurfacePort = {
  id: "drawesome",
}
