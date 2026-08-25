"use client"

import { MetalFx } from "metal-fx"

import { getMetalPreset } from "@/lib/metal-preset"
import { cn } from "@/lib/utils"

export function MetalHeroCard({
  percentile,
  className,
  children,
}: {
  percentile: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <MetalFx
      preset={getMetalPreset(percentile)}
      theme="dark"
      strength={0.92}
      borderRadius={32}
      ringCssPx={2}
      disableGlow
      className={cn("block w-full bg-card", className)}
    >
      {children}
    </MetalFx>
  )
}
