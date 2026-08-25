import { ogImageContentType, ogImageSize } from "@/lib/og-shared"
import { createOgImage, ogImageAlt } from "@/lib/og-image"

export const alt = ogImageAlt
export const size = ogImageSize
export const contentType = ogImageContentType

export default createOgImage
