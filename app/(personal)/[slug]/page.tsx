import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {sanityFetch} from '@/sanity/lib/live'
import {slugsByTypeQuery, type SlugsByTypeQueryParams} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'page'} satisfies SlugsByTypeQueryParams,
    perspective: 'published',
    stega: false,
  })
  return data
}

const slugPageMetadataQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    title,
    "overview": pt::text(overview),
  }
`)
export async function generateMetadata(
  {params}: PageProps<'/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: slugPageMetadataQuery,
    params: {slug},
    stega: false,
  })

  return {
    title: data?.title,
    description: data?.overview || (await parent).description,
  }
}

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
export default async function SlugPage({params}: PageProps<'/[slug]'>) {
  const {slug} = await params
  const {data} = await sanityFetch({query: slugPageQuery, params: {slug}})

  // Only show the 404 page if we're in production, when in draft mode we might be about to create a page on this slug, and live reload won't work on the 404 route
  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  const {body, overview, title} = data ?? {}

  return (
    <div>
      <div className="mb-14">
        {/* Header */}
        <Header
          id={data?._id || null}
          type={data?._type || null}
          path={['overview']}
          title={title || (data?._id ? 'Untitled' : '404 Page Not Found')}
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
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
