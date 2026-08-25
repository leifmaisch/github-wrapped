import { getMetalPreset } from "@/lib/metal-preset"
import { cn } from "@/lib/utils"

const titleStyles = {
  gold: "text-primary",
  chromatic:
    "bg-[linear-gradient(90deg,var(--primary),#8cf2a6,#5fed83)] bg-clip-text text-transparent",
  silver: "text-muted-foreground",
} as const

export function DeveloperTitle({
  title,
  percentile,
  className,
}: {
  title: string
  percentile: number
  className?: string
}) {
  const tier = getMetalPreset(percentile)

  return (
    <p
      className={cn(
        "font-heading text-heading tracking-tight break-words",
        titleStyles[tier],
        className
      )}
    >
      {title}
    </p>
  )
}
