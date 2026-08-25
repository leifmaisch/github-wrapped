import { cn } from "@/lib/utils"
import type { MonthlyActivity } from "@/lib/wrapped-types"

type MonthlyActivityChartProps = {
  data: MonthlyActivity[]
  highlight?: string
  variant?: "results" | "story"
  className?: string
}

export function getPeakMonthEntry(data: MonthlyActivity[]) {
  if (data.length === 0) return null
  return [...data].sort((a, b) => b.contributions - a.contributions)[0]
}

export function MonthlyActivityChart({
  data,
  highlight,
  variant = "results",
  className,
}: MonthlyActivityChartProps) {
  const max = Math.max(...data.map((item) => item.contributions), 1)
  const isStory = variant === "story"

  return (
    <div
      className={cn(
        "flex min-w-0 gap-1 sm:gap-2",
        isStory ? "h-40 sm:h-44" : "h-44 min-w-[20rem] sm:min-w-0 sm:h-56",
        className
      )}
    >
      {data.map((item) => {
        const height =
          item.contributions === 0
            ? 0
            : Math.max(12, (item.contributions / max) * 100)
        const isPeak = highlight === item.month

        return (
          <div key={item.month} className="group flex min-w-0 flex-1 flex-col">
            <div className="relative flex flex-1 items-end">
              {!isStory && item.contributions > 0 ? (
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-squircle-sm border border-border bg-card px-2 py-1 text-caption text-foreground shadow-sm sm:group-hover:block">
                  {item.contributions.toLocaleString()} contributions
                </span>
              ) : null}
              <div
                className="flex w-full flex-col items-center justify-end"
                style={{ height: `${height}%` }}
              >
                {item.contributions > 0 ? (
                  <span
                    className={cn(
                      "mb-1 shrink-0 font-medium tabular-nums leading-none",
                      isStory
                        ? cn(
                            "text-[9px] sm:text-[10px]",
                            isPeak ? "text-white" : "text-white/75"
                          )
                        : "mb-1 text-[10px] font-medium text-muted-foreground tabular-nums transition-colors group-hover:text-foreground sm:text-caption"
                    )}
                  >
                    {item.contributions.toLocaleString()}
                  </span>
                ) : null}
                <div
                  className={cn(
                    "w-full min-h-[4px] flex-1 rounded-t-sm transition-colors",
                    isStory
                      ? isPeak
                        ? "bg-white"
                        : "bg-white/70 group-hover:bg-white/85"
                      : isPeak
                        ? "bg-primary group-hover:bg-primary"
                        : "bg-primary/80 group-hover:bg-primary"
                  )}
                />
              </div>
            </div>
            <span
              className={cn(
                "mt-2 shrink-0 text-center",
                isStory
                  ? cn(
                      "text-[10px] font-medium sm:text-xs",
                      isPeak ? "text-white" : "text-white/55"
                    )
                  : "text-[10px] sm:text-caption"
              )}
            >
              {item.month}
            </span>
          </div>
        )
      })}
    </div>
  )
}
