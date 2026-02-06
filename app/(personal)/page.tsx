import {Header} from '@/components/Header'
import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {ProjectListItem} from '@/components/ProjectListItem'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute} from 'next-sanity'
import Link from 'next/link'
import {Suspense} from 'react'

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <Template>
          <Header id={null} type={null} path={['overview']} title="Loading home page…" centered />
        </Template>
      }
    >
      <DynamicHomePage />
    </Suspense>
  )
}

async function DynamicHomePage() {
  const {perspective, stega} = await getDynamicFetchOptions()

  return <CachedHomePage perspective={perspective} stega={stega} />
}

async function CachedHomePage({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: homePageQuery, perspective, stega})

  if (!data) {
    return (
      <div className="text-center">
        You don&rsquo;t have a homepage yet,{' '}
        <Link href={`${studioUrl}/structure/home`} className="underline">
          create one now
        </Link>
        !
      </div>
    )
  }

  // Default to an empty object to allow previews on non-existent documents
  const {overview = [], showcaseProjects = [], title = ''} = data ?? {}

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return (
    <Template>
      {/* Header */}
      {title && (
        <Header
          id={data?._id || null}
          type={data?._type || null}
          path={['overview']}
          centered
          title={title}
          description={overview}
        />
      )}
      {/* Showcase projects */}
      <div className="mx-auto max-w-[100rem] rounded-md border">
        <OptimisticSortOrder id={data?._id} path={'showcaseProjects'}>
          {showcaseProjects &&
            showcaseProjects.length > 0 &&
            showcaseProjects.map((project) => {
              const href = resolveHref(project?._type, project?.slug)
              if (!href) {
                return null
              }
              return (
                <Link
                  className="flex flex-col gap-x-5 p-2 transition odd:border-b odd:border-t hover:bg-gray-50/50 xl:flex-row odd:xl:flex-row-reverse"
                  key={project._key}
                  href={href}
                  data-sanity={dataAttribute?.(['showcaseProjects', {_key: project._key}])}
                >
                  <ProjectListItem project={project as any} />
                </Link>
              )
            })}
        </OptimisticSortOrder>
      </div>
    </Template>
  )
}

function Template({children}: {children: React.ReactNode}) {
  return <div className="space-y-20">{children}</div>
}
