import type { Metadata } from "next"

import type { WrappedResult } from "@/lib/wrapped-types"

export const siteName = "GitWrap"

export const siteTagline = "Your year on GitHub"

export const siteDescription =
  "Generate a shareable recap of your GitHub activity. Commits, languages, streaks, and top repos in one card."

export const siteKeywords = [
  "github wrapped",
  "gitwrap",
  "github recap",
  "developer stats",
  "github year in review",
  "coding stats",
]

export function getSiteUrl() {
  return (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  )
}

function absoluteSiteUrl(path: string) {
  const siteUrl = getSiteUrl()
  if (!siteUrl) return path
  return new URL(path, siteUrl).href
}

export function createSiteMetadata(): Metadata {
  const siteUrl = getSiteUrl()

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: `${siteName} | ${siteTagline}`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    applicationName: siteName,
    keywords: siteKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    alternates: siteUrl ? { canonical: "/" } : undefined,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: `${siteName} | ${siteTagline}`,
      description: siteDescription,
      siteName,
      locale: "en_US",
      type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | ${siteTagline}`,
      description: siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function createWrapMetadata(): Metadata {
  const description = "Enter a GitHub username to generate your activity recap."

  return {
    title: "Generate your wrap",
    description,
    openGraph: {
      title: "Generate your wrap",
      description,
      url: "/wrap",
    },
    twitter: {
      title: "Generate your wrap",
      description,
    },
    alternates: getSiteUrl() ? { canonical: "/wrap" } : undefined,
  }
}

export function createSharedWrapMetadata(
  result: WrappedResult,
  shareId: string
): Metadata {
  const siteUrl = getSiteUrl()
  const title = `@${result.username} · ${result.year} wrap`
  const description = `${result.stats.totalContributions.toLocaleString()} contributions · ${result.stats.longestStreak}-day streak · top language ${result.stats.topLanguages[0]?.name ?? "—"}`
  const imageAlt = `@${result.username} GitHub ${result.year} wrap`
  const sharePath = `/r/${shareId}`
  const ogImagePath = `/r/${shareId}/opengraph-image`
  const twitterImagePath = `/r/${shareId}/twitter-image`

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title,
    description,
    openGraph: {
      title,
      description,
      url: sharePath,
      images: [
        {
          url: absoluteSiteUrl(ogImagePath),
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteSiteUrl(twitterImagePath)],
    },
    alternates: siteUrl ? { canonical: sharePath } : undefined,
  }
}
