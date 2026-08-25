"use client"

import Link from "next/link"
import { ArrowRightIcon, ChartBarIcon, GitBranchIcon, ShareNetworkIcon } from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { LandingHeroPreview } from "@/components/landing/landing-hero-preview"
import { Button } from "@/components/ui/button"
import {
  Hero,
  HeroActions,
  HeroChip,
  HeroChips,
  HeroDescription,
  HeroFrame,
  HeroIntro,
  HeroLabel,
  HeroShowcase,
  HeroTitle,
} from "@/components/ui/hero"

const highlights = [
  { icon: ChartBarIcon, label: "Activity and streaks" },
  { icon: GitBranchIcon, label: "Languages and repos" },
  { icon: ShareNetworkIcon, label: "Shareable link" },
]

export function LandingHero() {
  const year = new Date().getFullYear()

  return (
    <Hero>
      <HeroFrame className="p-0">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <HeroIntro className="items-start px-6 py-10 text-left sm:px-10 sm:py-12 lg:py-14">
            <HeroLabel>{year} GitHub wrap</HeroLabel>
            <HeroTitle className="max-w-xl text-left">
              Your year on GitHub, wrapped
            </HeroTitle>
            <HeroDescription className="max-w-lg text-left">
              Contributions, streaks, languages, and collaboration stats in one
              shareable card with a liquid metal border.
            </HeroDescription>
            <HeroActions className="justify-start">
              <Button size="lg" render={<Link href="/wrap" />}>
                Get your wrap
                <ArrowRightIcon weight={iconWeight} className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="#features" />}>
                See what you get
              </Button>
            </HeroActions>
            <HeroChips className="justify-start">
              {highlights.map((item) => (
                <HeroChip key={item.label} className="inline-flex items-center gap-1.5">
                  <item.icon weight={iconWeight} className="size-3.5 text-primary" />
                  {item.label}
                </HeroChip>
              ))}
            </HeroChips>
          </HeroIntro>

          <HeroShowcase className="mx-0 mb-0 min-h-[320px] rounded-none border-0 border-t border-border lg:min-h-full lg:border-t-0 lg:border-l">
            <LandingHeroPreview />
          </HeroShowcase>
        </div>
      </HeroFrame>
    </Hero>
  )
}
