"use client"

import Link from "next/link"
import {
  ChartBarIcon,
  GitBranchIcon,
  ShareNetworkIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr"

import { LandingHero } from "@/components/landing/landing-hero"
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
  FooterLegal,
  FooterPanel,
} from "@/components/ui/footer"
import { SiteLogo } from "@/components/site-logo"
import { TopGlow } from "@/components/ui/top-glow"
import {
  Section,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"
import { siteName } from "@/lib/site-metadata"

export function LandingPage() {
  return (
    <div className="relative isolate">
      <TopGlow />
      <SiteNavbar />

      <main id="main-content">
        <LandingHero />

        <Section id="features">
          <SectionHeader>
            <SectionTitle>What you get</SectionTitle>
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
              <div key={item.title} className="surface-panel flex flex-col gap-3">
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
            <Button
              className="min-h-11"
              size="lg"
              render={<Link href="/wrap" />}
            >
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
            <FooterLegal
              links={[{ href: "/privacy", label: "Privacy" }]}
            />
            <FooterCopyright name={siteName} />
          </FooterBar>
        </FooterPanel>
      </Footer>
    </div>
  )
}
