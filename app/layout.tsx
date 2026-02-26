import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Vorqenox - Premium Apps, AI Tools & Digital Access",
  description:
    "Discover premium apps, games, AI tools, and digital access. Vorqenox is your luxury destination for the best digital products.",
  keywords: [
    "premium apps",
    "AI tools",
    "digital products",
    "Vorqenox",
    "tech reviews",
  ],
  openGraph: {
    title: "Vorqenox - Premium Digital Access",
    description:
      "Discover premium apps, games, AI tools, and digital access.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  )
}
