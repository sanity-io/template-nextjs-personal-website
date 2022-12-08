import { PreviewSuspense } from 'components/PreviewSuspense'
import { PreviewWrapper } from 'components/PreviewWrapper'
import { ProjectPage } from 'components/project/ProjectPage'
import { ProjectPreview } from 'components/project/ProjectPreview'
import { getProjectBySlug } from 'lib/sanity.client'
import { previewData } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function ProjectSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const token = previewData().token || null
  const data = await getProjectBySlug({ slug: params.slug })

  if (!data && !token) {
    notFound()
  }

  return (
    <>
      {token ? (
        <PreviewSuspense
          fallback={
            <PreviewWrapper>
              <ProjectPage data={data} />
            </PreviewWrapper>
          }
        >
          <ProjectPreview token={token} slug={params.slug} />
        </PreviewSuspense>
      ) : (
        <ProjectPage data={data} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
