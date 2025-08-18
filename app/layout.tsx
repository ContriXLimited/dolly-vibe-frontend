import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono as GeistMono } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/providers/web3-provider"
import { Toaster } from "sonner"

const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dolly Vibe Dashboard",
  description: "Dolly Vibe community engagement and analytics platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistMono.className} bg-black text-white antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
        <Toaster theme="dark" />
      </body>
    </html>
  )
}
