import type { Metadata, ResolvingMetadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { toPlainText, type PortableTextBlock } from 'next-sanity'

import { Page } from '@/components/pages/page/Page'
import { sanityFetch } from '@/sanity/lib/live'
import { pagesBySlugQuery, slugsByTypeQuery } from '@/sanity/lib/queries'
import { loadPage } from '@/sanity/loader/loadQuery'
const PagePreview = dynamic(() => import('@/components/pages/page/PagePreview'))
import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { Header } from '@/components/shared/Header'

type Props = {
  params: Promise<{ slug: string }>
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

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: slugsByTypeQuery,
    params: { type: 'page' },
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function PageSlugRoute({ params }: Props) {
  const { data } = await sanityFetch({ query: pagesBySlugQuery, params })

  // Default to an empty object to allow previews on non-existent documents
  const { body, overview, title } = data ?? {}
  let children = (
    <>
      {/* Header */}
      <Header title={title} description={overview} />

      {/* Body */}
      {body && (
        <CustomPortableText
          paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
          value={body as unknown as PortableTextBlock[]}
        />
      )}
    </>
  )
  // If no data it's considered a 404
  if (!data?._id) {
    children = <Header title="404 Page Not Found" />
  }

  return (
    <div>
      <div className="mb-14">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
