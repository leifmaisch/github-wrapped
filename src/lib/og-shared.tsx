export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = "image/png"

export const ogColors = {
  background: "#141414",
  foreground: "#fafafa",
  muted: "#a3a3a3",
  primary: "#6ee7b7",
  primaryForeground: "#141414",
  border: "rgba(255, 255, 255, 0.12)",
  card: "rgba(255, 255, 255, 0.04)",
  accent: "#8b5cf6",
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
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(110, 231, 183, 0.12), transparent 70%)",
      }}
    />
  )
}
