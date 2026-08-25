/**
 * Patch css-anim-tips.ts in place (keeps original formatting where possible).
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

const CLEAR_IDS = [
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
  "anim-balance",
  "anim-download",
  "anim-clothes",
  "anim-split",
  "anim-headphone",
  "anim-heart-fill",
]

let src = fs.readFileSync(tipsPath, "utf8")

function patchTipCss(id, transform) {
  const idToken = `id: "${id}"`
  const start = src.indexOf(idToken)
  if (start < 0) {
    console.warn("missing tip", id)
    return
  }
  const cssKey = src.indexOf("css: `", start)
  if (cssKey < 0) return
  const cssStart = cssKey + 6
  const cssEnd = src.indexOf("`,\n    html:", cssStart)
  if (cssEnd < 0) return
  const before = src.slice(0, cssStart)
  const css = src.slice(cssStart, cssEnd)
  const after = src.slice(cssEnd)
  src = before + transform(css) + after
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
    .replace(
      /(html\s*\{[^}]*?)background-color:\s*#FDFDFC;/gis,
      "$1background-color: transparent;"
    )
    .replace(
      /(html\s*\{[^}]*?)background-color:\s*#f1f1f1;/gis,
      "$1background-color: transparent;"
    )
}

for (const id of CLEAR_IDS) {
  patchTipCss(id, clearStage)
}

patchTipCss("anim-corner", (css) => {
  let next = clearStage(css)
  next = next.replace(/overflow:\s*hidden\s*!important;/g, "overflow: visible !important;")
  next = next.replace(
    /(:host,\s*\.naisu-css-anim-root\s*\{[^}]*?)overflow:\s*hidden;/s,
    "$1overflow: visible;"
  )
  next = next.replace(
    /(\.container\s*\{[^}]*?aspect-ratio:\s*1;[^}]*?)overflow:\s*hidden;/gs,
    "$1overflow: visible;"
  )
  if (!next.includes("naisu-corner-fit")) {
    next += `
.wrapper.naisu-corner-fit, .wrapper {
  transform: scale(0.7) !important;
  transform-origin: center center !important;
  justify-content: center !important;
  padding-left: 0 !important;
  align-items: center !important;
}
`
  }
  return next
})

// Split expand: replace dual-box html with expand-only, inject compress tip after
const expandId = 'id: "anim-expand"'
const expandStart = src.indexOf(expandId)
if (expandStart >= 0) {
  const htmlKey = src.indexOf("html: `", expandStart)
  const htmlStart = htmlKey + 7
  const htmlEnd = src.indexOf("`,\n  }", htmlStart)
  const oldHtml = src.slice(htmlStart, htmlEnd)

  const expandHtml = `<div class="container">
      <div class="wrapper" style="grid-template-columns: auto; column-gap: 0; transform: scale(1.55);">
        <div class="box">
          <div class="box__arrow-wrapper">
            <div class="arrow arrow--expand">
              <div class="arrow__sharp arrow__sharp--top"></div>
              <div class="arrow__sharp arrow__sharp--bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`

  // Keep original sharp class names from tip if different
  const sharpMatch = oldHtml.match(/arrow--expand[\s\S]*?<\/div>\s*<\/div>/)
  let expandInner = expandHtml
  if (sharpMatch) {
    expandInner = `<div class="container">
      <div class="wrapper" style="grid-template-columns: auto; column-gap: 0; transform: scale(1.55);">
        <div class="box">
          <div class="box__arrow-wrapper">
            ${sharpMatch[0]}
          </div>
        </div>
      </div>
    </div>`
  }

  const compressMatch = oldHtml.match(/arrow--compress[\s\S]*?<\/div>\s*<\/div>/)
  const compressInner = compressMatch
    ? `<div class="container">
      <div class="wrapper" style="grid-template-columns: auto; column-gap: 0; transform: scale(1.55);">
        <div class="box">
          <div class="box__arrow-wrapper">
            ${compressMatch[0]}
          </div>
        </div>
      </div>
    </div>`
    : expandInner

  src = src.slice(0, htmlStart) + expandInner + src.slice(htmlEnd)

  // Grab expand css for compress tip
  const cssKey = src.indexOf("css: `", expandStart)
  const cssStart = cssKey + 6
  const cssEnd = src.indexOf("`,\n    html:", cssStart)
  const expandCss = clearStage(src.slice(cssStart, cssEnd))

  const insertAt = src.indexOf("},\n  {\n    id: \"anim-balance\"")
  if (insertAt > 0 && !src.includes('id: "anim-compress"')) {
    const compressTip = `},
  {
    id: "anim-compress",
    label: "Compress",
    interval: 3600,
    css: \`${expandCss}\`,
    html: \`${compressInner}\`,
  `
    // replace the `},` before anim-balance
    src = src.slice(0, insertAt) + compressTip + src.slice(insertAt + 1)
  }
}

// Remove tissue tip block
const tissueStart = src.indexOf('id: "anim-tissue"')
if (tissueStart > 0) {
  // find start of object `{` before id
  let objStart = src.lastIndexOf("\n  {", tissueStart)
  let objEnd = src.indexOf("\n  },\n  {\n    id:", tissueStart)
  if (objEnd < 0) objEnd = src.indexOf("\n  },\n]", tissueStart)
  if (objStart >= 0 && objEnd > objStart) {
    src = src.slice(0, objStart) + src.slice(objEnd)
    console.log("removed anim-tissue")
  }
}

fs.writeFileSync(tipsPath, src)
console.log("patched tips")
