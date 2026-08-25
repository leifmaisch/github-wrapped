"use client"

import Link from "next/link"
import {
  ChartBarIcon,
  GitBranchIcon,
  ShareNetworkIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"

import { SiteNavbar } from "@/components/site-navbar"
import { Button } from "@/components/ui/button"
import {
  Cta,
  CtaActions,
  CtaDescription,
  CtaTitle,
} from "@/components/ui/cta"
import {
  Footer,
  FooterBar,
  FooterBrand,
  FooterCopyright,
  FooterPanel,
} from "@/components/ui/footer"
import {
  Hero,
  HeroActions,
  HeroFrame,
  HeroIntro,
  HeroShowcase,
  HeroTitle,
} from "@/components/ui/hero"
import { GlowCard } from "@/components/ui/glow-card"
import { SiteLogo } from "@/components/site-logo"
import { TopGlow } from "@/components/ui/top-glow"
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"
import { siteName } from "@/lib/site-metadata"

function PreviewCard() {
  return (
    <GlowCard className="w-full max-w-md">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-24 rounded bg-foreground/20" />
              <div className="h-2 w-16 rounded bg-muted-foreground/20" />
            </div>
          </div>
          <span className="text-stat-value text-primary">1,247</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["42d streak", "89 active", "12 PRs", "TypeScript"].map((item) => (
            <div
              key={item}
              className="rounded-squircle-md border border-border/50 bg-background/30 px-3 py-2 text-caption"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t bg-primary/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </GlowCard>
  )
}

export function LandingPage() {
  return (
    <div className="relative isolate">
      <TopGlow />
      <SiteNavbar />

      <main id="main-content">
        <Hero>
          <HeroFrame>
            <HeroIntro>
              <HeroTitle>Your year on GitHub, wrapped</HeroTitle>
              <HeroActions>
                <Button size="lg" render={<Link href="/wrap" />}>
                  Get your wrap
                </Button>
              </HeroActions>
            </HeroIntro>
            <HeroShowcase>
              <PreviewCard />
            </HeroShowcase>
          </HeroFrame>
        </Hero>

        <Section>
          <SectionHeader>
            <SectionTitle>What you get</SectionTitle>
            <SectionDescription>
              A clean recap card with the stats that matter, ready to share.
            </SectionDescription>
          </SectionHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ChartBarIcon,
                title: "Activity breakdown",
                description: "Contributions, streaks, and monthly activity at a glance.",
              },
              {
                icon: GitBranchIcon,
                title: "Languages and repos",
                description: "Top languages, stars, and your standout repository.",
              },
              {
                icon: ShareNetworkIcon,
                title: "Shareable cards",
                description: "A dedicated link with rich preview images for social posts.",
              },
            ].map((item) => (
              <div key={item.title} className="surface-panel flex flex-col gap-3 p-6">
                <item.icon className="size-8 text-primary" weight="duotone" />
                <h3 className="text-heading-lg">{item.title}</h3>
                <p className="text-description">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Cta id="cta">
          <CtaTitle>Ready to see your stats?</CtaTitle>
          <CtaDescription>
            Paste a username and get a shareable wrap in seconds.
          </CtaDescription>
          <CtaActions>
            <Button size="lg" render={<Link href="/wrap" />}>
              <SparkleIcon className="size-4" weight="duotone" />
              Generate wrap
            </Button>
          </CtaActions>
        </Cta>
      </main>

      <Footer>
        <FooterPanel>
          <FooterBar>
            <FooterBrand href="/" logo={<SiteLogo />} name={siteName}>
              Your GitHub year in review.
            </FooterBrand>
            <FooterCopyright name={siteName} />
          </FooterBar>
        </FooterPanel>
      </Footer>
    </div>
  )
}
