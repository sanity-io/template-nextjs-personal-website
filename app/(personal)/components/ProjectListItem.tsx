import { PortableText } from '@portabletext/react'
import { ShowcaseProjects } from 'app/(personal)/queries'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectProps {
  project?: ShowcaseProjects
  odd: number
}

export function ProjectListItem(props: ProjectProps) {
  const { project, odd } = props
  const slug = project.title

  if (odd === 1) {
    return (
      <Link href={`/projects/${slug}`}>
        <div className="flex border-t border-b">
          <div className="ml-4">
            <div className="font-inter mb-2 mt-4 text-2xl font-extrabold">
              {project.title}
            </div>
            <div className="font-serif text-gray-500">
              <PortableText value={project.overview} />
            </div>
          </div>
          <div className="col-span-4">
            <Image
              className="h-auto w-full rounded-md p-2"
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
        </div>
      </Link>
    )
  } else {
    return (
      <Link href={`/projects/${slug}`}>
        <div className="flex">
          <div className="col-span-4">
            <Image
              className="h-full w-auto p-2"
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
          <div>
            <div className="font-inter mb-2 mt-4 text-2xl font-extrabold">
              {project.title}
            </div>
            <div className="font-serif text-gray-500">
              <PortableText value={project.overview} />
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
