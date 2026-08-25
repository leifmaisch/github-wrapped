import "server-only"

import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { getDb } from "@/db"
import { wraps } from "@/db/schema"
import type { WrappedResult } from "@/lib/wrapped-types"

function withoutShareId(result: WrappedResult): WrappedResult {
  const { shareId: _shareId, ...rest } = result
  return rest
}

export async function saveWrappedResult(result: WrappedResult): Promise<string> {
  const id = nanoid(12)
  const payload = withoutShareId(result)

  await getDb().insert(wraps).values({
    id,
    username: payload.username,
    year: String(payload.year),
    result: payload,
  })

  return id
}

export async function getWrapByShareId(shareId: string): Promise<WrappedResult | null> {
  const record = await getDb().query.wraps.findFirst({
    where: eq(wraps.id, shareId),
  })

  if (!record) {
    return null
  }

  return {
    ...record.result,
    shareId: record.id,
  }
}
