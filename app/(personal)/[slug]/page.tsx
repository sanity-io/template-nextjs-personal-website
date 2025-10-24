import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {
  isPreviewMode,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from '@/sanity/lib/live'
import {slugsByTypeQuery} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {defineQuery, toPlainText, type PortableTextBlock} from 'next-sanity'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  return sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'page'},
  })
}

const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`)
export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {data: page} = await sanityFetchMetadata({
    query: pagesBySlugQuery,
    params: await params,
  })

  return {
    title: page?.title,
    description: page?.overview ? toPlainText(page.overview) : (await parent).description,
  }
}

export default function PageSlugRoute({params}: Props) {
  return (
    <div>
      <div className="mb-14">
        <Suspense
          fallback={
            <Header
              id={null}
              type={null}
              path={['overview']}
              title="Loading…"
              description={null}
              loading
            />
          }
        >
          <PageSlugRouteContent params={params} />
        </Suspense>
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}

async function PageSlugRouteContent({params}: Props) {
  const {data} = await sanityFetch({query: pagesBySlugQuery, params: await params})

  // Only show the 404 page if we're in production, when in preview mode we might be about to create a page on this slug, and live reload won't work on the 404 route
  if (!data?._id && !(await isPreviewMode())) {
    notFound()
  }

  const {body, overview, title} = data ?? {}

  return (
    <>
      {/* Header */}
      <Header
        id={data?._id || null}
        type={data?._type || null}
        path={['overview']}
        title={title || (data?._id ? 'Untitled' : '404 Page Not Found')}
        description={overview}
      />

      {/* Body */}
      {body && (
        <CustomPortableText
          id={data?._id || null}
          type={data?._type || null}
          path={['body']}
          paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
          value={body as unknown as PortableTextBlock[]}
        />
      )}
    </>
  )
}
