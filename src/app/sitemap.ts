import type { MetadataRoute } from "next"

function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (explicit) return explicit

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    ""
  )
  if (production) {
    return production.startsWith("http")
      ? production
      : `https://${production}`
  }

  return "https://naisu.charlsz.tech"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const now = new Date()

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
