import { ProjectPreview } from 'components/project/ProjectPreview'
import { previewData } from 'next/headers'

import { PreviewSuspense } from '../../../../components/PreviewSuspense'
import { ProjectPage } from '../../../../components/project/ProjectPage'
import { getProjectBySlug } from '../../../../lib/sanity.client'

export default async function ProjectSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const token = previewData().token || null
  const project = await getProjectBySlug(params.slug)

  return (
    <>
      {token ? (
        <PreviewSuspense fallback={<ProjectPage project={project} />}>
          <ProjectPreview token={token} slug={params.slug} />
        </PreviewSuspense>
      ) : (
        <ProjectPage project={project} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
