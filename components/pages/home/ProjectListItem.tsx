import { PortableText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import type { ShowcaseProject } from 'types'

interface ProjectProps {
  project: ShowcaseProject
  odd: number
}

export function ProjectListItem(props: ProjectProps) {
  const { project, odd } = props

  return (
    <div
      className={`flex gap-x-5 p-2 transition hover:bg-gray-50/50 ${
        odd && 'flex-row-reverse border-t border-b'
      }`}
    >
      <div className="w-9/12">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3px] bg-gray-50">
          <ImageBox project={project} />
        </div>
      </div>
      <div className="flex w-1/4">
        <TextBox project={project} />
      </div>
    </div>
  )
}

// @todo: consider a generic image component
function ImageBox({ project }: { project: ShowcaseProject }) {
  const imageUrl =
    project.coverImage &&
    urlForImage(project.coverImage)?.height(2000).width(3500).fit('crop').url()

  if (!imageUrl) {
    return null
  }

  return (
    <Image
      className="absolute h-full w-full"
      alt={`Cover image for ${project.title}`}
      width={3500}
      height={2000}
      sizes="100vw"
      src={imageUrl}
    />
  )
}

function TextBox({ project }: { project: ShowcaseProject }) {
  return (
    <div className="relative flex w-full flex-col justify-between p-3">
      <div>
        {/* Title */}
        <div className="mb-2 text-2xl font-extrabold tracking-tight">
          {project.title}
        </div>
        {/* Overview  */}
        <div className="font-serif text-gray-500">
          <PortableText value={project.overview} />
        </div>
      </div>
      {/* Tags */}
      <div className="mt-4 flex flex-row gap-x-2">
        {project.tags?.map((tag, key) => (
          <div className="text-lg font-medium" key={key}>
            #{tag}
          </div>
        ))}
      </div>
    </div>
  )
}
