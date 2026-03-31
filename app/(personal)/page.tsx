import {HomePage} from '@/components/HomePage'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {Suspense} from 'react'

export default async function IndexRoute() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<CachedHomePage perspective="published" stega={false} />}>
        <DynamicHomePage />
      </Suspense>
    )
  }
  return <CachedHomePage perspective="published" stega={false} />
}

async function DynamicHomePage() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedHomePage perspective={perspective} stega={stega} />
}

async function CachedHomePage({
  perspective,
  stega,
}: Pick<DynamicFetchOptions, 'perspective' | 'stega'>) {
  'use cache'
  const {data} = await sanityFetch({query: homePageQuery, perspective, stega})

  if (!data) {
    return (
      <div className="text-center">
        You don&rsquo;t have a homepage yet,{' '}
        <Link href={`${studioUrl}/structure/home`} className="underline">
          create one now
        </Link>
        !
      </div>
    )
  }

  return <HomePage data={data} />
}
