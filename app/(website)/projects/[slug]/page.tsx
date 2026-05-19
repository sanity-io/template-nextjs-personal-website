import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {slugsByTypeQuery, type SlugsByTypeQueryParams} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute, defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

export async function generateStaticParams() {
  return sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'project'} satisfies SlugsByTypeQueryParams,
  })
}

const projectSlugPageMetadataQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    coverImage,
    title,
    "overview": pt::text(overview),
  }
`)

async function cachedProjectMetadata({
  slug,
  perspective,
}: {slug: string} & Pick<DynamicFetchOptions, 'perspective'>) {
  'use cache'
  const {data} = await sanityFetchMetadata({
    query: projectSlugPageMetadataQuery,
    params: {slug},
    perspective,
  })
  return data
}

export async function generateMetadata(
  {params}: PageProps<'/projects/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const data = await cachedProjectMetadata({slug, perspective})

  const ogImage = urlForOpenGraphImage(data?.coverImage)
  return {
    title: data?.title,
    description: data?.overview || (await parent).description,
    openGraph: ogImage ? {images: [ogImage, ...((await parent).openGraph?.images || [])]} : {},
  }
}

const projectSlugPageQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
  }
`)

export default async function ProjectSlugPage({params}: PageProps<'/projects/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<ProjectSlugPageFallback />}>
        <DynamicProjectSlugPage params={params} />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedProjectSlugPage slug={slug} perspective="published" stega={false} />
}

async function DynamicProjectSlugPage({params}: Pick<PageProps<'/projects/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedProjectSlugPage slug={slug} perspective={perspective} stega={stega} />
}

async function CachedProjectSlugPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/projects/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({
    query: projectSlugPageQuery,
    params: {slug},
    perspective,
    stega,
  })

  // Only show the 404 page if we're in production, when in draft mode we might be about to create a project on this slug, and live reload won't work on the 404 route
  if (!data?._id && perspective === 'published') {
    notFound()
  }

  const dataAttribute =
    data?._id && data._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  // Default to an empty object to allow previews on non-existent documents
  const {client, coverImage, description, duration, overview, site, tags, title} = data ?? {}

  const startYear = duration?.start ? new Date(duration.start).getFullYear() : undefined
  const endYear = duration?.end ? new Date(duration?.end).getFullYear() : 'Now'

  return (
    <div>
      <div className="mb-20 space-y-6">
        {/* Header */}
        <Header
          id={data?._id || null}
          type={data?._type || null}
          path={['overview']}
          title={title || (data?._id ? 'Untitled' : '404 Project Not Found')}
          description={overview}
        />

        <div className="rounded-md border">
          {/* Image  */}
          <ImageBox
            data-sanity={dataAttribute?.('coverImage')}
            image={coverImage}
            // @TODO add alt field in schema
            alt=""
            classesWrapper="relative aspect-[16/9]"
          />

          <div className="divide-inherit grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {/* Duration */}
            {!!(startYear && endYear) && (
              <div className="p-3 lg:p-4">
                <div className="text-xs md:text-sm">Duration</div>
                <div className="text-md md:text-lg">
                  <span data-sanity={dataAttribute?.('duration.start')}>{startYear}</span>
                  {' - '}
                  <span data-sanity={dataAttribute?.('duration.end')}>{endYear}</span>
                </div>
              </div>
            )}

            {/* Client */}
            {client && (
              <div className="p-3 lg:p-4">
                <div className="text-xs md:text-sm">Client</div>
                <div className="text-md md:text-lg">{client}</div>
              </div>
            )}

            {/* Site */}
            {site && (
              <div className="p-3 lg:p-4">
                <div className="text-xs md:text-sm">Site</div>
                {site && (
                  <Link target="_blank" className="text-md break-words md:text-lg" href={site}>
                    {site}
                  </Link>
                )}
              </div>
            )}

            {/* Tags */}
            <div className="p-3 lg:p-4">
              <div className="text-xs md:text-sm">Tags</div>
              <div className="text-md flex flex-row flex-wrap md:text-lg">
                {tags?.map((tag, key) => (
                  <div key={key} className="mr-1 break-words">
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {Array.isArray(description) && (
          <CustomPortableText
            id={data?._id || null}
            type={data?._type || null}
            path={['description']}
            paragraphClasses="font-serif max-w-3xl text-xl text-gray-600"
            value={description}
          />
        )}
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}

function ProjectSlugPageFallback() {
  return (
    <div>
      <div className="mb-20 space-y-6">
        <Header id={null} type={null} path={['overview']} title="Loading page&hellip;" />
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
