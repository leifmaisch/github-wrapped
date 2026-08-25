import { cva, type VariantProps } from "class-variance-authority"

import { dottedBorder, skeletonDottedFill } from "@/lib/dot-pattern"
import { cn } from "@/lib/utils"

const skeletonVariants = cva("relative overflow-hidden rounded-squircle-sm", {
  variants: {
    variant: {
      solid: "animate-pulse bg-muted",
      dotted: cn("animate-pulse", dottedBorder, skeletonDottedFill),
      shimmer:
        "bg-muted bg-[linear-gradient(90deg,var(--muted)_0%,color-mix(in_oklab,var(--foreground)_10%,var(--muted))_50%,var(--muted)_100%)] bg-[length:200%_100%] animate-skeleton-shimmer",
    },
  },
  defaultVariants: {
    variant: "solid",
  },
})

function Skeleton({
  className,
  variant = "solid",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      data-variant={variant}
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
