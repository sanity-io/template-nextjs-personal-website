import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock, toPlainText} from 'next-sanity'

import {CustomPortableText} from '@/components/shared/CustomPortableText'
import {Header} from '@/components/shared/Header'
import {sanityFetch} from '@/sanity/lib/live'
import {pagesBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: pagesBySlugQuery,
    params,
    stega: false,
  })

  return {
    title: page?.title,
    description: page?.overview ? toPlainText(page.overview) : (await parent).description,
  }
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'page'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function PageSlugRoute({params}: Props) {
  const {data} = await sanityFetch({query: pagesBySlugQuery, params})

  if (!data?._id) {
    return notFound()
  }

  // Default to an empty object to allow previews on non-existent documents
  const {body, overview, title} = data ?? {}

  return (
    <div>
      <div className="mb-14">
        {/* Header */}
        <Header title={title} description={overview} />

        {/* Body */}
        {body && (
          <CustomPortableText
            paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
            value={body as unknown as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
