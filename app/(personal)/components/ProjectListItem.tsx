import { PortableText } from '@portabletext/react'
import { ShowcaseProjects } from 'app/(personal)/queries'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'

interface ProjectProps {
  project?: ShowcaseProjects
  odd: number
}

export function ProjectListItem(props: ProjectProps) {
  const { project, odd } = props

  return (
    <div className={`flex ${odd && 'flex-row-reverse border-t border-b'}`}>
      <ImageBox project={project} />
      <TextBox project={project} />
    </div>
  )
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
