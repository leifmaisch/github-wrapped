import { ogImageContentType, ogImageSize } from "@/lib/og-shared"
import { createOgImage } from "@/lib/og-image"
import { createWrappedOgImage } from "@/lib/og-wrapped-image"
import { getWrapByShareId } from "@/lib/wraps-store"
import { siteName } from "@/lib/site-metadata"

export const alt = `${siteName} wrap result`
export const size = ogImageSize
export const contentType = ogImageContentType
export const dynamic = "force-dynamic"

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    return createOgImage()
  }

  const result = await getWrapByShareId(id)

  if (!result) {
    return createOgImage()
  }

  return createWrappedOgImage(result)
}
