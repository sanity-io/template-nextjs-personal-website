import IntroTemplate from 'intro-template'

import { getAbout } from './about/queries'
import { Header, Project } from './components'
import { getSettings } from './queries'

export default async function Page() {
  const about = await getAbout()
  const settings = await getSettings()
  const projects = settings?.showcaseProjects
  console.log(projects)

  return (
    <div>
      <Header title={settings.title} />
      <div className="mx-12">
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
