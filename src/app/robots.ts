import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site-metadata"

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  if (!base) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
