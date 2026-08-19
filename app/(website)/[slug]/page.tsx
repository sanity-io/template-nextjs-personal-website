import type {Metadata, ResolvingMetadata} from 'next'
import {defineQuery} from 'next-sanity'
import {notFound} from 'next/navigation'

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
  if (data.length > 0) {
    return data
  }
  // Cache Components requires `generateStaticParams` to return at least one param — an empty
  // array fails the build (https://nextjs.org/docs/messages/empty-generate-static-params).
  // With no page documents in the dataset yet, prerender a placeholder slug that resolves to
  // the 404 page instead.
  return [{slug: '__placeholder__'}]
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
