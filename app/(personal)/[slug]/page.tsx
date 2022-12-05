import { Project } from 'app/(personal)/components'

import { getProjectBySlug } from './queries'

export default async function SlugRoute({
  params,
}: {
  params: { slug: 'project-a' }
}) {
  const project = await getProjectBySlug(params.slug)
  console.log(project)

  //   return <Project data={await data} settings={await settings} />
  return <Project project={project} />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
