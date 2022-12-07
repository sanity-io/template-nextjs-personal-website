import { ProjectPage } from '../../../../components/ProjectPage'
import { getProjectBySlug } from '../../../../lib/sanity.client'

export default async function ProjectSlugRoute({
  params,
}: {
  params: { slug: string }
}) {
  return <ProjectPage project={await getProjectBySlug(params.slug)} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
