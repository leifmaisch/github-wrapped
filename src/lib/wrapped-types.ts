export type LanguageStat = {
  name: string
  bytes: number
  percentage: number
  color: string
}

export type MonthlyActivity = {
  month: string
  contributions: number
}

export type TopRepo = {
  name: string
  fullName: string
  stars: number
  forks: number
  language: string | null
  description: string | null
}

export type WrappedStats = {
  totalContributions: number
  longestStreak: number
  activeDays: number
  pullRequests: number
  issues: number
  reviews: number
  publicRepos: number
  totalStars: number
  followers: number
  topLanguages: LanguageStat[]
  monthlyActivity: MonthlyActivity[]
  topRepo: TopRepo | null
  busiestMonth: string | null
  accountAgeYears: number
}

export type WrappedProfile = {
  username: string
  name: string | null
  avatarUrl: string
  bio: string | null
  profileUrl: string
  joinedAt: string
}

export type WrappedResult = {
  username: string
  year: number
  profile: WrappedProfile
  stats: WrappedStats
  generatedAt: string
  shareId?: string
}
