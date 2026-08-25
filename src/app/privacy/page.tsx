import Link from "next/link"

import { SiteNavbar } from "@/components/site-navbar"
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
import { createPrivacyMetadata, siteName } from "@/lib/site-metadata"

export const metadata = createPrivacyMetadata()

export default function PrivacyPage() {
  return (
    <div className="relative isolate min-h-full">
      <TopGlow />
      <SiteNavbar />

      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-heading text-3xl sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-description">
          Last updated: August 25, 2026
        </p>

        <div className="mt-10 flex flex-col gap-8 text-body text-foreground/90">
          <section>
            <h2 className="text-heading-lg">Overview</h2>
            <p className="mt-3 text-description">
              GitWrap generates shareable recaps from public GitHub activity. This
              policy explains what information we process when you use the site.
            </p>
          </section>

          <section>
            <h2 className="text-heading-lg">Information we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-description">
              <li>
                GitHub usernames you submit to generate a wrap.
              </li>
              <li>
                Public GitHub profile and contribution data returned by the GitHub
                API for that username.
              </li>
              <li>
                Generated wrap results stored so share links continue to work.
              </li>
              <li>
                Basic server logs from our hosting provider, such as IP address,
                request path, and browser user agent.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-heading-lg">How we use information</h2>
            <p className="mt-3 text-description">
              We use the data above to build and display wraps, create shareable
              links, and keep the service reliable. We do not sell personal
              information and we do not use advertising or third-party analytics
              trackers on this site.
            </p>
          </section>

          <section>
            <h2 className="text-heading-lg">Data retention</h2>
            <p className="mt-3 text-description">
              Generated wraps remain available at their share links until removed.
              Server logs are retained only as long as needed for operations and
              security.
            </p>
          </section>

          <section>
            <h2 className="text-heading-lg">Third-party services</h2>
            <p className="mt-3 text-description">
              GitWrap requests public data from GitHub and is hosted on
              infrastructure that may process requests on our behalf. GitHub
              profile images may be loaded directly from GitHub servers when
              displaying a wrap.
            </p>
          </section>

          <section>
            <h2 className="text-heading-lg">Your choices</h2>
            <p className="mt-3 text-description">
              Only submit usernames you are comfortable having processed. If you
              want a stored wrap removed, contact{" "}
              <a
                href="mailto:security@netcha.se"
                className="text-primary underline-offset-4 hover:underline"
              >
                security@netcha.se
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-heading-lg">Changes</h2>
            <p className="mt-3 text-description">
              We may update this policy as the product changes. The date at the
              top of this page shows when it was last revised.
            </p>
          </section>
        </div>

        <p className="mt-10">
          <Link href="/" className="text-primary underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
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
