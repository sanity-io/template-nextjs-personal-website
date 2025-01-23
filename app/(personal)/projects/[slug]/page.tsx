import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import { ProjectPage } from '@/components/pages/project/ProjectPage'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadProject } from '@/sanity/loader/loadQuery'
const ProjectPreview = dynamic(
  () => import('@/components/pages/project/ProjectPreview'),
)

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const { data: project } = await loadProject(params.slug)
  const ogImage = urlForOpenGraphImage(project?.coverImage)

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

export function generateStaticParams() {
  return generateStaticSlugs('project')
}

export default async function ProjectSlugRoute(props: Props) {
  const params = await props.params
  const initial = await loadProject(params.slug)

  if ((await draftMode()).isEnabled) {
    return <ProjectPreview params={params} initial={initial} />
  }

  if (!initial.data) {
    notFound()
  }

  return <ProjectPage data={initial.data} />
}
