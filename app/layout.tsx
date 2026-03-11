import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/context/ThemeContext"

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: "Planner AI",
  description: "An intelligent, minimalist agenda manager.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Planner AI",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${dmSans.className} bg-[#F5F5F7] dark:bg-black text-[#111111] dark:text-[#F2F2F7] antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
