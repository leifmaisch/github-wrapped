import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr"

import { iconWeight } from "@/components/shared"
import { siteName } from "@/lib/site-metadata"

export function SiteLogo() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-squircle-md bg-primary/10 text-primary">
      <GithubLogoIcon weight={iconWeight} className="size-5" />
    </span>
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
