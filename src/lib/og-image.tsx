import { ImageResponse } from "next/og"

import {
  OgBackground,
  ogColors,
  ogFontFamily,
  ogImageSize,
} from "@/lib/og-shared"
import { siteName, siteTagline } from "@/lib/site-metadata"

export const ogImageAlt = `${siteName} | ${siteTagline}`

export { ogImageContentType, ogImageSize } from "@/lib/og-shared"

export async function createOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: ogColors.background,
          padding: "72px 80px",
          fontFamily: ogFontFamily,
        }}
      >
        <OgBackground />

        <span
          style={{
            position: "relative",
            fontSize: 52,
            fontWeight: 600,
            color: ogColors.primary,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {siteName}
        </span>

        <p
          style={{
            position: "relative",
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.15,
            color: ogColors.foreground,
            letterSpacing: "-0.03em",
            maxWidth: 760,
          }}
        >
          {siteTagline}
        </p>

        <p
          style={{
            position: "relative",
            marginTop: 24,
            fontSize: 26,
            lineHeight: 1.45,
            color: ogColors.muted,
            maxWidth: 720,
          }}
        >
          Commits, languages, streaks, and top repos in one shareable card.
        </p>
      </div>
    ),
    {
      ...ogImageSize,
    }
  )
}
