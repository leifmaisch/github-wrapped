import type {
  BestDay,
  BusiestWeek,
  ContributionDay,
  WrappedStats,
} from "@/lib/wrapped-types"

const PERCENTILE_THRESHOLDS = [
  { min: 4000, percentile: 99 },
  { min: 2500, percentile: 97 },
  { min: 1500, percentile: 93 },
  { min: 1000, percentile: 88 },
  { min: 750, percentile: 82 },
  { min: 500, percentile: 75 },
  { min: 350, percentile: 68 },
  { min: 250, percentile: 60 },
  { min: 150, percentile: 50 },
  { min: 100, percentile: 42 },
  { min: 50, percentile: 30 },
  { min: 25, percentile: 20 },
  { min: 10, percentile: 12 },
  { min: 1, percentile: 5 },
] as const

function filterYearDays(days: ContributionDay[], year: number) {
  const prefix = `${year}-`
  return days.filter((day) => day.date.startsWith(prefix))
}

function getWeekStart(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00Z`)
  const sunday = new Date(date)
  sunday.setUTCDate(date.getUTCDate() - date.getUTCDay())
  return sunday.toISOString().slice(0, 10)
}

export function computeAvgPerActiveDay(
  totalContributions: number,
  activeDays: number
) {
  if (activeDays === 0) return 0
  return Math.round((totalContributions / activeDays) * 10) / 10
}

export function computeBestDay(
  days: ContributionDay[],
  year: number
): BestDay | null {
  const yearDays = filterYearDays(days, year)
  if (yearDays.length === 0) return null

  const best = yearDays.reduce((current, day) =>
    day.contributionCount > current.contributionCount ? day : current
  )

  if (best.contributionCount === 0) return null

  const date = new Date(`${best.date}T00:00:00Z`)
  const label = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)

  return {
    date: best.date,
    label,
    contributions: best.contributionCount,
  }
}

export function computeBusiestWeek(
  days: ContributionDay[],
  year: number
): BusiestWeek | null {
  const weeks = new Map<string, number>()

  for (const day of filterYearDays(days, year)) {
    const key = getWeekStart(day.date)
    weeks.set(key, (weeks.get(key) ?? 0) + day.contributionCount)
  }

  if (weeks.size === 0) return null

  const [weekStart, contributions] = [...weeks.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0]

  if (contributions === 0) return null

  const start = new Date(`${weekStart}T00:00:00Z`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 6)

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })

  return {
    weekStart,
    label: `${formatter.format(start)} – ${formatter.format(end)}`,
    contributions,
  }
}

export function computeContributionPercentile(totalContributions: number) {
  if (totalContributions <= 0) return 1

  for (const threshold of PERCENTILE_THRESHOLDS) {
    if (totalContributions >= threshold.min) {
      return threshold.percentile
    }
  }

  return 1
}

export function formatPercentileRank(percentile: number) {
  if (percentile >= 75) {
    return `Top ${100 - percentile}%`
  }

  const suffix =
    percentile % 10 === 1 && percentile !== 11
      ? "st"
      : percentile % 10 === 2 && percentile !== 12
        ? "nd"
        : percentile % 10 === 3 && percentile !== 13
          ? "rd"
          : "th"

  return `${percentile}${suffix} percentile`
}

export function computeDeveloperTitle(
  stats: Pick<
    WrappedStats,
    | "totalContributions"
    | "longestStreak"
    | "activeDays"
    | "pullRequests"
    | "reviews"
    | "avgPerActiveDay"
    | "topLanguages"
  >
) {
  const topLanguage = stats.topLanguages[0]?.name

  if (stats.longestStreak >= 60) return "Streak Keeper"
  if (stats.pullRequests >= 50 && stats.pullRequests > stats.reviews * 2) {
    return "PR Machine"
  }
  if (stats.reviews >= 30) return "Code Reviewer"
  if (stats.avgPerActiveDay >= 25) return "Commit Machine"
  if (stats.totalContributions >= 2000) return "Power Contributor"
  if (stats.activeDays >= 200) return "Daily Grinder"
  if (topLanguage === "TypeScript" || topLanguage === "JavaScript") {
    return "Web Crafter"
  }
  if (topLanguage === "Python") return "Pythonista"
  if (topLanguage === "Rust") return "Rustacean"
  if (stats.pullRequests >= 20) return "Collaborator"
  if (stats.totalContributions >= 500) return "Active Builder"
  if (stats.totalContributions >= 100) return "Steady Coder"
  if (stats.totalContributions > 0) return "Getting Started"
  return "Fresh Start"
}
