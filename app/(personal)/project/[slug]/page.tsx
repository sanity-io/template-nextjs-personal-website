import { ProjectPage } from '../../../../components/ProjectPage'
import { getProjectBySlug } from '../../../../lib/sanity.client'

export default async function ProjectSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProjectBySlug(params.slug)
  return <ProjectPage project={project} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
