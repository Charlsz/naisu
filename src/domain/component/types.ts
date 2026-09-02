/**
 * What a finished Naisu component is, independent of React/SVG tooling.
 */

import type { SketchDocument } from "@/domain/sketch/types"

export type ExportFormat = "svg" | "react-svg" | "png"

export type ComponentExport = {
  format: ExportFormat
  /** Clipboard / download payload. */
  content: string
  /** Suggested filename without extension. */
  filename: string
  mimeType: string
}

export type DrawnComponent = {
  sketch: SketchDocument
  /** Whether strokes have been through the polish pipeline. */
  polished: boolean
}

export type ExportRequest = {
  component: DrawnComponent
  format: ExportFormat
}
