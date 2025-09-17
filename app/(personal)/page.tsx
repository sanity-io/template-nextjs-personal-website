import {HomePage} from '@/components/HomePage'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import Link from 'next/link'
import {resolveCookiePerspective} from 'next-sanity/live/use-cache'

export default async function IndexRoute() {
  const perspective = await resolveCookiePerspective()
  const {data} = await sanityFetch({query: homePageQuery, perspective})

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
