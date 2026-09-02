import type { ComponentExporterPort } from "@/application/ports/component-exporter"
import type {
  ComponentExport,
  DrawnComponent,
  ExportFormat,
} from "@/domain/component/types"

export async function exportComponent(
  exporter: ComponentExporterPort,
  component: DrawnComponent,
  format: ExportFormat,
  options?: { copy?: boolean }
): Promise<ComponentExport> {
  const payload = exporter.export({ component, format })
  if (options?.copy !== false) {
    await exporter.copyToClipboard(payload)
  }
  return payload
}
