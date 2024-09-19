import Link from 'next/link'

import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { Header } from '@/components/shared/Header'
import ImageBox from '@/components/shared/ImageBox'
import type { ProjectBySlugQueryResult } from '@/sanity.types'
import { createDataAttribute } from 'next-sanity'

export interface ProjectPageProps {
  data: ProjectBySlugQueryResult | null
}

export function ProjectPage({ data }: ProjectPageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const {
    _id,
    _type,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    tags,
    title,
  } = data ?? {}

  const dataAttribute = createDataAttribute({
    id: data?._id,
    type: data?._type,
  })

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
            image={coverImage as unknown as any}
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
                  <span
                    data-sanity={dataAttribute
                      .scope('duration.start')
                      .toString()}
                  >
                    {startYear}
                  </span>
                  {' - '}
                  <span
                    data-sanity={dataAttribute.scope('duration.end').toString()}
                  >
                    {endYear}
                  </span>
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
                  <Link
                    target="_blank"
                    className="text-md break-words md:text-lg"
                    href={site}
                  >
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
                  <div key={key} className="mr-1 break-words ">
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
            value={description as unknown as any}
          />
        )}
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}

export default ProjectPage
