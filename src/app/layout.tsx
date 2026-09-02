import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
const siteName = "Naisu"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  applicationName: siteName,
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
    title: siteName,
    images: [
      {
        url: "/urlpreview.png?v=2",
        width: 1200,
        height: 630,
        alt: "Naisu",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    images: ["/urlpreview.png?v=2"],
  },
  other: {
    "theme-color": "#FDFDFC",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className={`${inter.className} min-h-full bg-background font-sans text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
