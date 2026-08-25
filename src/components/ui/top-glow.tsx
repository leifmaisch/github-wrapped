import { ctaTopGlowClass } from "@/lib/surface-glow"
import { cn } from "@/lib/utils"

function TopGlow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(840px,88vh)]",
        ctaTopGlowClass,
        className
      )}
      {...props}
    />
  )
}

export { TopGlow }
