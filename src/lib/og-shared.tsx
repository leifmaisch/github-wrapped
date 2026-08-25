import { githubBrand } from "@/lib/github-brand"

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = "image/png"

export const ogColors = {
  background: githubBrand.gray6,
  foreground: githubBrand.gray1,
  muted: githubBrand.gray3,
  primary: githubBrand.green,
  primaryForeground: githubBrand.gray6,
  border: "rgba(182, 191, 184, 0.14)",
  card: githubBrand.gray5,
  accent: githubBrand.green3,
}

export const ogFontFamily = "ui-sans-serif, system-ui, sans-serif"

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

export function OgBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: ogImageSize.width,
        height: ogImageSize.height,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(15, 191, 62, 0.14), transparent 70%)",
      }}
    />
  )
}
