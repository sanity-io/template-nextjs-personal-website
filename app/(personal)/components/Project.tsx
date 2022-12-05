import { PortableText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

import { Project } from '../[slug]/queries'
import { Header } from './Header'

export function Project({ project }: { project: Project }) {
  return (
    <div>
      <Header title={project.title} description={project.overview} />
      <div className="grid grid-cols-4 rounded-md border">
        <div className="col-span-4">
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
        </div>

        <div className="border-r p-4">
          <div className="font-inter text-sm">Duration</div>
          <div>{`${project.duration.start} -  ${project.duration.end}`}</div>
        </div>

        <div className="border-r p-4">
          <div className="font-inter text-sm">Client</div>
          <div>{project.client}</div>
        </div>

        <div className="border-r p-4">
          <div className="font-inter text-sm">Site</div>
          <Link target="_blank" href={project.site}>
            {project.site}
          </Link>
        </div>

        <div className="p-4">
          <div className="font-inter text-sm">Tags</div>
          <div>Tags</div>
        </div>
      </div>
      <div className="py-12 font-serif text-gray-600">
        <PortableText value={project?.description} />
      </div>
    </div>
  )
}
