import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import type { WrappedResult } from "@/lib/wrapped-types"

export const wraps = pgTable(
  "wraps",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    year: text("year").notNull(),
    result: jsonb("result").notNull().$type<WrappedResult>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("wraps_username_idx").on(table.username)]
)

export type WrapRecord = typeof wraps.$inferSelect
export type NewWrapRecord = typeof wraps.$inferInsert
