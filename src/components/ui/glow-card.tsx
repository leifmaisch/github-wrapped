import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

type GlowCardVariant = "default" | "primary" | "muted"

type GlowCardProps = React.ComponentProps<"div"> & {
  variant?: GlowCardVariant
}

const variantStyles: Record<GlowCardVariant, { surface: string; glow: boolean }> =
  {
    default: {
      surface: "border-border bg-card",
      glow: false,
    },
    primary: {
      surface: "border-primary/35 bg-primary/5",
      glow: true,
    },
    muted: {
      surface: "border-border bg-muted/40",
      glow: false,
    },
  }

function GlowCard({
  variant = "default",
  className,
  children,
  style,
  ...props
}: GlowCardProps) {
  const config = variantStyles[variant]

  return (
    <div
      data-slot="glow-card"
      data-variant={variant}
      style={{ ...squircle, ...style }}
      className={cn(
        "group/glow-card relative overflow-hidden rounded-squircle-lg border p-5",
        surfaceDepth("lg"),
        config.surface,
        className
      )}
      {...props}
    >
      {config.glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_100%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_65%)]"
        />
      ) : null}
      <div className="relative flex flex-col">{children}</div>
    </div>
  )
}

function GlowCardLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="glow-card-label"
      className={cn("text-label", className)}
      {...props}
    />
  )
}

function GlowCardTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="glow-card-title"
      className={cn("text-title group-has-[>[data-slot=glow-card-label]]/glow-card:mt-2", className)}
      {...props}
    />
  )
}

function GlowCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="glow-card-description"
      className={cn("mt-1 text-description", className)}
      {...props}
    />
  )
}

function GlowCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glow-card-action"
      className={cn("mt-4", className)}
      {...props}
    />
  )
}

export {
  GlowCard,
  GlowCardAction,
  GlowCardDescription,
  GlowCardLabel,
  GlowCardTitle,
}
