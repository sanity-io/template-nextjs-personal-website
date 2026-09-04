import {sanityFetch} from './live'
import {redirectQuery} from './queries'

/** Same-origin path only: one leading slash, no `//host`, no query or fragment. */
export const isSitePath = (value: string) => /^\/(?!\/)[^?#\s]*$/.test(value)

/**
 * Where a retired path now lives, or null. Published only and cached, so a segment layout can
 * await it without reading cookies or draft mode and stay inside the static shell.
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
