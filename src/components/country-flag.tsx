import { renderLocationFlag } from "@/lib/location-flag"
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
  return renderLocationFlag(location, {
    size,
    "aria-hidden": true,
    className: cn("shrink-0 rounded-sm", className),
  })
}
