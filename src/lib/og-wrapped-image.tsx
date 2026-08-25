import { ImageResponse } from "next/og"

import {
  OgBackground,
  ogColors,
  ogFontFamily,
  ogImageSize,
  truncateText,
} from "@/lib/og-shared"
import type { WrappedResult } from "@/lib/wrapped-types"
import { formatPercentileRank } from "@/lib/wrapped-insights"

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "18px 22px",
        borderRadius: 16,
        border: `1px solid ${ogColors.border}`,
        backgroundColor: ogColors.card,
        flex: 1,
      }}
    >
      <span style={{ fontSize: 18, color: ogColors.muted }}>{label}</span>
      <span
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: ogColors.foreground,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  )
}

function LanguagePill({ name, percentage, color }: { name: string; percentage: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderRadius: 999,
        border: `1px solid ${ogColors.border}`,
        backgroundColor: ogColors.card,
        fontSize: 18,
        color: ogColors.foreground,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
      <span>{name}</span>
      <span style={{ color: ogColors.muted }}>{percentage}%</span>
    </div>
  )
}

export function createWrappedOgImageAlt(result: WrappedResult) {
  return `@${result.username} · ${result.year} GitHub wrap`
}

export async function createWrappedOgImage(result: WrappedResult) {
  const { stats, profile } = result
  const displayName = profile.name ?? `@${result.username}`

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          backgroundColor: ogColors.background,
          padding: "48px 56px",
          fontFamily: ogFontFamily,
        }}
      >
        <OgBackground />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={profile.avatarUrl}
              width={88}
              height={88}
              style={{ borderRadius: 44, border: `3px solid ${ogColors.primary}` }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  color: ogColors.foreground,
                  letterSpacing: "-0.02em",
                }}
              >
                {truncateText(displayName, 28)}
              </span>
              <span style={{ fontSize: 22, color: ogColors.muted }}>
                @{result.username} · {stats.developerTitle}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 64,
                fontWeight: 600,
                color: ogColors.primary,
                lineHeight: 1,
              }}
            >
              {stats.totalContributions.toLocaleString()}
            </span>
            <span style={{ fontSize: 18, color: ogColors.muted, marginTop: 6 }}>
              contributions
            </span>
            {stats.totalContributions > 0 ? (
              <span
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  color: ogColors.primary,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1px solid ${ogColors.border}`,
                }}
              >
                {formatPercentileRank(stats.contributionPercentile)}
              </span>
            ) : null}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <StatBlock label="Avg per day" value={String(stats.avgPerActiveDay)} />
          <StatBlock
            label="Best day"
            value={stats.bestDay ? String(stats.bestDay.contributions) : "—"}
          />
          <StatBlock
            label="Busiest week"
            value={
              stats.busiestWeek
                ? stats.busiestWeek.contributions.toLocaleString()
                : "—"
            }
          />
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {stats.topLanguages.slice(0, 4).map((language) => (
            <LanguagePill
              key={language.name}
              name={language.name}
              percentage={language.percentage}
              color={language.color}
            />
          ))}
          {stats.busiestMonth ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: 999,
                border: `1px solid ${ogColors.border}`,
                backgroundColor: ogColors.card,
                fontSize: 18,
                color: ogColors.muted,
              }}
            >
              Busiest month:{" "}
              <span style={{ color: ogColors.foreground, marginLeft: 8 }}>
                {stats.busiestMonth}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
    }
  )
}
