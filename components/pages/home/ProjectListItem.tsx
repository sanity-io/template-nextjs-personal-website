import { PortableText } from '@portabletext/react'
import ImageBox from 'components/shared/ImageBox'
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
        <ImageBox
          image={project.coverImage}
          alt={`Cover image from ${project.title}`}
          classesWrapper="relative aspect-[16/9]"
        />
      </div>
      <div className="flex w-1/4">
        <TextBox project={project} />
      </div>
    </div>
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
          <div className="text-lg font-medium lowercase" key={key}>
            #{tag}
          </div>
        ))}
      </div>
    </div>
  )
}
