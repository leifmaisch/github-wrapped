"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DeveloperTitle } from "@/components/wrapped/developer-title"
import {
  getPeakMonthEntry,
  MonthlyActivityChart,
} from "@/components/wrapped/monthly-activity-chart"
import { formatPercentileRank } from "@/lib/wrapped-insights"
import type { LanguageStat, MonthlyActivity, WrappedResult } from "@/lib/wrapped-types"
import { cn } from "@/lib/utils"

const STORY_DURATION_MS = 5600

type StoryVisual =
  | { type: "none" }
  | { type: "badge"; text: string }
  | { type: "stats"; items: Array<{ label: string; value: string }> }
  | { type: "chart"; data: MonthlyActivity[]; highlight?: string }
  | { type: "languages"; items: LanguageStat[] }
  | { type: "repo"; owner: string; name: string; stars: number; language: string | null; languageColor: string | null }

type StorySlide = {
  id: string
  eyebrow: string
  title: string
  subtitle?: string
  detail?: string
  gradient: string
  accent: string
  accentSecondary: string
  showAvatar?: boolean
  showDeveloperTitle?: boolean
  isFinale?: boolean
  visual?: StoryVisual
}

type StoryTheme = {
  gradient: string
  accent: string
  accentSecondary: string
}

const slideThemesById: Record<string, StoryTheme> = {
  intro: {
    gradient:
      "linear-gradient(155deg, #101411 0%, #0a241b 38%, #08872b 72%, #0fbf3e 100%)",
    accent: "#0fbf3e",
    accentSecondary: "#bfffd1",
  },
  contributions: {
    gradient:
      "radial-gradient(ellipse 130% 90% at 50% -10%, #5fed83 0%, #08872b 32%, #101411 72%)",
    accent: "#8cf2a6",
    accentSecondary: "#0fbf3e",
  },
  streak: {
    gradient:
      "linear-gradient(210deg, #1f1408 0%, #3d2208 28%, #08872b 68%, #0fbf3e 100%)",
    accent: "#f7df1e",
    accentSecondary: "#0fbf3e",
  },
  "best-day": {
    gradient:
      "linear-gradient(180deg, #0d1a2d 0%, #123524 46%, #0fbf3e 100%)",
    accent: "#5fed83",
    accentSecondary: "#3178c6",
  },
  "busiest-week": {
    gradient:
      "linear-gradient(165deg, #1a1030 0%, #232925 42%, #08872b 100%)",
    accent: "#a97bff",
    accentSecondary: "#5fed83",
  },
  activity: {
    gradient:
      "linear-gradient(200deg, #101411 0%, #1a2e1f 45%, #0a241b 100%)",
    accent: "#0fbf3e",
    accentSecondary: "#232925",
  },
  languages: {
    gradient:
      "linear-gradient(145deg, #0f1729 0%, #1a2744 38%, #08872b 100%)",
    accent: "#3178c6",
    accentSecondary: "#8cf2a6",
  },
  stars: {
    gradient:
      "linear-gradient(165deg, #2a1f05 0%, #3d2e08 30%, #0a241b 70%, #101411 100%)",
    accent: "#f7df1e",
    accentSecondary: "#bfffd1",
  },
  "top-repo": {
    gradient:
      "linear-gradient(175deg, #181818 0%, #232925 40%, #0a241b 100%)",
    accent: "#909692",
    accentSecondary: "#0fbf3e",
  },
  collaboration: {
    gradient:
      "linear-gradient(160deg, #081f24 0%, #0a241b 45%, #0fbf3e 100%)",
    accent: "#00add8",
    accentSecondary: "#5fed83",
  },
  title: {
    gradient:
      "linear-gradient(135deg, #101411 0%, #0a241b 25%, #08872b 55%, #5fed83 78%, #0fbf3e 100%)",
    accent: "#bfffd1",
    accentSecondary: "#8cf2a6",
  },
  finale: {
    gradient:
      "radial-gradient(ellipse 100% 80% at 50% 100%, #0fbf3e 0%, #08872b 38%, #101411 100%)",
    accent: "#5fed83",
    accentSecondary: "#bfffd1",
  },
}

const fallbackThemes: StoryTheme[] = [
  {
    gradient: "linear-gradient(165deg, #101411 0%, #08872b 100%)",
    accent: "#0fbf3e",
    accentSecondary: "#8cf2a6",
  },
  {
    gradient: "linear-gradient(165deg, #0a241b 0%, #232925 50%, #0fbf3e 100%)",
    accent: "#5fed83",
    accentSecondary: "#bfffd1",
  },
]

let fallbackThemeIndex = 0

function getSlideTheme(id: string): StoryTheme {
  if (slideThemesById[id]) {
    return slideThemesById[id]
  }

  const theme = fallbackThemes[fallbackThemeIndex % fallbackThemes.length]
  fallbackThemeIndex += 1
  return theme
}

function buildSlides(result: WrappedResult): StorySlide[] {
  const { profile, stats, year } = result
  const slides: StorySlide[] = []
  fallbackThemeIndex = 0

  slides.push({
    id: "intro",
    eyebrow: `${year} GitHub Wrap`,
    title: profile.name ?? `@${profile.username}`,
    subtitle: `@${profile.username}`,
    showAvatar: true,
    visual: { type: "none" },
    ...getSlideTheme("intro"),
  })

  slides.push({
    id: "contributions",
    eyebrow: "You showed up",
    title: stats.totalContributions.toLocaleString(),
    subtitle: "contributions this year",
    detail: "Every commit, PR, and review adds up",
    visual:
      stats.totalContributions > 0
        ? { type: "badge", text: formatPercentileRank(stats.contributionPercentile) }
        : { type: "none" },
    ...getSlideTheme("contributions"),
  })

  slides.push({
    id: "streak",
    eyebrow: "Consistency counts",
    title: `${stats.longestStreak} days`,
    subtitle: "your longest streak",
    visual: {
      type: "stats",
      items: [
        { label: "Active days", value: stats.activeDays.toLocaleString() },
        { label: "Avg per active day", value: String(stats.avgPerActiveDay ?? 0) },
      ],
    },
    ...getSlideTheme("streak"),
  })

  if (stats.bestDay) {
    slides.push({
      id: "best-day",
      eyebrow: "Your best day",
      title: stats.bestDay.contributions.toLocaleString(),
      subtitle: "contributions in one day",
      detail: stats.bestDay.label,
      visual: { type: "none" },
      ...getSlideTheme("best-day"),
    })
  }

  if (stats.busiestWeek) {
    slides.push({
      id: "busiest-week",
      eyebrow: "Your busiest week",
      title: stats.busiestWeek.contributions.toLocaleString(),
      subtitle: "contributions in seven days",
      detail: stats.busiestWeek.label,
      visual: { type: "none" },
      ...getSlideTheme("busiest-week"),
    })
  }

  if (stats.monthlyActivity.length > 0) {
    const peakMonth = getPeakMonthEntry(stats.monthlyActivity)

    slides.push({
      id: "activity",
      eyebrow: "Month by month",
      title: peakMonth ? peakMonth.contributions.toLocaleString() : "Your rhythm",
      subtitle: peakMonth
        ? `${peakMonth.month} was your peak month`
        : "contributions across the year",
      detail: peakMonth
        ? `${stats.monthlyActivity.reduce((sum, item) => sum + item.contributions, 0).toLocaleString()} contributions across ${stats.monthlyActivity.length} months`
        : undefined,
      visual: {
        type: "chart",
        data: stats.monthlyActivity,
        highlight: peakMonth?.month ?? stats.busiestMonth ?? undefined,
      },
      ...getSlideTheme("activity"),
    })
  }

  if (stats.topLanguages.length > 0) {
    slides.push({
      id: "languages",
      eyebrow: "Languages you lived in",
      title: stats.topLanguages[0].name,
      subtitle: `${stats.topLanguages[0].percentage}% of your codebase`,
      visual: { type: "languages", items: stats.topLanguages.slice(0, 4) },
      ...getSlideTheme("languages"),
    })
  }

  if (stats.starGrowth?.gainedThisYear > 0 || stats.totalStars > 0) {
    slides.push({
      id: "stars",
      eyebrow: "Community love",
      title: formatNumber(stats.starGrowth?.gainedThisYear ?? 0),
      subtitle: `stars gained in ${year}`,
      detail: `${formatNumber(stats.totalStars)} total across public repos`,
      visual: {
        type: "stats",
        items: [
          { label: "Public repos", value: stats.publicRepos.toLocaleString() },
          { label: "Followers", value: stats.followers.toLocaleString() },
        ],
      },
      ...getSlideTheme("stars"),
    })
  }

  if (stats.topRepo) {
    const owner = stats.topRepo.owner ?? stats.topRepo.fullName.split("/")[0] ?? ""
    slides.push({
      id: "top-repo",
      eyebrow: "Your standout repo",
      title: stats.topRepo.name,
      subtitle: `${owner}/${stats.topRepo.name}`,
      detail: `${formatNumber(stats.topRepo.stars)} stars · ${formatNumber(stats.topRepo.forks)} forks`,
      visual: {
        type: "repo",
        owner,
        name: stats.topRepo.name,
        stars: stats.topRepo.stars,
        language: stats.topRepo.language,
        languageColor: stats.topRepo.languageColor ?? null,
      },
      ...getSlideTheme("top-repo"),
    })
  }

  const externalRepos = stats.collaboration?.externalRepos ?? 0
  const collaboratedPrs = stats.collaboration?.coAuthoredPullRequests ?? 0
  if (externalRepos > 0 || collaboratedPrs > 0 || stats.pullRequests > 0) {
    slides.push({
      id: "collaboration",
      eyebrow: "Beyond your own repos",
      title: collaboratedPrs > 0 ? collaboratedPrs.toLocaleString() : externalRepos.toLocaleString(),
      subtitle:
        collaboratedPrs > 0
          ? "pull requests you did not author"
          : "external repos contributed to",
      detail:
        stats.pullRequests > 0
          ? `${stats.pullRequests.toLocaleString()} PRs opened by you`
          : undefined,
      visual: {
        type: "stats",
        items: [
          { label: "External repos", value: externalRepos.toLocaleString() },
          { label: "Collaborated PRs", value: collaboratedPrs.toLocaleString() },
        ],
      },
      ...getSlideTheme("collaboration"),
    })
  }

  slides.push({
    id: "title",
    eyebrow: "Your developer title",
    title: stats.developerTitle,
    subtitle: "earned from how you shipped this year",
    showDeveloperTitle: true,
    visual: { type: "none" },
    ...getSlideTheme("title"),
  })

  slides.push({
    id: "finale",
    eyebrow: "That is your year",
    title: "Your full wrap is ready",
    subtitle: "Deep stats, charts, repos, and a share link",
    isFinale: true,
    visual: { type: "none" },
    ...getSlideTheme("finale"),
  })

  return slides
}

function formatNumber(value: number) {
  return value.toLocaleString()
}

function StoryBackdrop({
  accent,
  accentSecondary,
  slideId,
}: {
  accent: string
  accentSecondary: string
  slideId: string
}) {
  const orbLayout: Record<string, { top?: string; left?: string; right?: string; bottom?: string }> = {
    intro: { top: "10%", left: "-10%" },
    contributions: { top: "-5%", left: "20%" },
    streak: { bottom: "5%", right: "-5%" },
    "best-day": { top: "15%", right: "-12%" },
    "busiest-week": { bottom: "10%", left: "-8%" },
    activity: { top: "20%", left: "50%" },
    languages: { top: "8%", right: "0" },
    stars: { bottom: "0", left: "10%" },
    "top-repo": { top: "25%", right: "-15%" },
    collaboration: { bottom: "15%", left: "-10%" },
    title: { top: "0", left: "30%" },
    finale: { bottom: "-5%", right: "15%" },
  }
  const primaryOrb = orbLayout[slideId] ?? { top: "10%", left: "-10%" }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle,color-mix(in_oklab,white_12%,transparent)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-56 rounded-full opacity-50 blur-3xl sm:size-72"
        style={{ backgroundColor: accent, ...primaryOrb }}
        animate={{ x: [0, 24, 0], y: [0, 18, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-64 rounded-full opacity-40 blur-3xl sm:size-80"
        style={{ backgroundColor: accentSecondary, bottom: "8%", right: "-8%" }}
        animate={{ x: [0, -20, 0], y: [0, -14, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: accentSecondary }}
        animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.14),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.08),transparent_35%)]"
      />
    </>
  )
}

function StoryVisualBlock({
  visual,
  accent,
}: {
  visual?: StoryVisual
  accent: string
}) {
  if (!visual || visual.type === "none") return null

  if (visual.type === "badge") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mt-6 inline-flex rounded-full border border-white/25 bg-black/20 px-4 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-sm"
      >
        {visual.text}
      </motion.div>
    )
  }

  if (visual.type === "stats") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.45 }}
        className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3"
      >
        {visual.items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-wide text-white/60">{item.label}</p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-white">
              {item.value}
            </p>
          </div>
        ))}
      </motion.div>
    )
  }

  if (visual.type === "chart") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mt-8 w-full max-w-md rounded-3xl border border-white/15 bg-black/20 p-4 backdrop-blur-sm"
      >
        <MonthlyActivityChart
          data={visual.data}
          highlight={visual.highlight}
          variant="story"
        />
      </motion.div>
    )
  }

  if (visual.type === "languages") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mt-8 flex w-full max-w-md flex-col gap-3"
      >
        {visual.items.map((language, languageIndex) => (
          <motion.div
            key={language.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * languageIndex, duration: 0.35 }}
            className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: language.color }}
                />
                <span className="truncate font-medium text-white">{language.name}</span>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-white/70">
                {language.percentage}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: language.color }}
                initial={{ width: 0 }}
                animate={{ width: `${language.percentage}%` }}
                transition={{ delay: 0.15 + languageIndex * 0.08, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (visual.type === "repo") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="mt-8 w-full max-w-md rounded-3xl border border-white/15 bg-black/20 p-5 text-left backdrop-blur-sm"
      >
        <p className="truncate font-heading text-xl font-semibold text-white">
          <span className="text-white/60">{visual.owner}/</span>
          {visual.name}
        </p>
        {visual.language ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: visual.languageColor ?? accent }}
            />
            {visual.language}
          </div>
        ) : null}
        <p className="mt-4 font-heading text-3xl font-bold tabular-nums text-white">
          {formatNumber(visual.stars)}
          <span className="ml-2 text-base font-medium text-white/60">stars</span>
        </p>
      </motion.div>
    )
  }

  return null
}

export function wrapStoryStorageKey(shareId: string) {
  return `gitwrap-story-dismissed:${shareId}`
}

export function WrapStory({
  result,
  onComplete,
}: {
  result: WrappedResult
  onComplete: () => void
}) {
  const slides = useMemo(() => buildSlides(result), [result])
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const isLast = index === slides.length - 1

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete()
      return
    }
    setIndex((current) => Math.min(current + 1, slides.length - 1))
  }, [isLast, onComplete, slides.length])

  const goPrev = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0))
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      goNext()
    }, STORY_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [goNext, index])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault()
        goNext()
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrev()
      }
      if (event.key === "Escape") {
        event.preventDefault()
        onComplete()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goNext, goPrev, onComplete])

  function handleTap(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left
    if (x < bounds.width * 0.3) {
      goPrev()
      return
    }
    goNext()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#101411] text-white">
      <div className="relative z-20 flex items-center gap-3 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex min-w-0 flex-1 gap-1.5">
          {slides.map((item, slideIndex) => (
            <div
              key={item.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
            >
              {slideIndex < index ? (
                <div className="h-full w-full rounded-full bg-white" />
              ) : slideIndex === index ? (
                <motion.div
                  key={`progress-${index}`}
                  className="h-full rounded-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: STORY_DURATION_MS / 1000,
                    ease: "linear",
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="shrink-0 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          Skip
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: slide.gradient }}
          >
            <StoryBackdrop
              accent={slide.accent}
              accentSecondary={slide.accentSecondary}
              slideId={slide.id}
            />

            <div
              className="relative z-10 flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center overflow-y-auto px-5 py-8 text-center sm:px-8"
              onClick={handleTap}
              role="presentation"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full max-w-lg flex-col items-center"
              >
                {slide.showAvatar ? (
                  <Avatar className="mb-5 size-24 ring-4 ring-white/25 sm:size-28">
                    <AvatarImage
                      src={result.profile.avatarUrl}
                      alt={result.profile.username}
                    />
                    <AvatarFallback>
                      {result.profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : null}

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  {slide.eyebrow}
                </p>

                {slide.showDeveloperTitle ? (
                  <DeveloperTitle
                    title={slide.title}
                    percentile={result.stats.contributionPercentile ?? 1}
                    className="mt-4 text-3xl !bg-none !text-white sm:text-4xl md:text-5xl"
                  />
                ) : (
                  <h2 className="mt-4 max-w-xl text-balance font-heading text-4xl font-bold leading-[0.95] tracking-tight tabular-nums sm:text-5xl md:text-6xl">
                    {slide.title}
                  </h2>
                )}

                {slide.subtitle ? (
                  <p className="mt-4 max-w-md text-balance text-lg text-white/78 sm:text-xl">
                    {slide.subtitle}
                  </p>
                ) : null}

                {slide.detail ? (
                  <p className="mt-3 text-sm font-medium text-white/55 sm:text-base">
                    {slide.detail}
                  </p>
                ) : null}

                <StoryVisualBlock visual={slide.visual} accent={slide.accent} />

                {slide.isFinale ? (
                  <Button
                    size="lg"
                    className="mt-8 bg-white text-[#101411] hover:bg-white/90"
                    onClick={(event) => {
                      event.stopPropagation()
                      onComplete()
                    }}
                  >
                    View full wrap
                  </Button>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="pointer-events-none relative z-20 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-white/45">
        {isLast
          ? "Tap to open your wrap"
          : "Tap right to continue · left to go back"}
      </p>
    </div>
  )
}
