import type {Metadata, ResolvingMetadata} from 'next'
import {defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {slugsByTypeQuery, type SlugsByTypeQueryParams} from '@/sanity/lib/queries'

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'page'} satisfies SlugsByTypeQueryParams,
  })
  return data
}

export async function generateMetadata(
  {params}: PageProps<'/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const slugPageMetadataQuery = defineQuery(`
    *[_type == "page" && slug.current == $slug][0] {
      title,
      "overview": pt::text(overview),
    }
  `)
  const {data} = await sanityFetchMetadata({
    query: slugPageMetadataQuery,
    params: {slug},
    perspective,
  })

  return {
    title: data?.title,
    description: data?.overview || (await parent).description,
  }
}

export default async function SlugPage({params}: PageProps<'/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return (
      <Suspense fallback={<SlugPageFallback />}>
        <PublishedSlugPage params={params} />
      </Suspense>
    )
  }
  return (
    <Suspense fallback={<SlugPageFallback />}>
      <DynamicSlugPage params={params} />
    </Suspense>
  )
}

async function PublishedSlugPage({params}: Pick<PageProps<'/[slug]'>, 'params'>) {
  const {slug} = await params
  return <CachedSlugPage slug={slug} perspective="published" stega={false} />
}

/**
 * Mirrors the `<Header>` block so the fallback occupies the same space while the
 * URL-specific content streams in after a navigation.
 */
function SlugPageFallback() {
  return (
    <div aria-busy className="w-5/6 lg:w-3/5">
      <span className="block text-3xl md:text-5xl" aria-hidden>
        <span className="inline-block h-[1em] w-48 max-w-full animate-pulse rounded bg-gray-200 align-middle md:w-72" />
      </span>
      <span className="mt-4 block font-serif text-xl md:text-2xl" aria-hidden>
        <span className="inline-block h-[1em] w-full animate-pulse rounded bg-gray-100 align-middle" />
      </span>
    </div>
  )
}

async function DynamicSlugPage({params}: Pick<PageProps<'/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedSlugPage slug={slug} perspective={perspective} stega={stega} />
}

async function CachedSlugPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const slugPageQuery = defineQuery(`
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      _type,
      body,
      overview,
      title,
      "slug": slug.current,
    }
  `)
  const {data} = await sanityFetch({query: slugPageQuery, params: {slug}, perspective, stega})

  if (!data?._id) notFound()

  const {body, overview, title} = data ?? {}

  return (
    <>
      {/* Header */}
      <Header
        id={data?._id || null}
        type={data?._type || null}
        path={['overview']}
        title={title || 'Untitled'}
        description={overview}
      />

      {/* Body */}
      {Array.isArray(body) && (
        <CustomPortableText
          id={data?._id || null}
          type={data?._type || null}
          path={['body']}
          paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
          value={body}
        />
      )}
    </>
  )
}
