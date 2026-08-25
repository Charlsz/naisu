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

  // Production custom domain
  return "https://naisu.charlsz.tech"
}

const siteUrl = resolveSiteUrl()

const title = "naisu"
const description =
  "UI components. Small, expressive pieces you can drop into any project."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · naisu",
  },
  description,
  applicationName: "naisu",
  keywords: [
    "UI components",
    "motion",
    "Next.js",
    "React",
    "copy paste",
    "animation",
  ],
  authors: [{ name: "naisu" }],
  creator: "naisu",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/naisu.ico", type: "image/x-icon" },
      { url: "/naisu.png", type: "image/png" },
    ],
    apple: [{ url: "/naisu.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "naisu",
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "naisu · motion UI components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FDFDFC] font-sans text-[#111111]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
