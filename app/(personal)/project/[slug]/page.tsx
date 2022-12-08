import { PreviewSuspense } from 'components/PreviewSuspense'
import { ProjectPage } from 'components/project/ProjectPage'
import { ProjectPreview } from 'components/project/ProjectPreview'
import { getProjectBySlug } from 'lib/sanity.client'
import { previewData } from 'next/headers'

export default async function ProjectSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const token = previewData().token || null
  const data = await getProjectBySlug({ slug: params.slug })

  return (
    <>
      {token ? (
        <PreviewSuspense fallback={<ProjectPage data={data} preview />}>
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
