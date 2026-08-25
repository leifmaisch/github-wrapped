import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SharedWrappedPage } from "@/components/wrapped/wrapped-page"
import { createSharedWrapMetadata } from "@/lib/site-metadata"
import { getWrapByShareId } from "@/lib/wraps-store"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: PageProps<"/r/[id]">): Promise<Metadata> {
  const { id } = await params
  const result = await getWrapByShareId(id)

  if (!result) {
    return { title: "Wrap not found" }
  }

  return createSharedWrapMetadata(result, id)
}

export default async function Page({ params }: PageProps<"/r/[id]">) {
  const { id } = await params
  const result = await getWrapByShareId(id)

  if (!result) {
    notFound()
  }

  return <SharedWrappedPage result={result} />
}
