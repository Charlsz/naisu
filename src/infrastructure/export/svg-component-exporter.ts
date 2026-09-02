import type { ComponentExporterPort } from "@/application/ports/component-exporter"
import type { ComponentExport, ExportRequest } from "@/domain/component/types"
import type { BoardSize, Stroke } from "@/domain/sketch/types"

export const svgComponentExporter: ComponentExporterPort = {
  id: "svg-clipboard",
  export(request: ExportRequest): ComponentExport {
    const { sketch } = request.component
    const filename = slugify(sketch.name) || "naisu-component"

    if (request.format === "react-svg") {
      const source = toReactSvgSource(sketch.strokes, sketch.board, sketch.name)
      return {
        format: "react-svg",
        content: source,
        filename,
        mimeType: "text/plain",
      }
    }

    const svg = strokesToSvg(sketch.strokes, sketch.board)
    return {
      format: request.format === "png" ? "svg" : "svg",
      content: svg,
      filename,
      mimeType: "image/svg+xml",
    }
  },
  async copyToClipboard(payload: ComponentExport) {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      throw new Error("Clipboard API unavailable")
    }
    await navigator.clipboard.writeText(payload.content)
  },
}

function strokesToSvg(strokes: Stroke[], board: BoardSize): string {
  const paths = strokes
    .filter((s) => !s.erased && s.points.length > 0)
    .map((s) => {
      const d = pointsToPath(s.points)
      return `  <path d="${d}" fill="none" stroke="${escapeXml(s.color)}" stroke-width="${s.size}" stroke-linecap="round" stroke-linejoin="round" opacity="${s.opacity}" />`
    })
    .join("\n")

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${board.w} ${board.h}" width="${board.w}" height="${board.h}" fill="none">`,
    paths,
    `</svg>`,
  ].join("\n")
}

function toReactSvgSource(
  strokes: Stroke[],
  board: BoardSize,
  name: string
): string {
  const componentName = toComponentName(name)
  const paths = strokes
    .filter((s) => !s.erased && s.points.length > 0)
    .map((s) => {
      const d = pointsToPath(s.points)
      return `      <path d="${d}" stroke="${escapeXml(s.color)}" strokeWidth={${s.size}} strokeLinecap="round" strokeLinejoin="round" opacity={${s.opacity}} />`
    })
    .join("\n")

  return `export function ${componentName}(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 ${board.w} ${board.h}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
${paths}
    </svg>
  )
}
`
}

function pointsToPath(points: Stroke["points"]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
    .join(" ")
}

function round(n: number) {
  return Math.round(n * 100) / 100
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function toComponentName(value: string) {
  const parts = value.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/)
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")
  return name && /^[A-Za-z]/.test(name) ? name : "NaisuSketch"
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
