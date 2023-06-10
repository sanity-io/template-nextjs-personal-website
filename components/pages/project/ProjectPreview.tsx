import { projectBySlugQuery } from 'lib/sanity.queries'
import { useListeningQuery, useListeningQueryStatus } from 'next-sanity/preview'
import type { ProjectPayload } from 'types'

import { ProjectPage, ProjectPageProps } from './ProjectPage'

export default function ProjectPreview({
  settings,
  project,
  homePageTitle,
}: ProjectPageProps) {
  const params = { slug: project?.slug }
  const projectPreview = useListeningQuery<ProjectPayload>(
    project,
    projectBySlugQuery,
    params
  )
  const loading =
    useListeningQueryStatus(projectBySlugQuery, params) === 'loading'

  return (
    <ProjectPage
      project={projectPreview}
      settings={settings}
      homePageTitle={homePageTitle}
      preview
      loading={loading}
    />
  )
}
