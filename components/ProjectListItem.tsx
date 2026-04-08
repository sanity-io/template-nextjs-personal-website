import {CustomPortableText} from '@/components/CustomPortableText'
import ImageBox from '@/components/ImageBox'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import type {ShowcaseProject} from '@/types'
import type {PortableTextBlock} from 'next-sanity'

interface ProjectProps {
  project: ShowcaseProject
}

export function ProjectListItem(props: ProjectProps & Pick<DynamicFetchOptions, 'isDraftMode'>) {
  const {project, isDraftMode} = props

  return (
    <>
      <div className="w-full xl:w-9/12">
        <ImageBox
          image={project.coverImage}
          alt={`Cover image from ${project.title}`}
          classesWrapper="relative aspect-[16/9]"
        />
      </div>
      <div className="flex xl:w-1/4">
        <TextBox project={project} isDraftMode={isDraftMode} />
      </div>
    </>
  )
}

function TextBox({project, isDraftMode}: {project: ShowcaseProject} & Pick<DynamicFetchOptions, 'isDraftMode'>) {
  return (
    <div className="relative mt-2 flex w-full flex-col justify-between p-3 xl:mt-0">
      <div>
        {/* Title */}
        <div className="mb-2 text-xl font-extrabold tracking-tight md:text-2xl">
          {project.title}
        </div>
        {/* Overview  */}
        <div className="font-serif text-gray-500">
          <CustomPortableText
            id={project._id}
            type={project._type}
            path={['overview']}
            value={project.overview as PortableTextBlock[]}
            isDraftMode={isDraftMode}
          />
        </div>
      </div>
      {/* Tags */}
      <div className="mt-4 flex flex-row gap-x-2">
        {project.tags?.map((tag, key) => (
          <div className="text-sm font-medium lowercase md:text-lg" key={key}>
            #{tag}
          </div>
        ))}
      </div>
    </div>
  )
}
