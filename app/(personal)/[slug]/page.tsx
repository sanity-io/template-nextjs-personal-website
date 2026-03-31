import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {pagesBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {toPlainText, type PortableTextBlock} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug} = await params
  const {perspective} = await getDynamicFetchOptions()
  const data = await cachedPageMetadata({slug, perspective})
  return {
    title: data?.title,
    description: data?.overview ? toPlainText(data.overview) : (await parent).description,
  }
}

async function cachedPageMetadata({
  slug,
  perspective,
}: {slug: string} & Pick<DynamicFetchOptions, 'perspective'>) {
  'use cache'
  const {data} = await sanityFetch({
    query: pagesBySlugQuery,
    params: {slug},
    perspective,
    stega: false,
  })
  return data
}

export async function generateStaticParams() {
  return sanityFetchStaticParams({query: slugsByTypeQuery, params: {type: 'page'}})
}

export default async function PageSlugRoute({params}: Props) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PageTemplate />}>
        <DynamicPageSlug params={params} />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedPageSlug slug={slug} perspective="published" stega={false} />
}

async function DynamicPageSlug({params}: Props) {
  const {slug} = await params
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedPageSlug slug={slug} perspective={perspective} stega={stega} />
}

async function CachedPageSlug({
  slug,
  perspective,
  stega,
}: {slug: string} & Pick<DynamicFetchOptions, 'perspective' | 'stega'>) {
  'use cache'
  const {data} = await sanityFetch({query: pagesBySlugQuery, params: {slug}, perspective, stega})

  if (!data?._id) {
    notFound()
  }

  const {body, overview, title} = data ?? {}

  return (
    <PageTemplate>
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
    </PageTemplate>
  )
}

function PageTemplate({children}: {children?: React.ReactNode}) {
  return (
    <div>
      <div className="mb-14">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
