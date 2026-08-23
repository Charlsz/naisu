import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naisu.vercel.app"

const title = "naisu — motion UI components"
const description =
  "Copy-paste motion UI components for Next.js. Small, expressive pieces you can drop into any project."

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
  icons: {
    icon: "/naisu_white.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "naisu",
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "naisu — motion UI components",
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
      </body>
    </html>
  )
}
