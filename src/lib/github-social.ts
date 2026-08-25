import "server-only"

type GitHubRepo = {
  full_name: string
  stargazers_count: number
}

type CollaborationStats = {
  externalRepos: number
  coAuthoredPullRequests: number
}

type StarGrowthStats = {
  gainedThisYear: number
  scannedRepos: number
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

async function githubFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...githubHeaders(),
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) return null
  return response.json() as Promise<T>
}

async function fetchCollaborationFromGraphql(
  username: string,
  year: number
): Promise<CollaborationStats | null> {
  if (!process.env.GITHUB_TOKEN) return null

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
              owner { login }
            }
            contributions { totalCount }
          }
          pullRequestContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
              owner { login }
            }
            contributions { totalCount }
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
      variables: {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
    next: { revalidate: 3600 },
  })

  if (!response.ok) return null

  const payload = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          commitContributionsByRepository?: Array<{
            repository: { nameWithOwner: string; owner: { login: string } }
            contributions: { totalCount: number }
          }>
          pullRequestContributionsByRepository?: Array<{
            repository: { nameWithOwner: string; owner: { login: string } }
            contributions: { totalCount: number }
          }>
        }
      }
    }
  }

  const collection = payload.data?.user?.contributionsCollection
  if (!collection) return null

  const externalRepos = new Set<string>()
  const login = username.toLowerCase()

  for (const group of [
    ...(collection.commitContributionsByRepository ?? []),
    ...(collection.pullRequestContributionsByRepository ?? []),
  ]) {
    if (
      group.contributions.totalCount > 0 &&
      group.repository.owner.login.toLowerCase() !== login
    ) {
      externalRepos.add(group.repository.nameWithOwner)
    }
  }

  const coAuthoredPullRequests = await fetchCoAuthoredPullRequestCount(username, year)

  return {
    externalRepos: externalRepos.size,
    coAuthoredPullRequests,
  }
}

async function fetchSearchTotalCount(query: string) {
  const data = await githubFetch<{ total_count: number }>(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`
  )
  return data?.total_count ?? 0
}

async function fetchCoAuthoredPullRequestCount(username: string, year: number) {
  const query = `type:pr involves:${username} -author:${username} created:${year}-01-01..${year}-12-31`
  return fetchSearchTotalCount(query)
}

async function fetchExternalReposFromSearch(username: string, year: number) {
  const query = `author:${username} committer-date:${year}-01-01..${year}-12-31`
  const repos = new Set<string>()
  const login = username.toLowerCase()
  let page = 1

  while (page <= 10) {
    const data = await githubFetch<{
      items: Array<{
        repository: { full_name: string; owner: { login: string } }
      }>
    }>(
      `https://api.github.com/search/commits?q=${encodeURIComponent(query)}&per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    )

    if (!data?.items?.length) break

    for (const item of data.items) {
      if (item.repository.owner.login.toLowerCase() !== login) {
        repos.add(item.repository.full_name)
      }
    }

    if (data.items.length < 100) break
    page += 1
  }

  return repos.size
}

export async function fetchCollaborationStats(
  username: string,
  year: number
): Promise<CollaborationStats> {
  const fromGraphql = await fetchCollaborationFromGraphql(username, year)
  if (fromGraphql) return fromGraphql

  const [externalRepos, coAuthoredPullRequests] = await Promise.all([
    fetchExternalReposFromSearch(username, year),
    fetchCoAuthoredPullRequestCount(username, year),
  ])

  return { externalRepos, coAuthoredPullRequests }
}

async function fetchStarGrowthForRepo(
  fullName: string,
  year: number
): Promise<number> {
  const yearStart = `${year}-01-01T00:00:00Z`
  const yearEnd = `${year}-12-31T23:59:59Z`
  let page = 1
  let gained = 0

  while (page <= 10) {
    const stars = await githubFetch<Array<{ starred_at: string }>>(
      `https://api.github.com/repos/${fullName}/stargazers?per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.v3.star+json",
        },
      }
    )

    if (!stars?.length) break

    let reachedOlderStars = false

    for (const star of stars) {
      if (star.starred_at >= yearStart && star.starred_at <= yearEnd) {
        gained += 1
      } else if (star.starred_at < yearStart) {
        reachedOlderStars = true
      }
    }

    if (reachedOlderStars || stars.length < 100) break
    page += 1
  }

  return gained
}

export async function fetchStarGrowth(
  repos: GitHubRepo[],
  year: number
): Promise<StarGrowthStats> {
  const ownedRepos = repos.filter((repo) => repo.stargazers_count > 0)
  let gainedThisYear = 0

  for (const repo of ownedRepos) {
    gainedThisYear += await fetchStarGrowthForRepo(repo.full_name, year)
  }

  return {
    gainedThisYear,
    scannedRepos: ownedRepos.length,
  }
}

export function formatMemberSince(joinedAt: string) {
  const year = new Date(joinedAt).getUTCFullYear()
  return `GitHub member since ${year}`
}
