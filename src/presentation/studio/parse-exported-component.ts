/**
 * Turn pasted Naisu export source (React SVG or raw SVG) into renderable markup.
 */

export type ParsedComponentPreview = {
  svg: string
  kind: "svg" | "react-svg" | "react-svg-animated"
}

export function parseExportedComponent(
  source: string
): ParsedComponentPreview | null {
  const trimmed = source.trim()
  if (!trimmed) return null

  if (/^<svg[\s>]/i.test(trimmed)) {
    return { svg: trimmed, kind: "svg" }
  }

  const viewBox = matchAttr(trimmed, "viewBox") ?? "0 0 800 560"
  const styleBlock = extractStyleCss(trimmed)
  const paths = extractJsxPaths(trimmed)
  if (paths.length === 0) return null

  const animated =
    styleBlock.includes("naisu-draw") ||
    /className=["']naisu-draw["']/.test(trimmed) ||
    /class=["']naisu-draw["']/.test(trimmed)

  const body = [
    styleBlock ? `<style>${styleBlock}</style>` : "",
    ...paths,
  ]
    .filter(Boolean)
    .join("\n")

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeAttr(viewBox)}" fill="none" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${body}</svg>`

  return {
    svg,
    kind: animated ? "react-svg-animated" : "react-svg",
  }
}

function extractStyleCss(source: string): string {
  // <style>{`...`}</style> or <style>...</style>
  const template = source.match(/<style>\{\s*`([\s\S]*?)`\s*\}<\/style>/)
  if (template?.[1]) return template[1].trim()
  const plain = source.match(/<style[^>]*>([\s\S]*?)<\/style>/)
  return plain?.[1]?.trim() ?? ""
}

function extractJsxPaths(source: string): string[] {
  const paths: string[] = []
  const re = /<path\b([\s\S]*?)\/?>/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source))) {
    const attrs = match[1] ?? ""
    const d = readJsxOrHtmlAttr(attrs, "d")
    if (!d) continue

    const stroke = readJsxOrHtmlAttr(attrs, "stroke") ?? "#111111"
    const strokeWidth =
      readJsxOrHtmlAttr(attrs, "strokeWidth") ??
      readJsxOrHtmlAttr(attrs, "stroke-width") ??
      "2"
    const opacity = readJsxOrHtmlAttr(attrs, "opacity") ?? "1"
    const className =
      readJsxOrHtmlAttr(attrs, "className") ??
      readJsxOrHtmlAttr(attrs, "class") ??
      ""
    const pathLength =
      readJsxOrHtmlAttr(attrs, "pathLength") ??
      readJsxOrHtmlAttr(attrs, "pathlength")
    const style = readStyleObject(attrs)

    const parts = [
      `d="${escapeAttr(d)}"`,
      `fill="none"`,
      `stroke="${escapeAttr(stroke)}"`,
      `stroke-width="${escapeAttr(stripBraces(strokeWidth))}"`,
      `stroke-linecap="round"`,
      `stroke-linejoin="round"`,
      `opacity="${escapeAttr(stripBraces(opacity))}"`,
    ]
    if (className) parts.push(`class="${escapeAttr(className)}"`)
    if (pathLength) parts.push(`pathLength="${escapeAttr(stripBraces(pathLength))}"`)
    if (style) parts.push(`style="${escapeAttr(style)}"`)

    paths.push(`<path ${parts.join(" ")} />`)
  }
  return paths
}

function readJsxOrHtmlAttr(attrs: string, name: string): string | null {
  const eq = new RegExp(
    `${name}\\s*=\\s*(?:\\{\\s*([^}]+?)\\s*\\}|\"([^\"]*)\"|'([^']*)')`,
    "i"
  )
  const m = attrs.match(eq)
  if (!m) return null
  return (m[1] ?? m[2] ?? m[3] ?? "").trim()
}

function readStyleObject(attrs: string): string | null {
  const m = attrs.match(/style=\{\{([\s\S]*?)\}\}/)
  if (!m?.[1]) return null
  const body = m[1]
  const css: string[] = []

  // ["--naisu-delay" as string]: "0.2s"
  const custom = /\[\s*["']([^"']+)["']\s+as\s+string\s*\]\s*:\s*["']([^"']+)["']/g
  let cm: RegExpExecArray | null
  while ((cm = custom.exec(body))) {
    css.push(`${cm[1]}: ${cm[2]}`)
  }

  const plain =
    /(animationDelay|animationDuration|animation-delay|animation-duration)\s*:\s*["']([^"']+)["']/g
  let pm: RegExpExecArray | null
  while ((pm = plain.exec(body))) {
    const key =
      pm[1] === "animationDelay"
        ? "animation-delay"
        : pm[1] === "animationDuration"
          ? "animation-duration"
          : pm[1]!
    css.push(`${key}: ${pm[2]}`)
  }

  return css.length ? css.join("; ") : null
}

function matchAttr(source: string, name: string): string | null {
  const m = source.match(new RegExp(`${name}=["']([^"']+)["']`))
  return m?.[1] ?? null
}

function stripBraces(value: string) {
  return value.replace(/^\{|\}$/g, "").trim()
}

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
