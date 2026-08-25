import { siteName } from "@/lib/site-metadata"

export function SiteLogo() {
  return (
    <img
      src="/logo.png"
      alt=""
      width={32}
      height={32}
      className="size-8 shrink-0 rounded-squircle-md"
    />
  )
}

export function SiteLogoWithName() {
  return (
    <span className="flex items-center gap-2">
      <SiteLogo />
      <span className="font-heading text-sm font-semibold">{siteName}</span>
    </span>
  )
}
