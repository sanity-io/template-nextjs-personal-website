import { PortableText } from '@portabletext/react'
import { Header } from 'components/shared/Header'
import ImageBox from 'components/shared/ImageBox'
import ScrollUp from 'components/shared/ScrollUp'
import Link from 'next/link'
import type { ProjectPayload } from 'types'

export function ProjectPage({ data }: { data: ProjectPayload }) {
  // Default to an empty object to allow previews on non-existent documents
  const {
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    tags,
    title,
  } = data || {}

  const startYear = new Date(duration?.start).getFullYear()
  const endYear = duration?.end ? new Date(duration?.end).getFullYear() : 'Now'

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header title={title} description={overview} />

      <div className="rounded-md border">
        {/* Image  */}
        <ImageBox
          image={coverImage}
          alt={`Cover image for ${title}`}
          classesWrapper="relative aspect-[16/9]"
        />

        <div className="divide-inherit grid grid-cols-4 divide-x">
          {/* Duration */}
          {!!(startYear && endYear) && (
            <div className="p-4">
              <div className="text-sm">Duration</div>
              <div className="text-lg">{`${startYear} -  ${endYear}`}</div>
            </div>
          )}

          {/* Client */}
          {client && (
            <div className="p-4 text-lg">
              <div className="text-sm">Client</div>
              <div>{client}</div>
            </div>
          )}

          {/* Site */}
          {site && (
            <div className="p-4">
              <div className="text-sm">Site</div>
              {site && (
                <Link
                  target="_blank"
                  className="break-words text-lg"
                  href={site}
                >
                  {site}
                </Link>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="p-4">
            <div className="text-sm">Tags</div>
            <div className="flex flex-row flex-wrap text-lg">
              {tags?.map((tag, key) => (
                <div key={key} className="mr-1 break-words lowercase">
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="font-serif text-gray-600">
        <PortableText value={description} />
      </div>
      {/* Workaround: scroll to top on route change */}
      <ScrollUp />
    </div>
  )
}
