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
          <Button render={<Link href="/wrap" />}>Get your wrap</Button>
        </NavbarActions>
        <NavbarMenuButton />
      </NavbarFrame>
      <NavbarMobileMenu>
        <NavbarMobileActions>
          <Button className="w-full" render={<Link href="/wrap" />}>
            Get your wrap
          </Button>
        </NavbarMobileActions>
      </NavbarMobileMenu>
    </Navbar>
  )
}
