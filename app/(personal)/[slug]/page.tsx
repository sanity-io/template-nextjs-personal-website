import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {sanityFetch} from '@/sanity/lib/live'
import {pagesBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {toPlainText} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'

export async function generateMetadata(
  {params}: PageProps<'/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug} = await params
  const {data: page} = await sanityFetch({
    query: pagesBySlugQuery,
    params: {slug},
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

export default async function SlugPage({params}: PageProps<'/[slug]'>) {
  const {slug} = await params
  const {data} = await sanityFetch({query: pagesBySlugQuery, params: {slug}})

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
