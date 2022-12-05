import IntroTemplate from 'intro-template'

import { Header, ProjectListItem } from './components'
import { Settings } from './queries'

export function HomePage({ settings }: { settings: Settings }) {
  const projects = settings?.showcaseProjects

  return (
    <div>
      <Header title={settings.title} description={settings.overview} />
      {projects && projects.length > 0 && (
        <div className="mb-20 rounded-md border">
          {projects.map((project, key) => (
            <ProjectListItem key={key} project={project} odd={key % 2} />
          ))}
        </div>
      )}
      <IntroTemplate />
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
