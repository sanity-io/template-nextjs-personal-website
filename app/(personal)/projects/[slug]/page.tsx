import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {projectBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute, toPlainText} from 'next-sanity'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug} = await params
  const {perspective} = await getDynamicFetchOptions()
  const data = await cachedProjectMetadata({slug, perspective})
  // @ts-ignore the image type sometimes fails
  const ogImage = urlForOpenGraphImage(data?.coverImage)

  return {
    title: data?.title,
    description: data?.overview ? toPlainText(data.overview) : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

async function cachedProjectMetadata({
  slug,
  perspective,
}: {slug: string} & Pick<DynamicFetchOptions, 'perspective'>) {
  'use cache'
  const {data} = await sanityFetch({
    query: projectBySlugQuery,
    params: {slug},
    perspective,
    stega: false,
  })
  return data
}

export async function generateStaticParams() {
  return sanityFetchStaticParams({query: slugsByTypeQuery, params: {type: 'project'}})
}

export default async function ProjectSlugRoute({params}: Props) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<ProjectTemplate />}>
        <DynamicProjectSlug params={params} />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedProjectSlug slug={slug} perspective="published" stega={false} />
}

async function DynamicProjectSlug({params}: Props) {
  const {slug} = await params
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedProjectSlug slug={slug} perspective={perspective} stega={stega} />
}

async function CachedProjectSlug({
  slug,
  perspective,
  stega,
}: {slug: string} & Pick<DynamicFetchOptions, 'perspective' | 'stega'>) {
  'use cache'
  const {data} = await sanityFetch({
    query: projectBySlugQuery,
    params: {slug},
    perspective,
    stega,
  })

  if (!data?._id) {
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
    <ProjectTemplate>
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
          image={coverImage as any}
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
      {description && (
        <CustomPortableText
          id={data?._id || null}
          type={data?._type || null}
          path={['description']}
          paragraphClasses="font-serif max-w-3xl text-xl text-gray-600"
          value={description as any}
        />
      )}
    </ProjectTemplate>
  )
}

function ProjectTemplate({children}: {children?: React.ReactNode}) {
  return (
    <div>
      <div className="mb-20 space-y-6">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
