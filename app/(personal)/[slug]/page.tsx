import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText } from 'next-sanity'

import { Page } from '@/components/pages/page/Page'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { loadPage } from '@/sanity/loader/loadQuery'
const PagePreview = dynamic(() => import('@/components/pages/page/PagePreview'))

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const { data: page } = await loadPage(params.slug)

  return {
    title: page?.title,
    description: page?.overview
      ? toPlainText(page.overview)
      : (await parent).description,
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('page')
}

export default async function PageSlugRoute(props: Props) {
  const params = await props.params
  const initial = await loadPage(params.slug)

  if ((await draftMode()).isEnabled) {
    return <PagePreview params={params} initial={initial} />
  }

  if (!initial.data) {
    notFound()
  }

  return <Page data={initial.data} />
}
