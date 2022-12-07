import IntroTemplate from 'intro-template'
import Link from 'next/link'

import type { HomePagePayload } from '../types'
import { Header } from './Header'
import { ProjectListItem } from './ProjectListItem'

export function HomePage({ home }: { home: HomePagePayload }) {
  const { title, overview, showcaseProjects } = home

  return (
    <div>
      <Header centered title={title} description={overview} />
      {showcaseProjects && showcaseProjects.length > 0 && (
        <div className="mb-20 rounded-md border">
          {showcaseProjects.map((project, key) => (
            <Link key={key} href={`/project/${project.slug.current}`}>
              <ProjectListItem project={project} odd={key % 2} />
            </Link>
          ))}
        </div>
      )}
      <IntroTemplate />
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
