import type {Metadata, ResolvingMetadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {createDataAttribute, toPlainText} from 'next-sanity'

import {CustomPortableText} from '@/components/shared/CustomPortableText'
import {Header} from '@/components/shared/Header'
import ImageBox from '@/components/shared/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {projectBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {data: project} = await sanityFetch({
    query: projectBySlugQuery,
    params,
    stega: false,
  })
  const ogImage = urlForOpenGraphImage(
    // @ts-expect-error - @TODO update @sanity/image-url types so it's compatible
    project?.coverImage,
  )

  return {
    title: project?.title,
    description: project?.overview ? toPlainText(project.overview) : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'project'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function ProjectSlugRoute({params}: Props) {
  const {data} = await sanityFetch({query: projectBySlugQuery, params})

  if (!data) {
    notFound()
  }

  const dataAttribute = createDataAttribute({
    baseUrl: studioUrl,
    id: data?._id,
    type: data?._type,
  })

  // Default to an empty object to allow previews on non-existent documents
  const {client, coverImage, description, duration, overview, site, tags, title} = data ?? {}

  const startYear = new Date(duration?.start!).getFullYear()
  const endYear = duration?.end ? new Date(duration?.end).getFullYear() : 'Now'

  return (
    <div>
      <div className="mb-20 space-y-6">
        {/* Header */}
        <Header title={title} description={overview} />

        <div className="rounded-md border">
          {/* Image  */}
          <ImageBox
            data-sanity={dataAttribute('coverImage')}
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
                  <span data-sanity={dataAttribute('duration.start')}>{startYear}</span>
                  {' - '}
                  <span data-sanity={dataAttribute('duration.end')}>{endYear}</span>
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
            paragraphClasses="font-serif max-w-3xl text-xl text-gray-600"
            value={description as any}
          />
        )}
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
