import type { StrokePolisherPort } from "@/application/ports/stroke-polisher"
import { polishStrokes } from "@/domain/sketch/polish"

/** Default polisher — pure domain math, zero npm lock-in. */
export const naisuStrokePolisher: StrokePolisherPort = {
  id: "naisu-polish",
  polish: polishStrokes,
}

export const identityPolisher: StrokePolisherPort = {
  id: "identity",
  polish: (strokes) => strokes,
}
