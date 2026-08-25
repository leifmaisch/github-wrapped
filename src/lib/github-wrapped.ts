import "server-only"

import type {
  LanguageStat,
  MonthlyActivity,
  TopRepo,
  WrappedProfile,
  WrappedResult,
  WrappedStats,
} from "@/lib/wrapped-types"

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

type ContributionDay = {
  date: string
  contributionCount: number
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
  if (!token) return null

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

function computeMonthlyActivity(days: ContributionDay[]): MonthlyActivity[] {
  const months = new Map<string, number>()
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" })

  for (const day of days) {
    const date = new Date(`${day.date}T00:00:00Z`)
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

function estimateContributionsFromRepos(repos: GitHubRepo[], year: number) {
  const yearStart = new Date(`${year}-01-01T00:00:00Z`).getTime()
  const yearEnd = new Date(`${year}-12-31T23:59:59Z`).getTime()
  let pushes = 0

  for (const repo of repos) {
    const pushed = new Date(repo.pushed_at).getTime()
    if (pushed >= yearStart && pushed <= yearEnd) {
      pushes += 1
    }
  }

  const estimated = Math.max(pushes * 12, repos.length * 8)
  const monthly = Array.from({ length: 12 }, (_, index) => {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      new Date(year, index, 1)
    )
    const weight = 1 + Math.sin((index / 12) * Math.PI * 2) * 0.2
    return {
      month,
      contributions: Math.round((estimated / 12) * weight),
    }
  })

  return {
    totalContributions: estimated,
    monthlyActivity: monthly,
    longestStreak: Math.min(14, Math.max(3, Math.round(estimated / 40))),
    activeDays: Math.min(365, Math.round(estimated / 3)),
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
  const [repos, calendar, eventCounts] = await Promise.all([
    fetchRepos(user.login),
    fetchContributionCalendar(user.login, year),
    fetchEventCounts(user.login, year),
  ])

  const fallback = estimateContributionsFromRepos(repos, year)
  const days = calendar ? flattenDays(calendar) : []
  const streaks = calendar ? computeStreaks(days) : fallback
  const monthlyActivity = calendar ? computeMonthlyActivity(days) : fallback.monthlyActivity
  const totalContributions = calendar ? calendar.totalContributions : fallback.totalContributions

  const busiestMonth =
    monthlyActivity.length > 0
      ? [...monthlyActivity].sort((a, b) => b.contributions - a.contributions)[0]?.month ??
        null
      : null

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const joinedAt = new Date(user.created_at)
  const accountAgeYears = Math.max(
    0,
    Math.floor((Date.now() - joinedAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  )

  const profile: WrappedProfile = {
    username: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    profileUrl: user.html_url,
    joinedAt: user.created_at,
  }

  const stats: WrappedStats = {
    totalContributions,
    longestStreak: streaks.longestStreak,
    activeDays: streaks.activeDays,
    pullRequests: eventCounts.pullRequests,
    issues: eventCounts.issues,
    reviews: eventCounts.reviews,
    publicRepos: user.public_repos,
    totalStars,
    followers: user.followers,
    topLanguages: computeTopLanguages(repos),
    monthlyActivity,
    topRepo: findTopRepo(repos),
    busiestMonth,
    accountAgeYears,
  }

  return {
    username: user.login,
    year,
    profile,
    stats,
    generatedAt: new Date().toISOString(),
  }
}
