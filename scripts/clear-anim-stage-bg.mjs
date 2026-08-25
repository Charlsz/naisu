/**
 * Clear stage backgrounds on listed tips; fix corner overflow.
 * Safe: only mutates .container / html background-color.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const tipsPath = path.join(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  "src",
  "content",
  "css-anim-tips.ts"
)

const CLEAR_IDS = new Set([
  "anim-blocks",
  "anim-domino",
  "anim-panel",
  "anim-stack",
  "anim-shutter",
  "anim-curtain",
  "anim-lines",
  "anim-yarns",
  "anim-scroll",
  "anim-bricks",
  "anim-plus-minus",
  "anim-ripple",
  "anim-strike",
  "anim-frame",
  "anim-corner",
  "anim-dots",
  "anim-expand",
  "anim-compress",
  "anim-balance",
  "anim-download",
  "anim-clothes",
  "anim-split",
  "anim-headphone",
  "anim-heart-fill",
])

let src = fs.readFileSync(tipsPath, "utf8")

function patchTipCss(id, transform) {
  const idToken = `id: "${id}"`
  const start = src.indexOf(idToken)
  if (start < 0) {
    console.warn("missing", id)
    return
  }
  const cssKey = src.indexOf("css: `", start)
  const cssStart = cssKey + 6
  const cssEnd = src.indexOf("`,\n    html:", cssStart)
  if (cssEnd < 0) {
    console.warn("no css end", id)
    return
  }
  src =
    src.slice(0, cssStart) +
    transform(src.slice(cssStart, cssEnd)) +
    src.slice(cssEnd)
}

function clearStage(css) {
  return css
    .replace(
      /(\.container\s*\{[^}]*?)background-color:\s*#FDFDFC;/gis,
      "$1background-color: transparent;"
    )
    .replace(
      /(\.container\s*\{[^}]*?)background-color:\s*#f1f1f1;/gis,
      "$1background-color: transparent;"
    )
}

for (const id of CLEAR_IDS) {
  patchTipCss(id, clearStage)
}

patchTipCss("anim-corner", (css) => {
  let next = clearStage(css)
  next = next.replace(
    /overflow:\s*hidden\s*!important;/g,
    "overflow: visible !important;"
  )
  next = next.replace(
    /(:host,\s*\.naisu-css-anim-root\s*\{[^}]*?)overflow:\s*hidden;/s,
    "$1overflow: visible;"
  )
  if (!next.includes("scale(0.7)")) {
    next += `
.wrapper {
  transform: scale(0.7) !important;
  transform-origin: center center !important;
  justify-content: center !important;
  padding-left: 0 !important;
}
`
  }
  return next
})

fs.writeFileSync(tipsPath, src)
console.log("stage backgrounds cleared")
