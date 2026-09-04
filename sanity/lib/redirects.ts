import {sanityFetch} from './live'
import {redirectQuery} from './queries'
import {isSitePath} from './site-path'

export async function redirectTarget(from: string): Promise<string | null> {
  'use cache'
  const {data} = await sanityFetch({
    query: redirectQuery,
    params: {from},
    perspective: 'published',
    stega: false,
  })
  return typeof data === 'string' && isSitePath(data) ? data : null
}
