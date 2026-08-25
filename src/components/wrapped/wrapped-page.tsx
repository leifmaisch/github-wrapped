"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
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
import { DeveloperTitle } from "@/components/wrapped/developer-title"
import { TopRepoCard } from "@/components/wrapped/top-repo-card"
import { WrapStory, wrapStoryPendingKey } from "@/components/wrapped/wrap-story"
import { iconWeight } from "@/components/shared"
import { SiteNavbar } from "@/components/site-navbar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetalHeroCard } from "@/components/wrapped/metal-hero-card"
import {
  getPeakMonthEntry,
  MonthlyActivityChart,
} from "@/components/wrapped/monthly-activity-chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { StatCard } from "@/components/ui/stat-card"
import { TopGlow } from "@/components/ui/top-glow"
import { formatPercentileRank } from "@/lib/wrapped-insights"
import { squircle } from "@/lib/squircle"
import type { WrappedResult } from "@/lib/wrapped-types"

function formatNumber(value: number) {
  return value.toLocaleString()
}

function ShareBar({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const sharePath = `/r/${shareId}`

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      window.location.origin
    setShareUrl(`${base}${sharePath}`)
  }, [sharePath])

  async function copyLink() {
    const url =
      shareUrl ??
      `${window.location.origin}${sharePath}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3 rounded-squircle-lg border border-border/60 bg-card/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-label">Share link</p>
        <p className="break-all text-body text-foreground">{shareUrl ?? sharePath}</p>
      </div>
      <Button className="min-h-11 w-full sm:w-auto" size="lg" variant="outline" onClick={copyLink}>
        <CopyIcon weight={iconWeight} className="size-4" />
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  )
}

export function WrappedResults({ result }: { result: WrappedResult }) {
  const { profile, stats, year } = result
  const chartData = stats.monthlyActivity
  const peakMonthEntry = getPeakMonthEntry(chartData)
  const developerTitle = stats.developerTitle ?? "Developer"
  const percentileRank = formatPercentileRank(stats.contributionPercentile ?? 1)
  const avgPerActiveDay = stats.avgPerActiveDay ?? 0

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
      <MetalHeroCard percentile={stats.contributionPercentile ?? 1}>
        <div
          style={squircle}
          className="w-full overflow-hidden rounded-squircle-lg"
        >
        <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:items-center">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <Avatar className="size-14 shrink-0 ring-2 ring-primary/30 sm:size-16">
                <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="min-w-0 break-words text-heading-xl font-heading">
                    {profile.name ?? `@${profile.username}`}
                  </h1>
                  <a
                    href={profile.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open @${profile.username} on GitHub`}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-squircle-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    <ArrowSquareOutIcon weight={iconWeight} className="size-4" />
                  </a>
                </div>
                <DeveloperTitle
                  title={developerTitle}
                  percentile={stats.contributionPercentile ?? 1}
                  className="mt-1"
                />
                <p className="mt-1 truncate text-description">
                  @{profile.username} · {year} wrap
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-squircle-md border border-border/60 bg-background/30 px-4 py-3 sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:bg-transparent sm:p-0 sm:text-right">
              <div className="min-w-0">
                <p className="text-stat-value text-primary">
                  {formatNumber(stats.totalContributions)}
                </p>
                <p className="text-caption">contributions</p>
              </div>
              {stats.totalContributions > 0 ? (
                <Badge className="shrink-0 sm:mt-2" variant="outline">
                  {percentileRank}
                </Badge>
              ) : null}
            </div>
          </div>

          {profile.bio ? (
            <p className="max-w-2xl text-lede text-muted-foreground">{profile.bio}</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
        </div>
      </MetalHeroCard>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        <div className="surface-panel flex flex-col gap-4 sm:gap-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-heading-lg">Monthly activity</h2>
              <p className="text-caption">
                {peakMonthEntry
                  ? `Peak month: ${peakMonthEntry.month} · ${peakMonthEntry.contributions.toLocaleString()} contributions`
                  : "Contributions by month"}
              </p>
            </div>
          </div>
          <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
            <MonthlyActivityChart
              data={chartData}
              highlight={peakMonthEntry?.month ?? stats.busiestMonth ?? undefined}
              variant="results"
            />
          </div>
        </div>

        <div className="surface-panel flex flex-col gap-4 sm:gap-5 lg:col-span-2">
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

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="surface-panel flex flex-col gap-4 sm:gap-5">
          <div>
            <h2 className="text-heading-lg">Profile</h2>
            <p className="text-caption">{profile.memberSince ?? "Public account"}</p>
          </div>

          {profile.location || profile.company ? (
            <div className="flex flex-col gap-2">
              {profile.location ? (
                <div className="flex items-center gap-2 text-body text-muted-foreground">
                  <CountryFlag location={profile.location} size={18} />
                  <span className="min-w-0 break-words">{profile.location}</span>
                </div>
              ) : null}
              {profile.company ? (
                <div className="flex items-center gap-2 text-body text-muted-foreground">
                  <BuildingsIcon weight={iconWeight} className="size-4 shrink-0" />
                  <span className="min-w-0 break-words">{profile.company}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <GitBranchIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Repos</span>
              </div>
              <p className="text-stat-value">{stats.publicRepos}</p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <StarIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Total stars</span>
              </div>
              <p className="text-stat-value">{formatNumber(stats.totalStars)}</p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <TrendUpIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Stars in {year}</span>
              </div>
              <p className="text-stat-value">
                {formatNumber(stats.starGrowth?.gainedThisYear ?? 0)}
              </p>
            </div>
            <div className="rounded-squircle-md border border-border/60 bg-background/40 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <UsersIcon weight={iconWeight} className="size-4" />
                <span className="text-label">Followers</span>
              </div>
              <p className="text-stat-value">{formatNumber(stats.followers)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border/60 pt-5">
            <div>
              <h3 className="text-heading-lg">Collaboration</h3>
              <p className="text-caption">Work beyond your own repos</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-squircle-md border border-border/60 bg-background/40 p-3 sm:p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <GitBranchIcon weight={iconWeight} className="size-4" />
                  <span className="text-label">External repos</span>
                </div>
                <p className="text-stat-value">
                  {stats.collaboration?.externalRepos ?? 0}
                </p>
                <p className="mt-1 text-caption">Contributed to in {year}</p>
              </div>
              <div className="rounded-squircle-md border border-border/60 bg-background/40 p-3 sm:p-4">
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
        </div>

        {stats.topRepo ? <TopRepoCard repo={stats.topRepo} /> : null}
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

      if (!payload.shareId) {
        throw new Error("Unable to generate wrap")
      }

      sessionStorage.setItem(wrapStoryPendingKey(payload.shareId), "1")
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
      <main id="main-content" className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10 sm:gap-8 sm:py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-heading-xl font-heading sm:text-display">Generate your wrap</h1>
        </div>

        <form onSubmit={handleSubmit} className="surface-panel flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">GitHub username</Label>
            <Input
              id="username"
              name="username"
              placeholder="torvalds"
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
  const shareId = result.shareId ?? ""
  const [phase, setPhase] = useState<"loading" | "story" | "results">("loading")

  useEffect(() => {
    if (!shareId) {
      setPhase("results")
      return
    }

    const pending = sessionStorage.getItem(wrapStoryPendingKey(shareId))
    setPhase(pending ? "story" : "results")
  }, [shareId])

  const completeStory = useCallback(() => {
    if (shareId) {
      sessionStorage.removeItem(wrapStoryPendingKey(shareId))
    }
    setPhase("results")
  }, [shareId])

  if (phase === "loading") {
    return <div className="min-h-screen bg-background" aria-hidden />
  }

  if (phase === "story") {
    return <WrapStory result={result} onComplete={completeStory} />
  }

  return (
    <div className="relative isolate min-h-full">
      <TopGlow />
      <SiteNavbar />
      <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10 md:py-14">
        <WrappedResults result={result} />
        <div className="mt-8 flex justify-center sm:mt-10">
          <Button className="min-h-11" size="lg" variant="outline" render={<Link href="/wrap" />}>
            Generate yours
          </Button>
        </div>
      </main>
    </div>
  )
}
