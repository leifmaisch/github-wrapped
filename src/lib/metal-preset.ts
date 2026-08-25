import type { MetalFxPreset } from "metal-fx"

export function getMetalPreset(percentile: number): MetalFxPreset {
  if (percentile >= 90) return "gold"
  if (percentile >= 60) return "chromatic"
  return "silver"
}
