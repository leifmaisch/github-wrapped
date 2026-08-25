import { getSiteUrl, siteDescription, siteName } from "@/lib/site-metadata"

export function JsonLd() {
  const siteUrl = getSiteUrl()

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }}
    />
  )
}
