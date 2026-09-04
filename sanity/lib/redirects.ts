import {sanityFetch} from './live'
import {redirectQuery} from './queries'

/** Same-origin path only: one leading slash, no `//host`, no query or fragment. */
export const isSitePath = (value: string) => /^\/(?!\/)[^?#\s]*$/.test(value)

/**
 * Where a retired path now lives, or null. Published only and cached: the redirect table is
 * public routing data, so a draft never changes it and one lookup serves every perspective.
 */
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
