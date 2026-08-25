import { JsonLd } from "@/components/json-ld"
import { leguanFontVariables } from "@/lib/fonts"
import { createSiteMetadata } from "@/lib/site-metadata"
import type { Viewport } from "next"

import "./globals.css"

export const metadata = createSiteMetadata()

export const viewport: Viewport = {
  themeColor: "#101411",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leguanFontVariables} dark h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-background">
        <JsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-squircle-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
