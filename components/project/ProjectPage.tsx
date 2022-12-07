import { PortableText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

import type { ProjectPayload } from '../../types'
import { Header } from '../Header'

export function ProjectPage({ project }: { project: ProjectPayload }) {
  const startYear = new Date(project?.duration?.start).getFullYear()
  const endYear = project?.duration?.end
    ? new Date(project?.duration?.end).getFullYear()
    : 'Now'

  return (
    <div>
      <Header title={project.title} description={project.overview} />
      <div className="grid grid-cols-4 rounded-md border">
        <div className="col-span-4">
          {project.coverImage?.asset?._ref ? (
            <Image
              className="h-auto w-full rounded-md"
              alt={`Cover image for ${project.title}`}
              width={3500}
              height={2000}
              sizes="100vw"
              src={
                project.coverImage?.asset?._ref &&
                urlForImage(project.coverImage)
                  .height(2000)
                  .width(3500)
                  .fit('crop')
                  .url()
              }
            />
          ) : (
            <div className="bg-gray-200" style={{ paddingTop: '50%' }} />
          )}
        </div>

        <div className="border-r p-4">
          <div className="text-sm">Duration</div>
          {Boolean(startYear && endYear) && (
            <div className="text-lg">{`${startYear} -  ${endYear}`}</div>
          )}
        </div>

        <div className="border-r p-4 text-lg">
          <div className="text-sm">Client</div>
          <div>{project?.client}</div>
        </div>

        <div className="border-r p-4">
          <div className="text-sm">Site</div>
          {project.site && (
            <Link
              target="_blank"
              className="break-words text-lg"
              href={project.site}
            >
              {project.site}
            </Link>
          )}
        </div>

        <div className="p-4">
          <div className="text-sm">Tags</div>
          <div className="flex flex-row flex-wrap text-lg">
            {project?.tags?.map((tag, key) => (
              <div key={key} className="mr-1 break-words ">
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-12 font-serif text-gray-600">
        <PortableText value={project?.description} />
      </div>
    </div>
  )
}
