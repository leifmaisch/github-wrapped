"use client"

import Link from "next/link"

import { SiteLogo } from "@/components/site-logo"
import { siteName } from "@/lib/site-metadata"
import { Button } from "@/components/ui/button"
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarFrame,
  NavbarMenuButton,
  NavbarMobileActions,
  NavbarMobileMenu,
} from "@/components/ui/navbar"

export function SiteNavbar() {
  return (
    <Navbar sticky>
      <NavbarFrame>
        <NavbarBrand href="/" logo={<SiteLogo />} name={siteName} />
        <NavbarActions className="ml-auto">
          <nav aria-label="Main">
            <Button
              className="min-h-11"
              size="lg"
              render={<Link href="/wrap" />}
            >
              Get your wrap
            </Button>
          </nav>
        </NavbarActions>
        <NavbarMenuButton />
      </NavbarFrame>
      <NavbarMobileMenu>
        <NavbarMobileActions>
          <nav aria-label="Main">
            <Button
              className="min-h-11 w-full"
              size="lg"
              render={<Link href="/wrap" />}
            >
              Get your wrap
            </Button>
          </nav>
        </NavbarMobileActions>
      </NavbarMobileMenu>
    </Navbar>
  )
}
