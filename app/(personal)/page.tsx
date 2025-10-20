import {HomePage} from '@/components/HomePage'
import IntroTemplate from '@/intro-template'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {resolvePerspectiveFromCookies} from 'next-sanity/experimental/live'
import {cookies, draftMode} from 'next/headers'
import {Suspense} from 'react'

export default async function IndexRoute({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}) {
  const isDraftMode = (await draftMode()).isEnabled
  const {data} = await sanityFetch({
    query: homePageQuery,
    perspective: isDraftMode
      ? await resolvePerspectiveFromCookies({cookies: await cookies()})
      : 'published',
    stega: isDraftMode,
  })

  return (
    <>
      <HomePage data={data} />
      <Suspense>
        <IntroTemplate searchParams={searchParams} />
      </Suspense>
    </>
  )
}
