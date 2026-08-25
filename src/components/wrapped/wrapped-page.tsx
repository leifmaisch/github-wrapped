"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  BuildingsIcon,
  CopyIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  StarIcon,
  TrendUpIcon,
  UsersIcon,
} from "@phosphor-icons/react"

import { CountryFlag } from "@/components/country-flag"
import { iconWeight } from "@/components/shared"
import { SiteNavbar } from "@/components/site-navbar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/ui/glow-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { StatCard } from "@/components/ui/stat-card"
import { TopGlow } from "@/components/ui/top-glow"
import { formatPercentileRank } from "@/lib/wrapped-insights"
import type { WrappedResult } from "@/lib/wrapped-types"

function formatNumber(value: number) {
  return value.toLocaleString()
}

function ShareBar({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false)
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${shareId}`
      : `/r/${shareId}`

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3 rounded-squircle-lg border border-border/60 bg-card/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-label">Share link</p>
        <p className="truncate text-body text-foreground">{shareUrl}</p>
      </div>
      <Button variant="outline" onClick={copyLink}>
        <CopyIcon weight={iconWeight} className="size-4" />
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  )
}

export function WrappedResults({ result }: { result: WrappedResult }) {
  const { profile, stats, year } = result
  const chartData = stats.monthlyActivity
  const maxMonth = Math.max(...chartData.map((item) => item.contributions), 1)
  const developerTitle = stats.developerTitle ?? "Developer"
  const percentileRank = formatPercentileRank(stats.contributionPercentile ?? 1)
  const avgPerActiveDay = stats.avgPerActiveDay ?? 0

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <GlowCard className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 ring-2 ring-primary/30">
                <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-heading-xl font-heading">
                    {profile.name ?? `@${profile.username}`}
                  </h1>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open @${profile.username} on GitHub`}
                    className="inline-flex shrink-0 items-center justify-center rounded-squircle-sm p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    <ArrowSquareOutIcon weight={iconWeight} className="size-4" />
                  </a>
                  <Badge variant="secondary">{developerTitle}</Badge>
                </div>
                <p className="text-description">
                  @{profile.username} · {year} wrap
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-stat-value text-primary">
                {formatNumber(stats.totalContributions)}
              </p>
              <p className="text-caption">contributions</p>
              {stats.totalContributions > 0 ? (
                <Badge className="mt-2" variant="outline">
                  {percentileRank}
                </Badge>
              ) : null}
            </div>
          </div>

          {profile.bio ? (
            <p className="max-w-2xl text-lede text-muted-foreground">{profile.bio}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Longest streak" value={`${stats.longestStreak}d`} />
            <StatCard label="Active days" value={String(stats.activeDays)} />
            <StatCard
              label="Avg per active day"
              value={avgPerActiveDay.toLocaleString()}
            />
            <StatCard
              label="Best day"
              value={stats.bestDay ? String(stats.bestDay.contributions) : "—"}
              change={stats.bestDay?.label}
              positive={Boolean(stats.bestDay)}
            />
            <StatCard
              label="Busiest week"
              value={
                stats.busiestWeek
                  ? formatNumber(stats.busiestWeek.contributions)
                  : "—"
              }
              change={stats.busiestWeek?.label}
              positive={Boolean(stats.busiestWeek)}
            />
            <StatCard label="Pull requests" value={String(stats.pullRequests)} />
          </div>
        </div>
      </GlowCard>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="surface-panel flex flex-col gap-5 p-6 lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-heading-lg">Monthly activity</h2>
              <p className="text-caption">
                {stats.busiestWeek
                  ? `Peak week: ${stats.busiestWeek.label}`
                  : stats.busiestMonth
                    ? `Peak month: ${stats.busiestMonth}`
                    : "Contributions by month"}
              </p>
            </div>
          </div>
          <div className="flex h-56 gap-2">
            {chartData.map((item) => {
              const height =
                item.contributions === 0
                  ? 0
                  : Math.max(12, (item.contributions / maxMonth) * 100)

              return (
                <div
                  key={item.month}
                  className="group flex min-w-0 flex-1 flex-col"
                >
                  <div className="relative flex flex-1 items-end">
                    {item.contributions > 0 ? (
                      <span className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-squircle-sm border border-border bg-card px-2 py-1 text-caption text-foreground shadow-sm group-hover:block">
                        {item.contributions.toLocaleString()} contributions
                      </span>
                    ) : null}
                    <div
                      className="flex w-full flex-col items-center justify-end"
                      style={{ height: `${height}%` }}
                    >
                      {item.contributions > 0 ? (
                        <span className="mb-1 text-[10px] font-medium text-muted-foreground tabular-nums transition-colors group-hover:text-foreground sm:text-caption">
                          {item.contributions.toLocaleString()}
                        </span>
                      ) : null}
                      <div className="w-full flex-1 rounded-t-sm bg-primary/80 transition-colors group-hover:bg-primary" />
                    </div>
                  </div>
                  <span className="mt-2 shrink-0 text-center text-caption">
                    {item.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="surface-panel flex flex-col gap-5 p-6 lg:col-span-2">
          <div>
            <h2 className="text-heading-lg">Top languages</h2>
            <p className="text-caption">By repo size</p>
          </div>
          <div className="flex flex-col gap-4">
            {stats.topLanguages.length > 0 ? (
              stats.topLanguages.map((language) => (
                <div key={language.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: language.color }}
                      />
                      <span className="text-body">{language.name}</span>
                    </div>
                    <span className="text-caption text-numeric">{language.percentage}%</span>
                  </div>
                  <Progress value={language.percentage}>
                    <ProgressLabel className="sr-only">{language.name}</ProgressLabel>
                  </Progress>
                </div>
              ))
            ) : (
              <p className="text-description">No language data available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-panel flex flex-col gap-5 p-6">
          <div>
            <h2 className="text-heading-lg">Profile</h2>
            <p className="text-caption">{profile.memberSince ?? "Public account"}</p>
          </div>

          {profile.location || profile.company ? (
            <div className="flex flex-col gap-2">
              {profile.location ? (
                <div className="flex items-center gap-2 text-body text-muted-foreground">
                  <CountryFlag location={profile.location} size={18} />
                  <span>{profile.location}</span>
                </div>
              ) : null}
              {profile.company ? (
                <div className="flex items-center gap-2 text-body text-muted-foreground">
                  <BuildingsIcon weight={iconWeight} className="size-4 shrink-0" />
                  <span>{profile.company}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <GitBranchIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Repos</span>
              </div>
              <p className="text-stat-value">{stats.publicRepos}</p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <StarIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Total stars</span>
              </div>
              <p className="text-stat-value">{formatNumber(stats.totalStars)}</p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <TrendUpIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Stars in {year}</span>
              </div>
              <p className="text-stat-value">
                {formatNumber(stats.starGrowth?.gainedThisYear ?? 0)}
              </p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <UsersIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Followers</span>
              </div>
              <p className="text-stat-value">{formatNumber(stats.followers)}</p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <UsersIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Following</span>
              </div>
              <p className="text-stat-value">{formatNumber(stats.following ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="surface-panel flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-heading-lg">Collaboration</h2>
              <p className="text-caption">Work beyond your own repos</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <GitBranchIcon weight={iconWeight} className="size-4" />
                  <span className="text-label">External repos</span>
                </div>
                <p className="text-stat-value">
                  {stats.collaboration?.externalRepos ?? 0}
                </p>
                <p className="mt-1 text-caption">Contributed to in {year}</p>
              </div>
              <div className="rounded-squircle-md border border-border/60 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <GitPullRequestIcon weight={iconWeight} className="size-4" />
                  <span className="text-label">Collaborated PRs</span>
                </div>
                <p className="text-stat-value">
                  {stats.collaboration?.coAuthoredPullRequests ?? 0}
                </p>
                <p className="mt-1 text-caption">PRs you did not author</p>
              </div>
            </div>
          </div>

          {stats.topRepo ? (
            <div className="surface-panel flex flex-col gap-5 p-6">
              <div>
                <h2 className="text-heading-lg">Top repository</h2>
                <p className="text-caption">Most starred public repo</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{stats.topRepo.fullName}</Badge>
                  {stats.topRepo.language ? (
                    <Badge variant="outline">{stats.topRepo.language}</Badge>
                  ) : null}
                </div>
                {stats.topRepo.description ? (
                  <p className="text-body text-muted-foreground">{stats.topRepo.description}</p>
                ) : null}
                <div className="flex gap-4 text-caption">
                  <span>{formatNumber(stats.topRepo.stars)} stars</span>
                  <span>{formatNumber(stats.topRepo.forks)} forks</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {result.shareId ? <ShareBar shareId={result.shareId} /> : null}
    </div>
  )
}

export function WrapPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/wrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      const payload = (await response.json()) as WrappedResult & { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to generate wrap")
      }

      router.push(`/r/${payload.shareId}`)
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to generate wrap"
      )
      setLoading(false)
    }
  }

  return (
    <div className="relative isolate min-h-full">
      <TopGlow />
      <SiteNavbar />
      <main id="main-content" className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-16 sm:py-24">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-heading-xl font-heading sm:text-display">Generate your wrap</h1>
          <p className="text-description">
            Enter your GitHub username to build a shareable recap.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="surface-panel flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">GitHub username</Label>
            <Input
              id="username"
              name="username"
              placeholder="octocat"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" size="lg" disabled={loading || !username.trim()}>
            {loading ? "Generating..." : "Generate wrap"}
            {!loading ? <ArrowRightIcon weight={iconWeight} className="size-4" /> : null}
          </Button>
        </form>
      </main>
    </div>
  )
}

export function SharedWrappedPage({ result }: { result: WrappedResult }) {
  return (
    <div className="relative isolate min-h-full">
      <TopGlow />
      <SiteNavbar />
      <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        <WrappedResults result={result} />
        <div className="mt-10 flex justify-center">
          <Button variant="outline" render={<Link href="/wrap" />}>
            Generate yours
          </Button>
        </div>
      </main>
    </div>
  )
}
