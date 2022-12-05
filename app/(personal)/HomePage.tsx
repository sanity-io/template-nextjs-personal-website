import IntroTemplate from 'intro-template'

import { Header, ProjectListItem } from './components'
import { Home } from './queries'

export function HomePage({ home }: { home: Home }) {
  const { title, overview, showcaseProjects } = home

  return (
    <div>
      <Header title={title} description={overview} />
      {showcaseProjects && showcaseProjects.length > 0 && (
        <div className="mb-20 rounded-md border">
          {showcaseProjects.map((project, key) => (
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
