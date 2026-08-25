import { NextResponse } from "next/server"

import { generateWrapped } from "@/lib/github-wrapped"
import { saveWrappedResult } from "@/lib/wraps-store"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string }
    const username = body.username?.trim()

    if (!username) {
      return NextResponse.json(
        { error: "Enter a GitHub username" },
        { status: 400 }
      )
    }

    const result = await generateWrapped(username)
    const shareId = await saveWrappedResult(result)

    return NextResponse.json({ ...result, shareId })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate wrap"

    const status =
      error instanceof Error && error.message === "DATABASE_URL is not set"
        ? 503
        : 400

    return NextResponse.json({ error: message }, { status })
  }
}
