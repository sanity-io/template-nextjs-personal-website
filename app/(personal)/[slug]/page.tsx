import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { defineQuery, toPlainText } from 'next-sanity'

import { Page } from '@/components/pages/page/Page'
import { sanityFetch } from '@/sanity/lib/live'
import { pagesBySlugQuery } from '@/sanity/lib/queries'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: pagesBySlugQuery,
    params,
    stega: false,
  })

  return {
    title: page?.title,
    description: page?.overview
      ? toPlainText(page.overview)
      : (await parent).description,
  }
}

const pageSlugsQuery = defineQuery(
  /* groq */ `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
)
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pageSlugsQuery,
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function PageSlugRoute({ params }: Props) {
  const { data } = await sanityFetch({ query: pagesBySlugQuery, params })

  if (!data) {
    notFound()
  }

  return <Page data={data} />
}
