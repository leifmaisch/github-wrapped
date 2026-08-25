import { squircle } from "@/lib/squircle"
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string
  change?: string
  positive?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  positive = true,
  className,
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      style={squircle}
      className={cn(
        "relative w-full rounded-squircle-card border border-black/[0.04] bg-muted/50 p-2 dark:border-inset-dark dark:bg-card",
        className
      )}
    >
      <div
        style={squircle}
        className="relative w-full overflow-hidden rounded-squircle-inner border border-black/[0.06] bg-neutral-950 p-4 dark:border-neutral-500/15 sm:p-5"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(color-mix(in_srgb,var(--primary)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_6%,transparent)_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <div className="relative flex flex-col">
          <p className="text-label text-neutral-400">{label}</p>
          <p className="text-stat-value mt-2 text-white">{value}</p>
          {change ? (
            <p
              className={cn(
                "text-caption text-numeric mt-1 font-mono",
                positive ? "text-primary" : "text-white/45"
              )}
            >
              {change}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
