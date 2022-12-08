import { PortableText } from '@portabletext/react'
import { Header } from 'components/shared/Header'
import ScrollUp from 'components/shared/ScrollUp'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
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

  const imageUrl =
    coverImage &&
    urlForImage(coverImage)?.height(2000).width(3500).fit('crop').url()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header title={title} description={overview} />

      <div className="rounded-md border">
        {/* Image  */}
        <div className="w-full">
          {imageUrl ? (
            <Image
              className="h-auto w-full rounded-md"
              alt={`Cover image for ${title}`}
              width={3500}
              height={2000}
              sizes="100vw"
              src={imageUrl}
            />
          ) : (
            <div className="bg-gray-200" style={{ paddingTop: '50%' }} />
          )}
        </div>

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
                <div key={key} className="mr-1 break-words ">
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
