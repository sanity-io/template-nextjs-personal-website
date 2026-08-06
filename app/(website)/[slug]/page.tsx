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
import type {Metadata, ResolvingMetadata} from 'next'
import {defineQuery} from 'next-sanity'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

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

export default function SlugPage({params}: PageProps<'/[slug]'>) {
  return (
    <Suspense fallback={<SlugPageFallback />}>
      <DynamicSlugPage params={params} />
    </Suspense>
  )
}

/**
 * Mirrors the real page's heading and body proportions so the App Shell reserves the same
 * vertical space the streamed-in content will occupy.
 */
function SlugPageFallback() {
  return (
    <div aria-busy>
      <div className="w-5/6 lg:w-3/5" aria-hidden>
        <div className="text-3xl font-extrabold tracking-tight md:text-5xl">
          <span className="inline-block h-[1em] w-2/3 animate-pulse rounded bg-gray-200 align-middle" />
        </div>
        <div className="mt-4 font-serif text-xl md:text-2xl">
          <span className="inline-block h-[1em] w-full animate-pulse rounded bg-gray-200 align-middle" />
        </div>
      </div>
      <div className="mt-8 max-w-3xl space-y-3 font-serif text-xl" aria-hidden>
        <span className="block h-[1em] animate-pulse rounded bg-gray-100" />
        <span className="block h-[1em] w-11/12 animate-pulse rounded bg-gray-100" />
        <span className="block h-[1em] w-4/5 animate-pulse rounded bg-gray-100" />
      </div>
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
