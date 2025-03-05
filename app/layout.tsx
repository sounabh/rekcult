import type React from "react"
import type { Metadata } from "next"
import { VT323 } from "next/font/google"
import "./globals.css"

// Load VT323 font
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
})

export const metadata: Metadata = {
  title: "Our Love Story | Retro 90s Love Site",
  description: "A retro 90s-themed website celebrating our love story",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={vt323.variable}>
      <body className={vt323.className}>{children}</body>
    </html>
  )
}

