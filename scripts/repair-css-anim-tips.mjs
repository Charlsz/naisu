/**
 * Repair broken css-anim-tips.ts after a bad patch, then apply safe fixes.
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

let src = fs.readFileSync(tipsPath, "utf8")

// Fix mangled expand / compress open tags
src = src.replace(
  /box__arrow-wrapper">\s*arrow--expand">/g,
  `box__arrow-wrapper">
            <div class="arrow arrow--expand">`
)
src = src.replace(
  /box__arrow-wrapper">\s*arrow--compress">/g,
  `box__arrow-wrapper">
            <div class="arrow arrow--compress">`
)

// Fix `  ,` before next tip object
src = src.replace(/\n  ,\n  \{/g, "\n  },\n  {")

// Remove duplicate closing braces left by tissue deletion
src = src.replace(/\n  \},\n  \},\n  \{/g, "\n  },\n  {")

// If tissue remnant label exists without proper structure, strip orphan blocks
if (src.includes('id: "anim-tissue"')) {
  console.log("tissue still present — leaving")
}

fs.writeFileSync(tipsPath, src)

// Validate by counting braces in tips array roughly
const open = (src.match(/\{/g) || []).length
const close = (src.match(/\}/g) || []).length
console.log("brace count {", open, "} ", close)

// Try parse tip ids
const ids = [...src.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1])
console.log("ids", ids.length, ids.includes("anim-compress"), ids.includes("anim-expand"))
