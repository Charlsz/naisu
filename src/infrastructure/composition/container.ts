import type { ComponentExporterPort } from "@/application/ports/component-exporter"
import type { DrawingSurfacePort } from "@/application/ports/drawing-surface"
import type { RoughRendererPort } from "@/application/ports/rough-renderer"
import type { StrokePolisherPort } from "@/application/ports/stroke-polisher"
import { drawesomeDrawingSurface } from "@/infrastructure/drawing/drawesome-drawing-surface"
import { memoryDrawingSurface } from "@/infrastructure/drawing/memory-drawing-surface"
import { svgComponentExporter } from "@/infrastructure/export/svg-component-exporter"
import { naisuStrokePolisher } from "@/infrastructure/polish/naisu-stroke-polisher"
import { memoryRoughRenderer } from "@/infrastructure/rough/memory-rough-renderer"

/**
 * Composition root — the only place that picks concrete tools.
 * Swap adapters here without touching pages or use-cases.
 */
export type AppContainer = {
  drawing: DrawingSurfacePort
  polisher: StrokePolisherPort
  exporter: ComponentExporterPort
  rough: RoughRendererPort
}

export type AdapterChoice = {
  drawing?: "memory" | "drawesome"
}

export function createContainer(choice: AdapterChoice = {}): AppContainer {
  return {
    drawing:
      choice.drawing === "memory"
        ? memoryDrawingSurface
        : drawesomeDrawingSurface,
    polisher: naisuStrokePolisher,
    exporter: svgComponentExporter,
    rough: memoryRoughRenderer,
  }
}

export const container = createContainer({
  drawing: "drawesome",
})
