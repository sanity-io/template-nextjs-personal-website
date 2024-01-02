'use client'

import { type QueryResponseInitial } from '@sanity/react-loader'

import { projectBySlugQuery } from '@/sanity/lib/queries'
import { useQuery } from '@/sanity/loader/useQuery'
import { ProjectPayload } from '@/types'

import ProjectPage from './ProjectPage'

type Props = {
  params: { slug: string }
  initial: QueryResponseInitial<ProjectPayload | null>
}

console.log(
  'ProjectPreview, this should never log in production outside Draft Mode',
)

export default function ProjectPreview(props: Props) {
  const { params, initial } = props
  const { data, encodeDataAttribute } = useQuery<ProjectPayload | null>(
    projectBySlugQuery,
    params,
    { initial },
  )

  return <ProjectPage data={data!} encodeDataAttribute={encodeDataAttribute} />
}
