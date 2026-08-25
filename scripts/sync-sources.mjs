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
  "reading-notebook": "src/components/naisu/reading-notebook.tsx",
  "vintage-keyboard": "src/components/ui/vintage-keyboard.tsx",
  "hover-border": "src/components/naisu/hover-border.tsx",
  "cursor-spotlight": "src/components/naisu/cursor-spotlight.tsx",
  conversation: "src/components/naisu/conversation.tsx",
  message: "src/components/naisu/message.tsx",
  "message-group": "src/components/naisu/message-group.tsx",
  "chat-input": "src/components/naisu/chat-input.tsx",
  "prompt-input": "src/components/naisu/prompt-input.tsx",
  "streaming-text": "src/components/naisu/streaming-text.tsx",
  markdown: "src/components/naisu/markdown.tsx",
  "code-block": "src/components/naisu/code-block.tsx",
  attachment: "src/components/naisu/attachment.tsx",
  "thinking-indicator": "src/components/naisu/thinking-indicator.tsx",
  "thinking-steps": "src/components/naisu/thinking-indicator.tsx",
  "thinking-reasoning": "src/components/naisu/thinking-indicator.tsx",
  "thinking-search": "src/components/naisu/thinking-indicator.tsx",
  "thinking-coding": "src/components/naisu/thinking-indicator.tsx",
  "loading-drive": "src/components/naisu/loading-state.tsx",
  "loading-dots": "src/components/naisu/loading-state.tsx",
  "loading-orbit": "src/components/naisu/loading-state.tsx",
  "loading-bars": "src/components/naisu/loading-state.tsx",
  "loading-ring": "src/components/naisu/loading-state.tsx",
  "loading-pulse": "src/components/naisu/loading-state.tsx",
  "loading-wave": "src/components/naisu/loading-state.tsx",
  "loading-bloom": "src/components/naisu/loading-state.tsx",
  "loading-flower": "src/components/naisu/loading-state.tsx",
  "loading-jar": "src/components/naisu/loading-state.tsx",
  "loading-pointer": "src/components/naisu/loading-state.tsx",
  "tool-call": "src/components/naisu/tool-call.tsx",
  "tool-call-group": "src/components/naisu/tool-call-group.tsx",
  "tool-chips": "src/components/naisu/tool-chips.tsx",
  "execution-step": "src/components/naisu/execution-step.tsx",
  "execution-timeline": "src/components/naisu/execution-timeline.tsx",
  task: "src/components/naisu/task.tsx",
  "task-list": "src/components/naisu/task-list.tsx",
  "task-status": "src/components/naisu/task-status.tsx",
  "agent-status": "src/components/naisu/agent-status.tsx",
  "permission-request": "src/components/naisu/permission-request.tsx",
  approval: "src/components/naisu/approval.tsx",
  recommendation: "src/components/naisu/recommendation.tsx",
  "context-cards": "src/components/naisu/context-cards.tsx",
  "selection-actions": "src/components/naisu/selection-actions.tsx",
  "execution-output": "src/components/naisu/execution-output.tsx",
  toast: "src/components/naisu/toast.tsx",
  dialog: "src/components/naisu/system-dialog.tsx",
  popover: "src/components/naisu/popover.tsx",
  tooltip: "src/components/naisu/tooltip.tsx",
  badge: "src/components/naisu/badge.tsx",
  status: "src/components/naisu/status.tsx",
  progress: "src/components/naisu/progress.tsx",
  spinner: "src/components/naisu/spinner.tsx",
  "empty-state": "src/components/naisu/empty-state.tsx",
  "settings-panel": "src/components/naisu/settings-panel.tsx",
  "model-selector": "src/components/naisu/option-selector.tsx",
  "agent-selector": "src/components/naisu/option-selector.tsx",
  "tool-selector": "src/components/naisu/tool-selector.tsx",
  "permission-selector": "src/components/naisu/permission-selector.tsx",
  "provider-selector": "src/components/naisu/option-selector.tsx",
  "key-input": "src/components/naisu/key-input.tsx",
  "anim-bounce": "src/components/naisu/anim-bounce.tsx",
  "anim-paper": "src/components/naisu/anim-paper.tsx",
  "anim-stretch": "src/components/naisu/anim-stretch.tsx",
  "anim-twist": "src/components/naisu/anim-twist.tsx",
  "anim-walk": "src/components/naisu/anim-walk.tsx",
  "anim-sway": "src/components/naisu/anim-sway.tsx",
  "anim-pulse": "src/components/naisu/anim-pulse.tsx",
  "anim-heart-burst": "src/components/naisu/anim-heart-burst.tsx",
  "anim-bookmark": "src/components/naisu/anim-bookmark.tsx",
  "anim-stamp-star": "src/components/naisu/anim-stamp.tsx",
  "anim-stamp-heart": "src/components/naisu/anim-stamp.tsx",
  "anim-stamp-flag": "src/components/naisu/anim-stamp.tsx",
  "anim-stamp-pin": "src/components/naisu/anim-stamp.tsx",
  "anim-stamp-bell": "src/components/naisu/anim-stamp.tsx",
  "anim-headphone-naisu": "src/components/naisu/anim-headphone.tsx",
  "anim-flip": "src/components/naisu/anim-flip.tsx",
  "image-carousel": "src/components/naisu/image-carousel.tsx",
  "anim-snap": "src/components/naisu/anim-snap.tsx",
  "anim-glow": "src/components/naisu/anim-glow.tsx",
  "anim-transitions": "src/components/naisu/anim-transitions.tsx",
  "anim-star-pulse": "src/components/naisu/anim-react.tsx",
  "anim-star-burst": "src/components/naisu/anim-react.tsx",
  "anim-star-fill": "src/components/naisu/anim-react.tsx",
  "anim-zap-burst": "src/components/naisu/anim-react.tsx",
  "anim-bell-fill": "src/components/naisu/anim-react.tsx",
  "anim-thumb-pulse": "src/components/naisu/anim-react.tsx",
}

/** Otherwise show the exact demo export that powers the panel. */
const demoExportById = {
  "magnetic-button": "MagneticButtonDemo",
  "hover-reveal": "HoverRevealDemo",
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
    "animate",
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
