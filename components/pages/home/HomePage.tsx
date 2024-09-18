import Link from 'next/link'
import { createDataAttribute } from 'next-sanity'

import { ProjectListItem } from '@/components/pages/home/ProjectListItem'
import { Header } from '@/components/shared/Header'
import type { HomePageQueryResult } from '@/sanity.types'
import { resolveHref } from '@/sanity/lib/utils'

export interface HomePageProps {
  data: HomePageQueryResult | null
}

export function HomePage({ data }: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], showcaseProjects = [], title = '' } = data ?? {}

  const dataAttribute = createDataAttribute({
    id: data?._id,
    type: data?._type,
  })

  return (
    <div className="space-y-20">
      {/* Header */}
      {title && (
        <Header
          centered
          title={title}
          description={overview as unknown as any}
        />
      )}
      {/* Showcase projects */}
      {showcaseProjects && showcaseProjects.length > 0 && (
        <div className="mx-auto max-w-[100rem] rounded-md border">
          {showcaseProjects.map((project, i) => {
            const href = resolveHref(project?._type, project?.slug)
            if (!href) {
              return null
            }
            return (
              <Link
                key={project._key}
                href={href}
                data-sanity={dataAttribute
                  .scope(['showcaseProjects', { _key: project._key }])
                  .toString()}
              >
                <ProjectListItem project={project} odd={i % 2} />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HomePage
