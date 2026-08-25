export type BestDay = {
  date: string
  label: string
  contributions: number
}

export type BusiestWeek = {
  weekStart: string
  label: string
  contributions: number
}

export type ContributionDay = {
  date: string
  contributionCount: number
}

export type CollaborationStats = {
  externalRepos: number
  coAuthoredPullRequests: number
}

export type StarGrowthStats = {
  gainedThisYear: number
  scannedRepos: number
}

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
  owner?: string
  url?: string
  stars: number
  forks: number
  language: string | null
  languageColor?: string | null
  description: string | null
}

export type WrappedStats = {
  totalContributions: number
  longestStreak: number
  activeDays: number
  avgPerActiveDay: number
  bestDay: BestDay | null
  busiestWeek: BusiestWeek | null
  developerTitle: string
  contributionPercentile: number
  pullRequests: number
  issues: number
  reviews: number
  publicRepos: number
  totalStars: number
  starGrowth: StarGrowthStats
  collaboration: CollaborationStats
  followers: number
  following: number
  topLanguages: LanguageStat[]
  monthlyActivity: MonthlyActivity[]
  topRepo: TopRepo | null
  busiestMonth: string | null
}

export type WrappedProfile = {
  username: string
  name: string | null
  avatarUrl: string
  bio: string | null
  profileUrl: string
  joinedAt: string
  memberSince: string
  location: string | null
  company: string | null
}

export type WrappedResult = {
  username: string
  year: number
  profile: WrappedProfile
  stats: WrappedStats
  generatedAt: string
  shareId?: string
}
