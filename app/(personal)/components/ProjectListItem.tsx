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
  //Fix slug
  const slug = project.title

  if (odd === 1) {
    return (
      <Link href={`/projects/${slug}`}>
        <div className="flex border-t border-b">
          <TextBox project={project} />
          <ImageBox project={project} />
        </div>
      </Link>
    )
  } else {
    return (
      <Link href={`/projects/${slug}`}>
        <div className="flex">
          <ImageBox project={project} />
          <TextBox project={project} />
        </div>
      </Link>
    )
  }
}

function ImageBox({ project }: { project: ShowcaseProjects }) {
  return (
    <div className="col-span-4 p-2">
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
  )
}

function TextBox({ project }: { project: ShowcaseProjects }) {
  return (
    <div className="relative z-0 mx-5">
      <div className="font-inter mb-2 mt-4 text-2xl font-extrabold">
        {project.title}
      </div>
      <div className="font-serif text-gray-500">
        <PortableText value={project.overview} />
      </div>
      <div className="absolute bottom-0 left-0 mb-5 flex flex-row">
        {project.tags?.map((tag, key) => (
          <div className="mr-2 text-lg" key={key}>
            #{tag}
          </div>
        ))}
      </div>
    </div>
  )
}
