import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute} from 'next-sanity'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import projectSlugPageQuery, {
  type QueryResponse,
} from '#queries/projectSlugPage.groq' with {type: 'text'}
import projectSlugPageMetadataQuery from '#queries/projectSlugPageMetadata.groq' with {type: 'text'}
import slugsByTypeQuery from '#queries/slugsByType.groq' with {type: 'text'}
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
import {urlForOpenGraphImage} from '@/sanity/lib/utils'

import {ProjectDuration} from './ProjectDuration'

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'project'},
  })
  if (data.length > 0) {
    return data
  }
  // Cache Components requires `generateStaticParams` to return at least one param — an empty
  // array fails the build (https://nextjs.org/docs/messages/empty-generate-static-params).
  // With no project documents in the dataset yet, prerender a placeholder slug that resolves
  // to the 404 page instead.
  return [{slug: '__placeholder__'}]
}

export async function generateMetadata(
  {params}: PageProps<'/projects/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
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
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedProjectSlugPage slug={slug} perspective={perspective} stega={stega} />
}

/**
 * Cache leaf for the project document. The explicit return type comes straight off the `.groq`
 * module, from the same import statement as the query it describes.
 */
async function fetchProject(
  slug: string,
  {perspective, stega}: DynamicFetchOptions,
): Promise<QueryResponse> {
  'use cache'
  const {data} = await sanityFetch({
    query: projectSlugPageQuery,
    params: {slug},
    perspective,
    stega,
  })
  return data
}

async function CachedProjectSlugPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/projects/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const data = await fetchProject(slug, {perspective, stega})

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

  return (
    <div className="space-y-6" data-testid="project-content">
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
          classesWrapper="relative aspect-video"
        />

        <div className="grid grid-cols-1 divide-y divide-inherit lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {/* Duration */}
          <ProjectDuration
            duration={duration}
            data-sanity-start={dataAttribute?.('duration.start')}
            data-sanity-end={dataAttribute?.('duration.end')}
          />

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
                <Link target="_blank" className="text-md wrap-break-word md:text-lg" href={site}>
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
                <div key={key} className="mr-1 wrap-break-word">
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
  )
}
