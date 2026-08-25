import type { ComponentType } from "react"
import * as NucleoFlags from "nucleo-flags"
import type { IconProps } from "nucleo-flags"

export type FlagIconName = keyof typeof NucleoFlags & `Icon${string}`

type FlagComponent = ComponentType<IconProps>

const FLAG_ICONS = NucleoFlags as Record<string, FlagComponent>

const MANUAL_ALIASES: Record<string, FlagIconName> = {
  de: "IconGermany",
  deutschland: "IconGermany",
  uk: "IconUnitedKingdom",
  gb: "IconUnitedKingdom",
  england: "IconEngland",
  scotland: "IconScotland",
  wales: "IconWales",
  usa: "IconUnitedStates",
  us: "IconUnitedStates",
  uae: "IconUnitedArabEmirates",
  czech: "IconCzechia",
  "czech republic": "IconCzechia",
  "south korea": "IconSouthKorea",
  korea: "IconSouthKorea",
  "north korea": "IconNorthKorea",
  russia: "IconRussia",
  "ivory coast": "IconIvoryCoast",
  "cote d'ivoire": "IconIvoryCoast",
  taiwan: "IconTaiwan",
  vietnam: "IconVietnam",
  holland: "IconNetherlands",
  burma: "IconMyanmar",
}

const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
  "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
])

function iconNameToAliases(iconName: string) {
  const base = iconName.replace(/^Icon/, "")
  const spaced = base
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()

  return [spaced, spaced.replace(/\s+/g, "")]
}

function buildAliasMap() {
  const aliases = new Map<string, FlagIconName>()

  for (const alias of Object.entries(MANUAL_ALIASES)) {
    aliases.set(alias[0], alias[1])
  }

  for (const iconName of Object.keys(FLAG_ICONS)) {
    if (!iconName.startsWith("Icon")) continue
    for (const alias of iconNameToAliases(iconName)) {
      if (!aliases.has(alias)) {
        aliases.set(alias, iconName as FlagIconName)
      }
    }
  }

  return [...aliases.entries()].sort((a, b) => b[0].length - a[0].length)
}

const SORTED_ALIASES = buildAliasMap()

function normalizePart(value: string) {
  return value.trim().toLowerCase().replace(/\./g, "")
}

function inferUnitedStates(location: string) {
  const stateMatch = location.match(/,\s*([A-Za-z]{2})\s*$/)
  if (stateMatch && US_STATE_CODES.has(stateMatch[1].toUpperCase())) {
    return "IconUnitedStates" as FlagIconName
  }

  return null
}

export function resolveLocationFlag(location: string): FlagIconName | null {
  const normalized = location.trim()
  if (!normalized) return null

  const usFlag = inferUnitedStates(normalized)
  if (usFlag) return usFlag

  const parts = normalized
    .split(",")
    .map(normalizePart)
    .filter(Boolean)

  const candidates = [...parts, normalizePart(normalized)]

  for (const candidate of candidates) {
    for (const [alias, iconName] of SORTED_ALIASES) {
      if (candidate === alias) {
        return iconName
      }
    }
  }

  return null
}

export function getFlagIcon(location: string): FlagComponent | null {
  const iconName = resolveLocationFlag(location)
  if (!iconName) return null

  const Icon = FLAG_ICONS[iconName]
  return Icon ?? null
}
