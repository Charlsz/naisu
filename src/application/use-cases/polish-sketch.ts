import type { StrokePolisherPort } from "@/application/ports/stroke-polisher"
import type { DrawnComponent } from "@/domain/component/types"
import type { PolishOptions, SketchDocument } from "@/domain/sketch/types"
import { touchSketch } from "./create-sketch"

export function polishSketch(
  polisher: StrokePolisherPort,
  sketch: SketchDocument,
  options?: PolishOptions
): DrawnComponent {
  const polished = polisher.polish(sketch.strokes, {
    seed: sketch.seed,
    ...options,
  })
  return {
    sketch: touchSketch(sketch, { strokes: polished }),
    polished: true,
  }
}
