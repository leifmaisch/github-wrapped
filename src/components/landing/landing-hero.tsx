"use client"

import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { LandingHeroPreview } from "@/components/landing/landing-hero-preview"
import { Button } from "@/components/ui/button"
import {
  Hero,
  HeroActions,
  HeroDescription,
  HeroFrame,
  HeroIntro,
  HeroLabel,
  HeroShowcase,
  HeroTitle,
} from "@/components/ui/hero"

export function LandingHero() {
  const year = new Date().getFullYear()

  return (
    <Hero>
      <HeroFrame className="p-0">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <HeroIntro className="items-start px-4 py-8 text-left sm:px-10 sm:py-12 lg:py-14">
            <HeroLabel>{year} GitHub wrap</HeroLabel>
            <HeroTitle className="max-w-xl text-left">
              Your year on GitHub, wrapped
            </HeroTitle>
            <HeroDescription className="max-w-lg text-left">
              Contributions, streaks, languages, and collaboration stats in one
              shareable card with a liquid metal border.
            </HeroDescription>
            <HeroActions className="w-full justify-stretch sm:w-auto sm:justify-start [&>*]:w-full sm:[&>*]:w-auto">
              <Button size="lg" render={<Link href="/wrap" />}>
                Get your wrap
                <ArrowRightIcon weight={iconWeight} className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="#features" />}>
                See what you get
              </Button>
            </HeroActions>
          </HeroIntro>

          <HeroShowcase className="mx-0 mb-0 min-h-[280px] rounded-none border-0 border-t border-border sm:min-h-[320px] lg:min-h-full lg:border-t-0 lg:border-l">
            <LandingHeroPreview />
          </HeroShowcase>
        </div>
      </HeroFrame>
    </Hero>
  )
}
