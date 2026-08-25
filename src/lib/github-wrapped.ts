import "server-only"

import type {
  LanguageStat,
  MonthlyActivity,
  TopRepo,
  WrappedProfile,
  WrappedResult,
  WrappedStats,
} from "@/lib/wrapped-types"
import type { ContributionDay } from "@/lib/wrapped-types"
import {
  computeAvgPerActiveDay,
  computeBestDay,
  computeBusiestWeek,
  computeContributionPercentile,
  computeDeveloperTitle,
} from "@/lib/wrapped-insights"
import {
  fetchCollaborationStats,
  fetchStarGrowth,
  formatMemberSince,
} from "@/lib/github-social"

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  Ruby: "#701516",
  PHP: "#4f5d95",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00b4ab",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#dc322f",
  R: "#198ce7",
  Lua: "#000080",
  Zig: "#f7a41d",
}

type GitHubUser = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  html_url: string
  created_at: string
  public_repos: number
  followers: number
  following: number
  location: string | null
  company: string | null
  type: string
}

type GitHubRepo = {
  name: string
  full_name: string
  stargazers_count: number
  forks_count: number
  language: string | null
  description: string | null
  pushed_at: string
  size: number
}

type ContributionCalendar = {
  totalContributions: number
  weeks: Array<{ contributionDays: ContributionDay[] }>
}

function getWrappedYear() {
  const configured = process.env.WRAPPED_YEAR
  if (configured) {
    const year = Number.parseInt(configured, 10)
    if (!Number.isNaN(year)) return year
  }
  return new Date().getFullYear()
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "GitWrap/1.0",
  }

  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: 3600 },
  })

  if (response.status === 404) {
    throw new Error("GitHub user not found")
  }

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit reached. Try again later.")
    }
    throw new Error("Unable to fetch GitHub data")
  }

  return response.json() as Promise<T>
}

async function fetchUser(username: string): Promise<GitHubUser> {
  const normalized = username.trim().replace(/^@/, "").toLowerCase()
  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(normalized)) {
    throw new Error("Enter a valid GitHub username")
  }

  const user = await githubFetch<GitHubUser>(
    `https://api.github.com/users/${encodeURIComponent(normalized)}`
  )

  if (user.type !== "User") {
    throw new Error("Only personal GitHub accounts are supported")
  }

  return user
}

async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = []
  let page = 1

  while (page <= 3) {
    const batch = await githubFetch<GitHubRepo[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=pushed`
    )
    repos.push(...batch)
    if (batch.length < 100) break
    page += 1
  }

  return repos
}

async function fetchContributionCalendar(
  username: string,
  year: number
): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN
  if (token) {
    const fromGraphql = await fetchContributionCalendarGraphql(username, year)
    if (fromGraphql) return fromGraphql
  }

  return fetchContributionCalendarFromProfile(username, year)
}

async function fetchContributionCalendarGraphql(
  username: string,
  year: number
): Promise<ContributionCalendar | null> {
  const from = `${year}-01-01T00:00:00Z`
  const to = `${year}-12-31T23:59:59Z`

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login: username, from, to },
    }),
    next: { revalidate: 3600 },
  })

  if (!response.ok) return null

  const payload = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: ContributionCalendar
        }
      }
    }
  }

  return payload.data?.user?.contributionsCollection?.contributionCalendar ?? null
}

function parseContributionTooltip(text: string) {
  if (text.startsWith("No contributions")) return 0
  const match = text.match(/^([\d,]+)\s+contributions?\s+on/i)
  if (!match) return 0
  return Number.parseInt(match[1].replace(/,/g, ""), 10)
}

async function fetchContributionCalendarFromProfile(
  username: string,
  year: number
): Promise<ContributionCalendar | null> {
  const today = new Date()
  const isCurrentYear = year === today.getUTCFullYear()
  const to = isCurrentYear
    ? today.toISOString().slice(0, 10)
    : `${year}-12-31`
  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${to}`

  const response = await fetch(url, {
    headers: {
      "User-Agent": "GitWrap/1.0",
      Accept: "text/html",
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) return null

  const html = await response.text()
  const tooltipRegex =
    /for="(contribution-day-component-[^"]+)"[^>]*>([^<]+)</g
  const dayRegex =
    /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]+)"/g

  const tooltips = new Map<string, string>()
  for (const match of html.matchAll(tooltipRegex)) {
    tooltips.set(match[1], match[2].trim())
  }

  const days: ContributionDay[] = []
  for (const match of html.matchAll(dayRegex)) {
    const date = match[1]
    const count = parseContributionTooltip(tooltips.get(match[2]) ?? "")
    days.push({ date, contributionCount: count })
  }

  if (days.length === 0) return null

  const totalMatch = html.match(
    /id="js-contribution-activity-description"[\s\S]*?>\s*([\d,]+)\s*contributions/i
  )
  const totalContributions = totalMatch
    ? Number.parseInt(totalMatch[1].replace(/,/g, ""), 10)
    : days.reduce((sum, day) => sum + day.contributionCount, 0)

  return {
    totalContributions,
    weeks: [{ contributionDays: days }],
  }
}

function flattenDays(calendar: ContributionCalendar) {
  return calendar.weeks.flatMap((week) => week.contributionDays)
}

function computeStreaks(days: ContributionDay[]) {
  let longestStreak = 0
  let currentStreak = 0
  let activeDays = 0

  for (const day of days) {
    if (day.contributionCount > 0) {
      activeDays += 1
      currentStreak += 1
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return { longestStreak, activeDays }
}

function computeMonthlyActivity(days: ContributionDay[], year: number): MonthlyActivity[] {
  const months = new Map<string, number>()
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })

  for (const day of days) {
    const date = new Date(`${day.date}T00:00:00Z`)
    if (date.getUTCFullYear() !== year) continue
    const key = formatter.format(date)
    months.set(key, (months.get(key) ?? 0) + day.contributionCount)
  }

  const order = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  return order.map((month) => ({
    month,
    contributions: months.get(month) ?? 0,
  }))
}

function computeTopLanguages(repos: GitHubRepo[]): LanguageStat[] {
  const totals = new Map<string, number>()

  for (const repo of repos) {
    if (!repo.language) continue
    totals.set(repo.language, (totals.get(repo.language) ?? 0) + Math.max(repo.size, 1))
  }

  const totalBytes = Array.from(totals.values()).reduce((sum, value) => sum + value, 0)
  if (totalBytes === 0) return []

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: LANGUAGE_COLORS[name] ?? "#a3a3a3",
    }))
}

function findTopRepo(repos: GitHubRepo[]): TopRepo | null {
  if (repos.length === 0) return null

  const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0]

  return {
    name: top.name,
    fullName: top.full_name,
    stars: top.stargazers_count,
    forks: top.forks_count,
    language: top.language,
    description: top.description,
  }
}

async function fetchEventCounts(username: string, year: number) {
  const yearStart = new Date(`${year}-01-01T00:00:00Z`).getTime()
  let pullRequests = 0
  let issues = 0
  let reviews = 0

  try {
    const events = await githubFetch<
      Array<{ type: string; created_at: string; payload?: { action?: string } }>
    >(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`
    )

    for (const event of events) {
      const created = new Date(event.created_at).getTime()
      if (created < yearStart) continue

      if (event.type === "PullRequestEvent") pullRequests += 1
      if (event.type === "IssuesEvent") issues += 1
      if (event.type === "PullRequestReviewEvent") reviews += 1
    }
  } catch {
    return { pullRequests: 0, issues: 0, reviews: 0 }
  }

  return { pullRequests, issues, reviews }
}

export async function generateWrapped(username: string): Promise<WrappedResult> {
  const year = getWrappedYear()
  const user = await fetchUser(username)
  const [repos, calendar, eventCounts, collaboration] = await Promise.all([
    fetchRepos(user.login),
    fetchContributionCalendar(user.login, year),
    fetchEventCounts(user.login, year),
    fetchCollaborationStats(user.login, year),
  ])
  const starGrowth = await fetchStarGrowth(repos, year)

  const days = calendar ? flattenDays(calendar) : []
  const streaks = calendar ? computeStreaks(days) : { longestStreak: 0, activeDays: 0 }
  const monthlyActivity = calendar
    ? computeMonthlyActivity(days, year)
    : Array.from({ length: 12 }, (_, index) => ({
        month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
          new Date(year, index, 1)
        ),
        contributions: 0,
      }))
  const totalContributions = calendar?.totalContributions ?? 0
  const avgPerActiveDay = computeAvgPerActiveDay(
    totalContributions,
    streaks.activeDays
  )
  const bestDay = calendar ? computeBestDay(days, year) : null
  const busiestWeek = calendar ? computeBusiestWeek(days, year) : null
  const contributionPercentile = computeContributionPercentile(totalContributions)

  const busiestMonth =
    monthlyActivity.length > 0
      ? [...monthlyActivity].sort((a, b) => b.contributions - a.contributions)[0]?.month ??
        null
      : null

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  const profile: WrappedProfile = {
    username: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    profileUrl: user.html_url,
    joinedAt: user.created_at,
    memberSince: formatMemberSince(user.created_at),
    location: user.location,
    company: user.company,
  }

  const topLanguages = computeTopLanguages(repos)

  const stats: WrappedStats = {
    totalContributions,
    longestStreak: streaks.longestStreak,
    activeDays: streaks.activeDays,
    avgPerActiveDay,
    bestDay,
    busiestWeek,
    contributionPercentile,
    developerTitle: computeDeveloperTitle({
      totalContributions,
      longestStreak: streaks.longestStreak,
      activeDays: streaks.activeDays,
      pullRequests: eventCounts.pullRequests,
      reviews: eventCounts.reviews,
      avgPerActiveDay,
      topLanguages,
    }),
    pullRequests: eventCounts.pullRequests,
    issues: eventCounts.issues,
    reviews: eventCounts.reviews,
    publicRepos: user.public_repos,
    totalStars,
    starGrowth,
    collaboration,
    followers: user.followers,
    following: user.following,
    topLanguages,
    monthlyActivity,
    topRepo: findTopRepo(repos),
    busiestMonth,
  }

  return {
    username: user.login,
    year,
    profile,
    stats,
    generatedAt: new Date().toISOString(),
  }
}
