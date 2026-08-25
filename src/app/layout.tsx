import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

function resolveSiteUrl() {
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

  const preview = process.env.VERCEL_URL?.replace(/\/$/, "")
  if (preview) {
    return preview.startsWith("http") ? preview : `https://${preview}`
  }

  return "https://naisu.charlsz.tech"
}

const siteUrl = resolveSiteUrl()

const siteName = "naisu"
const title = {
  default: "naisu · UI components, interactions & experiments",
  template: "%s · naisu",
}
const description =
  "A growing collection of components, interactions, and experiments for the web."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: siteName,
  keywords: [
    "naisu",
    "UI components",
    "React components",
    "Next.js components",
    "motion UI",
    "interaction design",
    "web experiments",
    "copy paste components",
    "animation",
    "Framer Motion",
    "frontend",
    "design engineering",
  ],
  authors: [{ name: "naisu", url: siteUrl }],
  creator: "naisu",
  publisher: "naisu",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/naisu.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
    ],
    shortcut: "/naisu.ico",
    apple: [{ url: "/naisu.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: title.default,
    description,
    images: [
      {
        // ?v= busts crawler caches when the asset is recompressed in place.
        url: "/urlpreview.png?v=2",
        width: 1200,
        height: 630,
        alt: "naisu — components, interactions, and experiments for the web",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title.default,
    description,
    images: ["/urlpreview.png?v=2"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "theme-color": "#FDFDFC",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/naisu.png`,
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: title.default,
      description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: {
        "@type": "SoftwareApplication",
        name: siteName,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FDFDFC] font-sans text-[#111111]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
