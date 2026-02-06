import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import {client} from '@/sanity/lib/client'
import {sanityFetch} from '@/sanity/lib/live'
import {pagesBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {toPlainText, type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  return client.fetch(slugsByTypeQuery, {type: 'page'})
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  'use cache'
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

export default function PageSlugRoute({params}: Props) {
  return (
    <Suspense
      fallback={
        <Template>
          <Header id={null} type={null} path={['overview']} title="Loading page…" />
        </Template>
      }
    >
      <DynamicPageSlugRoute params={params} />
    </Suspense>
  )
}

async function DynamicPageSlugRoute({params}: Props) {
  const {slug} = await params

  return <CachedPageSlugRoute slug={slug} />
}

async function CachedPageSlugRoute({slug}: {slug: string}) {
  'use cache'
  const {data} = await sanityFetch({query: pagesBySlugQuery, params: {slug}})

  const {body, overview, title} = data ?? {}

  return (
    <Template>
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
    </Template>
  )
}

function Template({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="mb-14">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </>
  )
}
