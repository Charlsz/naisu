/**
 * Imports css-animations-main HTML tips into src/content/css-anim-tips.ts
 * and copies assets to public/css-anims/.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const srcRoot = path.join(root, "css-animations-main", "css-animations-main")
const publicDir = path.join(root, "public", "css-anims")
const outFile = path.join(root, "src", "content", "css-anim-tips.ts")

/** Tips already covered by hand-crafted naisu anim components (or removed). */
const SKIP = new Set([
  "2026-04-17/tips-1", // anim-bounce
  "2026-04-17/tips-2", // anim-paper
  "2026-04-17/tips-3", // anim-stretch
  "2026-04-17/tips-4", // anim-twist
  "2026-05-02/tips-4", // anim-nest (removed)
  "2026-06-07/tips-1", // anim-pulse
  "2026-06-07/tips-2", // anim-heart-burst
  "2026-06-08/tips-1", // anim-spark (removed)
  "2026-06-08/tips-2", // anim-bookmark
  "2026-06-08/tips-3", // anim-draw
  "2026-06-09/tips-1", // anim-walk
  "2026-06-09/tips-2", // anim-sway
  "2025-02-25/index", // anim-transitions
  "2025-03-11/index", // anim-loading-icons
])

const MANIFEST = [
  {
    id: "anim-paper",
    label: "Paper",
    file: "2026-04-17/tips-2.html",
    interval: 3200,
  },
  {
    id: "anim-stretch",
    label: "Stretch",
    file: "2026-04-17/tips-3.html",
    interval: 3200,
  },
  {
    id: "anim-twist",
    label: "Twist",
    file: "2026-04-17/tips-4.html",
    interval: 3200,
  },
  {
    id: "anim-blocks",
    label: "Blocks",
    file: "2026-04-18/tips-1.html",
    interval: 2800,
  },
  {
    id: "anim-domino",
    label: "Domino",
    file: "2026-04-18/tips-2.html",
    interval: 3200,
  },
  {
    id: "anim-panel",
    label: "Panel",
    file: "2026-04-18/tips-3.html",
    interval: 3200,
  },
  {
    id: "anim-stack",
    label: "Stack",
    file: "2026-04-18/tips-4.html",
    interval: 3200,
  },
  {
    id: "anim-shutter",
    label: "Shutter",
    file: "2026-04-22/tips-1.html",
    interval: 3600,
  },
  {
    id: "anim-curtain",
    label: "Curtain",
    file: "2026-04-22/tips-2.html",
    interval: 3600,
  },
  {
    id: "anim-lines",
    label: "Lines",
    file: "2026-04-22/tips-3.html",
    interval: 3600,
  },
  {
    id: "anim-yarns",
    label: "Yarns",
    file: "2026-04-22/tips-4.html",
    interval: 3600,
  },
  {
    id: "anim-scroll",
    label: "Makimono",
    file: "2026-04-25/tips-1.html",
    interval: 4000,
  },
  {
    id: "anim-bricks",
    label: "Bricks",
    file: "2026-04-25/tips-2.html",
    interval: 3600,
  },
  {
    id: "anim-plus-minus",
    label: "Plus minus",
    file: "2026-04-25/tips-3.html",
    interval: 3200,
  },
  {
    id: "anim-ripple",
    label: "Ripple",
    file: "2026-04-25/tips-4.html",
    interval: 3200,
  },
  {
    id: "anim-strike",
    label: "Strike",
    file: "2026-04-29/tips-1.html",
    interval: 3200,
  },
  {
    id: "anim-frame",
    label: "Frame",
    file: "2026-04-29/tips-2.html",
    interval: 3600,
  },
  {
    id: "anim-corner",
    label: "Corner",
    file: "2026-04-29/tips-3.html",
    interval: 3600,
  },
  {
    id: "anim-dots",
    label: "Dots",
    file: "2026-04-29/tips-4.html",
    interval: 3200,
  },
  {
    id: "anim-expand",
    label: "Expand",
    file: "2026-05-02/tips-1.html",
    interval: 3600,
  },
  {
    id: "anim-balance",
    label: "Balance",
    file: "2026-05-02/tips-2.html",
    interval: 3600,
  },
  {
    id: "anim-download",
    label: "Download",
    file: "2026-05-02/tips-3.html",
    interval: 3600,
  },
  {
    id: "anim-nest",
    label: "Nest",
    file: "2026-05-02/tips-4.html",
    interval: 3600,
  },
  {
    id: "anim-tissue",
    label: "Tissue",
    file: "2026-05-14/tips-1.html",
    interval: 4000,
  },
  {
    id: "anim-clothes",
    label: "Clothes",
    file: "2026-05-14/tips-2.html",
    interval: 4000,
  },
  {
    id: "anim-split",
    label: "Split",
    file: "2026-05-14/tips-3.html",
    interval: 3600,
  },
  {
    id: "anim-headphone",
    label: "Headphone",
    file: "2026-05-14/tips-4.html",
    interval: 4000,
  },
  {
    id: "anim-heart-burst",
    label: "Heart burst",
    file: "2026-06-07/tips-2.html",
    interval: 4200,
  },
  {
    id: "anim-heart-fill",
    label: "Heart fill",
    file: "2026-06-07/tips-3.html",
    interval: 4200,
  },
  {
    id: "anim-transitions",
    label: "Transitions",
    file: "2025-02-25/index.html",
    interval: 10000,
  },
  {
    id: "anim-loading-icons",
    label: "Loading icons",
    file: "2025-03-11/index.html",
    interval: 0,
  },
]

function adaptColors(css) {
  return css
    .replace(/#ffffff\b/gi, "#FDFDFC")
    .replace(/#fff\b/gi, "#FDFDFC")
    .replace(/(?<![-\w])white(?![-\w])/gi, "#FDFDFC")
    .replace(/#000000\b/gi, "#111111")
    .replace(/#000\b/gi, "#111111")
    .replace(/#112326\b/gi, "#111111")
    .replace(/#111\b/gi, "#111111")
    .replace(/background-color:\s*#36a7f6/gi, "background-color: #FDFDFC")
    .replace(/background-color:\s*#e0e0e0/gi, "background-color: transparent")
    .replace(/background-color:\s*#f5f5f5/gi, "background-color: transparent")
    // Undo accidental corruption of CSS keywords like white-space
    .replace(/#FDFDFC-space\b/g, "white-space")
    .replace(/#111111-space\b/g, "white-space")
}

function adaptAssets(text, fileDir) {
  return text
    .replace(/url\(\.?\/?([^)]+)\)/g, (_, p) => {
      const name = path.basename(p.replace(/['"]/g, "").trim())
      return `url(/css-anims/${name})`
    })
    .replace(/src=["']\.\/([^"']+)["']/g, `src="/css-anims/$1"`)
    .replace(/src=["']([^"'/]+?\.(?:svg|png|jpg))["']/g, `src="/css-anims/$1"`)
}

function extract(html, fileRel) {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!styleMatch || !bodyMatch) {
    throw new Error(`Could not parse ${fileRel}`)
  }

  let css = styleMatch[1]
  let body = bodyMatch[1].trim()

  // Drop google font imports — use system stack
  css = css.replace(/@import[^;]+;/g, "")

  // Make .container fill the demo stage instead of viewport-centering
  css = `
:host, .naisu-css-anim-root {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}
.container {
  position: absolute !important;
  inset: 0 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  max-width: none !important;
  width: 100% !important;
  height: 100% !important;
  aspect-ratio: auto !important;
  transform: none !important;
  margin: 0 !important;
  display: grid !important;
  place-content: center !important;
  overflow: hidden !important;
  border-radius: 20px;
  box-sizing: border-box;
}
${css}
`

  css = adaptColors(css)
  css = adaptAssets(css, path.dirname(fileRel))
  body = adaptAssets(body, path.dirname(fileRel))
  body = adaptColors(body)

  return { css: css.trim(), html: body }
}

function copyAssets() {
  fs.mkdirSync(publicDir, { recursive: true })
  const assetGlobs = [
    ["2025-03-11", [".svg"]],
    ["2026-06-07", [".svg"]],
    ["2026-06-08", [".svg"]],
    ["2026-06-09", [".png"]],
  ]
  for (const [dir, exts] of assetGlobs) {
    const folder = path.join(srcRoot, dir)
    if (!fs.existsSync(folder)) continue
    for (const name of fs.readdirSync(folder)) {
      if (exts.some((e) => name.endsWith(e))) {
        fs.copyFileSync(path.join(folder, name), path.join(publicDir, name))
      }
    }
  }
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
}

function main() {
  if (!fs.existsSync(srcRoot)) {
    console.error("Missing css-animations-main folder at", srcRoot)
    process.exit(1)
  }

  copyAssets()

  const tips = []
  for (const entry of MANIFEST) {
    const key = entry.file.replace(/\.html$/, "")
    if (SKIP.has(key)) continue

    const full = path.join(srcRoot, entry.file)
    if (!fs.existsSync(full)) {
      console.warn("skip missing", entry.file)
      continue
    }
    const raw = fs.readFileSync(full, "utf8")
    const { css, html } = extract(raw, entry.file)
    tips.push({
      id: entry.id,
      label: entry.label,
      interval: entry.interval,
      css,
      html,
    })
    console.log("imported", entry.id)
  }

  const body = `/**
 * Auto-generated by scripts/import-css-anims.mjs from css-animations-main.
 * Do not edit by hand — re-run the script if sources change.
 */
export type CssAnimTip = {
  id: string
  label: string
  /** 0 = no remount loop */
  interval: number
  css: string
  html: string
}

export const cssAnimTips: CssAnimTip[] = [
${tips
  .map(
    (t) => `  {
    id: ${JSON.stringify(t.id)},
    label: ${JSON.stringify(t.label)},
    interval: ${t.interval},
    css: \`${esc(t.css)}\`,
    html: \`${esc(t.html)}\`,
  }`
  )
  .join(",\n")}
]
`

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, body)
  console.log(`Wrote ${tips.length} tips → ${path.relative(root, outFile)}`)
}

main()
