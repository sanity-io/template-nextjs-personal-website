import { draftMode } from 'next/headers'
import Link from 'next/link'
import { createDataAttribute } from 'next-sanity'

import { ProjectListItem } from '@/components/pages/home/ProjectListItem'
import { Header } from '@/components/shared/Header'
import { OptimisticSortOrder } from '@/components/shared/OptimisticSortOrder'
import type { HomePageQueryResult } from '@/sanity.types'
import { studioUrl } from '@/sanity/lib/api'
import { resolveHref } from '@/sanity/lib/utils'

export interface HomePageProps {
  data: HomePageQueryResult | null
}

export async function HomePage({ data }: HomePageProps) {
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], showcaseProjects = [], title = '' } = data ?? {}

  const dataAttribute = createDataAttribute({
    baseUrl: studioUrl,
    id: data?._id!,
    type: data?._type!,
  })

  const children =
    showcaseProjects &&
    showcaseProjects.length > 0 &&
    showcaseProjects.map((project, key) => {
      const href = resolveHref(project?._type, project?.slug)
      if (!href) {
        return null
      }
      return (
        <Link
          className="flex flex-col gap-x-5 p-2 transition hover:bg-gray-50/50 xl:flex-row odd:border-b odd:border-t odd:xl:flex-row-reverse"
          key={project._key}
          href={href}
          data-sanity={dataAttribute([
            'showcaseProjects',
            { _key: project._key },
          ])}
        >
          <ProjectListItem project={project as any} />
        </Link>
      )
    })

  return (
    <div className="space-y-20">
      {/* Header */}
      {title && <Header centered title={title} description={overview} />}
      {/* Showcase projects */}
      <div className="mx-auto max-w-[100rem] rounded-md border">
        {isDraftModeEnabled && data?._id ? (
          <OptimisticSortOrder id={data._id} path={'showcaseProjects'}>
            {children}
          </OptimisticSortOrder>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default HomePage
