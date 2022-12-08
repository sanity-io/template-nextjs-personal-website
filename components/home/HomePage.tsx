import { Header } from 'components/Header'
import { ProjectListItem } from 'components/ProjectListItem'
import IntroTemplate from 'intro-template'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { HomePagePayload } from 'types'

export function HomePage({
  data,
  preview,
}: {
  data: HomePagePayload
  preview?: boolean
}) {
  if (!data && !preview) {
    notFound()
  }

  // Default to an empty object to allow previews on non-existent documents
  const { overview, showcaseProjects, title } = data

  return (
    <div className="space-y-20">
      {/* Header */}
      {title && <Header centered title={title} description={overview} />}
      {/* Showcase projects */}
      {showcaseProjects && showcaseProjects.length > 0 && (
        <div className="rounded-md border">
          {showcaseProjects.map((project, key) => (
            <Link key={key} href={`/project/${project.slug}`}>
              <ProjectListItem project={project} odd={key % 2} />
            </Link>
          ))}
        </div>
      )}
      {/* Intro template */}
      <IntroTemplate />
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
