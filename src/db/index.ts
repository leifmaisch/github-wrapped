import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/db/schema"

type Database = PostgresJsDatabase<typeof schema>

let client: postgres.Sql | undefined
let database: Database | undefined

export function getDb(): Database {
  if (database) {
    return database
  }

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  client = postgres(connectionString, { max: 10 })
  database = drizzle(client, { schema })

  return database
}
