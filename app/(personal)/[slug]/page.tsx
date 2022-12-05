import { Project } from 'app/(personal)/components'

import { getProjectBySlug } from './queries'

export default async function SlugRoute({
  params,
}: {
  params: { slug: 'project-a' }
}) {
  const data = getProjectBySlug('project-a')
  console.log(data)

  //   return <Project data={await data} settings={await settings} />
  return <Project />
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
