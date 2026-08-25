import { getFlagIcon } from "@/lib/location-flag"
import { cn } from "@/lib/utils"

export function CountryFlag({
  location,
  className,
  size = 18,
}: {
  location: string
  className?: string
  size?: number
}) {
  const Icon = getFlagIcon(location)

  if (!Icon) return null

  return (
    <Icon
      size={size}
      aria-hidden
      className={cn("shrink-0 rounded-sm", className)}
    />
  )
}
