import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

/** Prefer the real project file when the gallery demo renders it. */
const sourceFileById = {
  "continuous-slider": "src/components/ui/continuous-slider.tsx",
  "click-shockwave": "src/components/ui/click-shockwave.tsx",
  "compare-reveal": "src/components/motiq/compare-reveal.tsx",
  "cool-scrollbar": "src/components/naisu/cool-scrollbar.tsx",
}

/** Otherwise show the exact demo export that powers the panel. */
const demoExportById = {
  "magnetic-button": "MagneticButtonDemo",
  "hover-reveal": "HoverRevealDemo",
  "cursor-spotlight": "CursorSpotlightDemo",
  "number-counter": "NumberCounterDemo",
  toggle: "ToggleDemo",
  "checkbox-ink": "CheckboxInkDemo",
  "checkbox-seal": "CheckboxSealDemo",
  "checkbox-bloom": "CheckboxBloomDemo",
  "loading-indicator": "LoadingIndicatorDemo",
  "card-tilt": "CardTiltDemo",
  "tabs-pill": "TabsPillDemo",
  "tabs-underline": "TabsUnderlineDemo",
  "circular-progress": "CircularProgressDemo",
  "hover-border": "HoverBorderDemo",
}

function extractExport(source, name) {
  const start = source.indexOf(`export function ${name}`)
  if (start < 0) throw new Error(`Missing export: ${name}`)

  let i = source.indexOf("{", start)
  if (i < 0) throw new Error(`Missing body: ${name}`)
  let depth = 0
  for (; i < source.length; i++) {
    const ch = source[i]
    if (ch === "{") depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) return source.slice(start, i + 1).trim() + "\n"
    }
  }
  throw new Error(`Unclosed body: ${name}`)
}

function extractHelper(source, name) {
  const start = source.search(new RegExp(`(?:^|\\n)function ${name}\\b`))
  if (start < 0) return null
  const from = source[start] === "\n" ? start + 1 : start
  let i = source.indexOf("{", from)
  let depth = 0
  for (; i < source.length; i++) {
    const ch = source[i]
    if (ch === "{") depth++
    else if (ch === "}") {
      depth--
      if (depth === 0) return source.slice(from, i + 1).trim() + "\n\n"
    }
  }
  return null
}

function extractPrecedingConsts(source, exportName, names) {
  const cut = source.indexOf(`export function ${exportName}`)
  if (cut < 0) return ""
  const before = source.slice(0, cut)
  const chunks = []
  for (const name of names) {
    const start = before.lastIndexOf(`const ${name}`)
    if (start < 0) continue
    // Find end of const — next top-level const/export/function or blank+comment
    let i = before.indexOf("=", start)
    // Walk to semicolon or matching braces/parens for complex consts
    let depthBrace = 0
    let depthParen = 0
    let depthBracket = 0
    let inTemplate = false
    let inStr = null
    for (; i < before.length; i++) {
      const ch = before[i]
      const prev = before[i - 1]
      if (inStr) {
        if (ch === inStr && prev !== "\\") inStr = null
        continue
      }
      if (inTemplate) {
        if (ch === "`" && prev !== "\\") inTemplate = false
        continue
      }
      if (ch === "'" || ch === '"') {
        inStr = ch
        continue
      }
      if (ch === "`") {
        inTemplate = true
        continue
      }
      if (ch === "{") depthBrace++
      else if (ch === "}") depthBrace--
      else if (ch === "(") depthParen++
      else if (ch === ")") depthParen--
      else if (ch === "[") depthBracket++
      else if (ch === "]") depthBracket--
      else if (
        ch === ";" &&
        depthBrace === 0 &&
        depthParen === 0 &&
        depthBracket === 0
      ) {
        chunks.push(before.slice(start, i + 1).trim() + "\n\n")
        break
      }
    }
  }
  return chunks.join("")
}

function neededImports(snippet) {
  const lines = [`"use client"`]
  const needsReact =
    /\bReact\./.test(snippet) ||
    /\buse[A-Z]/.test(snippet) ||
    /<[A-Z]/.test(snippet)
  if (needsReact) lines.push(`import * as React from "react"`)

  const motionBits = []
  for (const name of [
    "AnimatePresence",
    "motion",
    "useMotionTemplate",
    "useMotionValue",
    "useSpring",
    "useTransform",
  ]) {
    if (new RegExp(`\\b${name}\\b`).test(snippet)) motionBits.push(name)
  }
  if (motionBits.length) {
    lines.push(`import { ${motionBits.join(", ")} } from "motion/react"`)
  }

  if (/\bcn\(/.test(snippet)) {
    lines.push(`import { cn } from "@/lib/utils"`)
  }
  if (/\bsprings\b/.test(snippet)) {
    lines.push(`import { springs } from "@/lib/motion"`)
  }

  const icons = []
  if (/\bInfoIcon\b/.test(snippet)) icons.push("Info as InfoIcon")
  if (/\bSearchIcon\b/.test(snippet)) icons.push("Search as SearchIcon")
  if (/\bXIcon\b/.test(snippet)) icons.push("X as XIcon")
  if (icons.length) {
    lines.push(`import { ${icons.join(", ")} } from "lucide-react"`)
  }

  return lines.join("\n") + "\n\n"
}

function main() {
  const demosPath = path.join(root, "src/components/demos.tsx")
  const demosSrc = fs.readFileSync(demosPath, "utf8")
  const out = {}

  for (const [id, rel] of Object.entries(sourceFileById)) {
    out[id] = fs.readFileSync(path.join(root, rel), "utf8")
  }

  const constDeps = {
    CircularProgressDemo: ["SCROLL_COPY"],
    InfiniteSliderDemo: ["MARQUEE_ITEMS"],
    CoolScrollbarDemo: ["SCROLL_COPY"],
  }

  for (const [id, exportName] of Object.entries(demoExportById)) {
    const body = extractExport(demosSrc, exportName)
    const helpers = []
    if (/\busePointer\b/.test(body)) {
      const h = extractHelper(demosSrc, "usePointer")
      if (h) helpers.push(h)
    }
    if (/\buseCycle\b/.test(body)) {
      const h = extractHelper(demosSrc, "useCycle")
      if (h) helpers.push(h)
    }

    // Pull referenced module-level consts used by this demo
    const names = []
    for (const m of body.matchAll(/\b([A-Z][A-Z0-9_]+)\b/g)) {
      names.push(m[1])
    }
    const consts = extractPrecedingConsts(demosSrc, exportName, [
      ...new Set(names),
    ])

    out[id] = neededImports(consts + helpers.join("") + body) + consts + helpers.join("") + body
  }

  const serialized = Object.entries(out)
    .map(([id, code]) => {
      const key = /^[a-zA-Z_][\w]*$/.test(id) ? id : JSON.stringify(id)
      return `  ${key}: ${JSON.stringify(code)}`
    })
    .join(",\n")

  const file = `/** Auto-generated by scripts/sync-sources.mjs — do not edit by hand. */\nexport const componentSources: Record<string, string> = {\n${serialized},\n}\n`

  fs.writeFileSync(path.join(root, "src/content/sources.ts"), file)
  console.log(`Wrote sources.ts (${Object.keys(out).length} entries)`)
}

main()
