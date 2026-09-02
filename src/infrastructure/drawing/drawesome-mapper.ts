import type { PenKind, Point, Stroke } from "@/domain/sketch/types"
import type {
  PenId,
  Point as DrawesomePoint,
  Stroke as DrawesomeStroke,
} from "drawesome"

const PEN_IDS: PenId[] = [
  "pencil",
  "pen",
  "fineliner",
  "marker",
  "highlighter",
  "brush",
  "fountain",
]

export const DRAWESOME_ALL_TOOLS: PenId[] = [...PEN_IDS]

export function isPenId(value: string): value is PenId {
  return (PEN_IDS as string[]).includes(value)
}

export function toDomainStroke(stroke: DrawesomeStroke): Stroke {
  return {
    id: String(stroke.id),
    pen: stroke.pen,
    color: stroke.color,
    size: stroke.size,
    opacity: stroke.opacity,
    erased: stroke.erase,
    points: stroke.points.map(tupleToPoint),
  }
}

export function toDrawesomeStroke(stroke: Stroke, fallbackId: number): DrawesomeStroke {
  const pen: PenId = isPenId(stroke.pen) ? stroke.pen : "pen"
  const id = Number.parseInt(stroke.id, 10)
  return {
    id: Number.isFinite(id) ? id : fallbackId,
    pen,
    color: stroke.color,
    size: stroke.size,
    opacity: stroke.opacity,
    erase: Boolean(stroke.erased),
    points: stroke.points.map(pointToTuple),
  }
}

export function toDomainStrokes(strokes: DrawesomeStroke[]): Stroke[] {
  return strokes.map(toDomainStroke)
}

export function toDrawesomeStrokes(strokes: Stroke[]): DrawesomeStroke[] {
  return strokes.map((stroke, index) =>
    toDrawesomeStroke(stroke, Date.now() + index)
  )
}

export function penKindLabel(pen: PenKind): string {
  return pen
}

function tupleToPoint(point: DrawesomePoint): Point {
  return {
    x: point[0],
    y: point[1],
    pressure: point[2],
  }
}

function pointToTuple(point: Point): DrawesomePoint {
  return [point.x, point.y, point.pressure ?? 0.5]
}
