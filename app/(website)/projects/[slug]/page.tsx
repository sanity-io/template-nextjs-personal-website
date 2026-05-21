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
  const {data} = await sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'project'} satisfies SlugsByTypeQueryParams,
  })
  return data
}

export async function generateMetadata(
  {params}: PageProps<'/projects/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const projectSlugPageMetadataQuery = defineQuery(`
    *[_type == "project" && slug.current == $slug][0] {
      coverImage,
      title,
      "overview": pt::text(overview),
    }
  `)
  const {data} = await sanityFetchMetadata({
    query: projectSlugPageMetadataQuery,
    params: {slug},
    perspective,
  })

  const ogImage = urlForOpenGraphImage(data?.coverImage)
  return {
    title: data?.title,
    description: data?.overview || (await parent).description,
    openGraph: ogImage ? {images: [ogImage, ...((await parent).openGraph?.images || [])]} : {},
  }
}

export default async function ProjectSlugPage({params}: PageProps<'/projects/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    const {slug} = await params
    return <CachedProjectSlugPage slug={slug} perspective="published" stega={false} />
  }
  return (
    <Suspense>
      <DynamicProjectSlugPage params={params} />
    </Suspense>
  )
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
  const {data} = await sanityFetch({
    query: projectSlugPageQuery,
    params: {slug},
    perspective,
    stega,
  })

  if (!data?._id) notFound()

  const dataAttribute =
    data?._id && data._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  const {client, coverImage, description, duration, overview, site, tags, title} = data ?? {}

  const startYear = duration?.start ? new Date(duration.start).getFullYear() : undefined
  const endYear = duration?.end ? new Date(duration?.end).getFullYear() : 'Now'

  return (
    <>
      {/* Header */}
      <Header
        id={data?._id || null}
        type={data?._type || null}
        path={['overview']}
        title={title || 'Untitled'}
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
    </>
  )
}
