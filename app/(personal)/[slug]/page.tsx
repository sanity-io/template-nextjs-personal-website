import { Page } from 'components/page/Page'
import { PagePreview } from 'components/page/PagePreview'
import { PreviewSuspense } from 'components/PreviewSuspense'
import { getPageBySlug } from 'lib/sanity.client'
import { previewData } from 'next/headers'

export default async function PageSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const token = previewData().token || null
  const data = await getPageBySlug({ slug })

  return (
    <>
      {token ? (
        <PreviewSuspense fallback={<Page data={data} preview />}>
          <PagePreview token={token} slug={params.slug} />
        </PreviewSuspense>
      ) : (
        <Page data={data} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
