import IntroTemplate from 'intro-template'

import { Header, Project } from './components'
import { getSettings } from './queries'

export default async function Page() {
  const settings = await getSettings()
  const projects = settings?.showcaseProjects

  return (
    <div>
      <Header title={settings.title} description={settings.overview} />
      {projects && projects.length > 0 && (
        <div className="mb-20 rounded-md border-2">
          {projects.map((project, key) => (
            <Project key={key} project={project} odd={key % 2} />
          ))}
        </div>
      )}

      {/* <IntroTemplate /> */}
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
