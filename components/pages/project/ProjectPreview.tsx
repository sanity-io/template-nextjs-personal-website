import { projectBySlugQuery } from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'
import type { ProjectPayload } from 'types'

import { ProjectPage, ProjectPageProps } from './ProjectPage'

export default function ProjectPreview({
  settings,
  project: initialProject,
  homePageTitle,
}: ProjectPageProps) {
  const [project, loading] = useLiveQuery<ProjectPayload | null>(
    initialProject,
    projectBySlugQuery,
    {
      slug: initialProject.slug,
    }
  )

  return (
    <ProjectPage
      project={project ?? initialProject}
      settings={settings}
      homePageTitle={homePageTitle}
      preview
      loading={loading}
    />
  )
}
