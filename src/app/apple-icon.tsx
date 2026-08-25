import { ImageResponse } from "next/og"

import { ogColors, ogFontFamily } from "@/lib/og-shared"
import { siteName } from "@/lib/site-metadata"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ogColors.background,
          fontFamily: ogFontFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            backgroundColor: "rgba(15, 191, 62, 0.12)",
            color: ogColors.primary,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {siteName.slice(0, 1)}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
