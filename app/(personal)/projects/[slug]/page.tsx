import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { defineQuery, toPlainText } from 'next-sanity'

import { ProjectPage } from '@/components/pages/project/ProjectPage'
import { sanityFetch } from '@/sanity/lib/live'
import { projectBySlugQuery } from '@/sanity/lib/queries'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params,
    stega: false,
  })
  const ogImage = urlForOpenGraphImage(project?.coverImage as unknown as any)

  return {
    title: project?.title,
    description: project?.overview
      ? toPlainText(project.overview)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

const projectSlugsQuery = defineQuery(
  /* groq */ `*[_type == "project" && defined(slug.current)]{"slug": slug.current}`,
)
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: projectSlugsQuery,
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function ProjectSlugRoute({ params }: Props) {
  const { data } = await sanityFetch({
    query: projectBySlugQuery,
    params,
    stega: false,
  })

  if (!data) {
    notFound()
  }

  return <ProjectPage data={data} />
}
