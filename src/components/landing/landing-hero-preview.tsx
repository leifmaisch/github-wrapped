"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DeveloperTitle } from "@/components/wrapped/developer-title"
import { MetalHeroCard } from "@/components/wrapped/metal-hero-card"
import { squircle } from "@/lib/squircle"

const preview = {
  name: "Alex Kim",
  username: "alexkim",
  avatarUrl: "https://github.com/octocat.png",
  developerTitle: "Power Contributor",
  percentile: 97,
  contributions: 2644,
  percentileLabel: "Top 3%",
  stats: [
    { label: "Longest streak", value: "42d" },
    { label: "Active days", value: "179" },
    { label: "Avg per day", value: "14.8" },
    { label: "Pull requests", value: "28" },
  ],
  chart: [32, 48, 41, 62, 55, 78, 71, 58, 84, 49, 73, 91],
}

function formatNumber(value: number) {
  return value.toLocaleString()
}

export function LandingHeroPreview() {
  const year = new Date().getFullYear()

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-6 md:p-8">
      <MetalHeroCard percentile={preview.percentile} className="max-w-md">
        <div
          style={squircle}
          className="w-full overflow-hidden rounded-squircle-lg"
        >
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-12 ring-2 ring-primary/30">
                  <AvatarImage src={preview.avatarUrl} alt={preview.name} />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-heading text-heading">{preview.name}</p>
                  <DeveloperTitle
                    title={preview.developerTitle}
                    percentile={preview.percentile}
                    className="mt-0.5 text-sm"
                  />
                  <p className="mt-0.5 truncate text-caption">
                    @{preview.username} · {year} wrap
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-stat-value text-primary">
                  {formatNumber(preview.contributions)}
                </p>
                <p className="text-caption">contributions</p>
                <Badge className="mt-1.5" variant="outline">
                  {preview.percentileLabel}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {preview.stats.map((stat) => (
                <div
                  key={stat.label}
                  style={squircle}
                  className="rounded-squircle-sm border border-border/60 bg-background/40 px-3 py-2.5"
                >
                  <p className="text-label">{stat.label}</p>
                  <p className="text-stat-value mt-1 text-sm">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex h-16 items-end gap-1">
              {preview.chart.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-sm bg-primary/75"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </MetalHeroCard>
    </div>
  )
}
