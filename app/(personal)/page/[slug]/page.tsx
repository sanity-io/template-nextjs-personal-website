import { previewData } from 'next/headers'

import { Page } from '../../../../components/page/Page'
import { PagePreview } from '../../../../components/page/PagePreview'
import { PreviewSuspense } from '../../../../components/PreviewSuspense'
import { getPageBySlug } from '../../../../lib/sanity.client'

export default async function PageSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const token = previewData().token || null
  const about = await getPageBySlug(slug)

  return (
    <>
      {token ? (
        <>
          <PreviewSuspense fallback={<Page page={about} />}>
            <PagePreview token={token} slug={params.slug} />
          </PreviewSuspense>
        </>
      ) : (
        <Page page={about} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
