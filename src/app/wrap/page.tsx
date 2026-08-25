import { createWrapMetadata } from "@/lib/site-metadata"

import { WrapPage } from "@/components/wrapped/wrapped-page"

export const metadata = createWrapMetadata()

export default function Page() {
  return <WrapPage />
}
