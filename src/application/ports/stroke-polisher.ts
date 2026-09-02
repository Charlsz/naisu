import type { PolishOptions, Stroke } from "@/domain/sketch/types"

/**
 * Turns raw freehand strokes into cleaner paths while keeping human wobble.
 * Default: domain polish. Swap for perfect-freehand, ML smoothers, etc.
 */
export type StrokePolisherPort = {
  readonly id: string
  polish: (strokes: Stroke[], options?: PolishOptions) => Stroke[]
}
