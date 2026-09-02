import type {
  ComponentExport,
  ExportRequest,
} from "@/domain/component/types"

/**
 * Turns a polished sketch into something the user can copy/paste.
 */
export type ComponentExporterPort = {
  readonly id: string
  export: (request: ExportRequest) => ComponentExport
  copyToClipboard: (payload: ComponentExport) => Promise<void>
}
