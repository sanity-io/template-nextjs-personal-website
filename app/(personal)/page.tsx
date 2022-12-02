import IntroTemplate from 'intro-template'

import { Header, Project } from './components'
import { getSettings } from './queries'

export default async function Page() {
  const settings = await getSettings()
  const projects = settings?.showcaseProjects

  return (
    <div>
      <Header title={settings.title} />
      <div>
        {projects.map((project, key) => (
          <Project
            key={key}
            title={project.title}
            overview={project.overview}
            coverImage={project.coverImage}
          />
        ))}
      </div>
      {/* <IntroTemplate /> */}
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
