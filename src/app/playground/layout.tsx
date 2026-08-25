import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Hands-on playground for naisu components, interactions, and web experiments.",
  alternates: {
    canonical: "/playground",
  },
  openGraph: {
    title: "Playground · naisu",
    description:
      "Hands-on playground for naisu components, interactions, and web experiments.",
    url: "/playground",
  },
  twitter: {
    title: "Playground · naisu",
    description:
      "Hands-on playground for naisu components, interactions, and web experiments.",
  },
}

export default function PlaygroundLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
