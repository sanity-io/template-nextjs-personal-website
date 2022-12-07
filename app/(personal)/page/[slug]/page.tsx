import { previewData } from 'next/headers'

import { Page } from '../../../../components/Page'
import { AboutPagePreview } from '../../../../components/PagePreview'
import { PreviewSuspense } from '../../../../components/PreviewSuspense'
import { getPageBySlug } from '../../../../lib/sanity.client'

export default async function PageSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const token = previewData().token || null
  const about = await getPageBySlug('about')

  return (
    <>
      {token ? (
        <PreviewSuspense fallback={<Page page={about} />}>
          <AboutPagePreview token={token} />
        </PreviewSuspense>
      ) : (
        <Page page={about} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
