import { ArrowSquareOutIcon, GitForkIcon, StarIcon } from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { squircle } from "@/lib/squircle"
import type { TopRepo } from "@/lib/wrapped-types"

function formatNumber(value: number) {
  return value.toLocaleString()
}

function normalizeTopRepo(repo: TopRepo): TopRepo {
  const owner = repo.owner ?? repo.fullName.split("/")[0] ?? ""

  return {
    ...repo,
    owner,
    url: repo.url ?? `https://github.com/${repo.fullName}`,
    languageColor:
      repo.languageColor ??
      (repo.language ? "#a3a3a3" : null),
  }
}

export function TopRepoCard({ repo }: { repo: TopRepo }) {
  const topRepo = normalizeTopRepo(repo)
  return (
    <div className="surface-panel flex flex-col gap-4 sm:gap-5">
      <div>
        <h2 className="text-heading-lg">Top repository</h2>
        <p className="text-caption">Most starred public repo</p>
      </div>

      <a
        href={topRepo.url}
        target="_blank"
        rel="noopener noreferrer"
        style={squircle}
        className="group flex flex-col gap-4 rounded-squircle-md border border-border/60 bg-background/40 p-4 transition-colors hover:border-primary/35 hover:bg-background/55 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-heading text-heading">
              <span className="text-muted-foreground">{topRepo.owner}/</span>
              <span className="text-foreground">{topRepo.name}</span>
            </p>
            {topRepo.language ? (
              <div className="mt-2 flex items-center gap-2 text-caption text-muted-foreground">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: topRepo.languageColor ?? "#a3a3a3" }}
                />
                <span>{topRepo.language}</span>
              </div>
            ) : null}
          </div>
          <ArrowSquareOutIcon
            weight={iconWeight}
            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
          />
        </div>

        {topRepo.description ? (
          <p className="line-clamp-2 text-body text-muted-foreground">{topRepo.description}</p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-squircle-sm border border-border/50 bg-card/60 px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <StarIcon weight={iconWeight} className="size-4" />
              <span className="text-label">Stars</span>
            </div>
            <p className="text-stat-value text-numeric">{formatNumber(topRepo.stars)}</p>
          </div>
          <div className="rounded-squircle-sm border border-border/50 bg-card/60 px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <GitForkIcon weight={iconWeight} className="size-4" />
              <span className="text-label">Forks</span>
            </div>
            <p className="text-stat-value text-numeric">{formatNumber(topRepo.forks)}</p>
          </div>
        </div>
      </a>
    </div>
  )
}
