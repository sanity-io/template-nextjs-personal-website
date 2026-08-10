import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {
  normalizePerspective,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
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
  {params}: PageProps<'/[perspective]/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug, perspective} = await params

  const slugPageMetadataQuery = defineQuery(`
    *[_type == "page" && slug.current == $slug][0] {
      title,
      "overview": pt::text(overview),
    }
  `)

  const {data} = await sanityFetchMetadata({
    query: slugPageMetadataQuery,
    params: {slug},
    perspective: normalizePerspective(perspective),
  })

  return {
    title: data?.title,
    description: data?.overview || (await parent).description,
  }
}

export default function SlugPage({params}: PageProps<'/[perspective]/[slug]'>) {
  return (
    <Suspense>
      {params.then(({slug, perspective}) => (
        <CachedSlugPage slug={slug} perspective={perspective} />
      ))}
    </Suspense>
  )
}

async function CachedSlugPage({
  slug,
  perspective,
}: Awaited<PageProps<'/[perspective]/[slug]'>['params']>) {
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
  const {data} = await sanityFetch({
    query: slugPageQuery,
    params: {slug},
    perspective: normalizePerspective(perspective),
  })

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
