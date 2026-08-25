/**
 * Sync brand assets into the places Next.js and the site actually serve.
 *
 * Edit only:
 *   brand/mark.png  → favicon, apple icon, in-app mark (/naisu.png)
 *   brand/og.png    → link previews (Open Graph + Twitter)
 *
 * Then run: npm run sync-brand
 * (also runs automatically on npm run dev / prebuild)
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const brandDir = path.join(root, "brand")
const markSrc = path.join(brandDir, "mark.png")
const ogSrc = path.join(brandDir, "og.png")

function ensure(file, label) {
  if (!fs.existsSync(file)) {
    console.error(`Missing ${label}: ${path.relative(root, file)}`)
    process.exit(1)
  }
}

ensure(markSrc, "brand mark")
ensure(ogSrc, "brand og image")

function write(dest, buf) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, buf)
}

/** Build a multi-size ICO that embeds PNG payloads (works on Windows). */
function encodeIco(pngBuffers, sizes) {
  const count = pngBuffers.length
  const headerSize = 6
  const entrySize = 16
  let offset = headerSize + entrySize * count
  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)

  const entries = []
  for (let i = 0; i < count; i++) {
    const size = sizes[i]
    const data = pngBuffers[i]
    const entry = Buffer.alloc(entrySize)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    entries.push(entry)
  }

  return Buffer.concat([header, ...entries, ...pngBuffers])
}

async function squarePng(input, size) {
  return sharp(input)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png()
    .toBuffer()
}

async function ogPng(input) {
  return sharp(input)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .png()
    .toBuffer()
}

async function main() {
  const icoSizes = [16, 32, 48]
  const icoPngs = await Promise.all(icoSizes.map((s) => squarePng(markSrc, s)))
  const ico = encodeIco(icoPngs, icoSizes)
  const icon = await squarePng(markSrc, 256)
  const apple = await squarePng(markSrc, 180)
  const markPublic = await sharp(markSrc).png().toBuffer()
  const og = await ogPng(ogSrc)

  write(path.join(root, "src/app/favicon.ico"), ico)
  write(path.join(root, "public/naisu.ico"), ico)
  write(path.join(root, "src/app/icon.png"), icon)
  write(path.join(root, "src/app/apple-icon.png"), apple)
  write(path.join(root, "public/naisu.png"), markPublic)
  // App Router file conventions → hashed URLs (busts social crawler caches)
  write(path.join(root, "src/app/opengraph-image.png"), og)
  write(path.join(root, "src/app/twitter-image.png"), og)
  write(path.join(root, "public/og.png"), og)

  const alt = "naisu · motion UI components\n"
  fs.writeFileSync(path.join(root, "src/app/opengraph-image.alt.txt"), alt)
  fs.writeFileSync(path.join(root, "src/app/twitter-image.alt.txt"), alt)

  console.log(
    "Synced brand → favicon, icons, /naisu.png, opengraph-image, twitter-image, /og.png"
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
