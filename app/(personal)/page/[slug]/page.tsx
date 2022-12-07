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
  const { slug } = params
  const token = previewData().token || null

  return (
    <>
      {token ? (
        <PreviewSuspense fallback={<Page page={await getPageBySlug(slug)} />}>
          <AboutPagePreview token={token} />
        </PreviewSuspense>
      ) : (
        <Page page={await getPageBySlug(slug)} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
