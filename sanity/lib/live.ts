import {defineLive, type SanityFetchOptions} from 'next-sanity/experimental/live'
import {client} from './client'
import {token} from './token'
import {draftMode} from 'next/headers'

const {sanityFetch: _sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
export {SanityLive}

/**
 * When Next.js Draft Mode is enabled it'll disable cache layers,
 * this reduces the performance of draft content preview.
 * Thus, on a Vercel preview deployment we'll rely on deployment protection to prevent unauthorized access,
 * and otherwise query draft content and leverage the remote cache.
 */
export async function isPreviewMode(): Promise<boolean> {
  // next-sanity doesn't support this yet
  // if (process.env.VERCEL_ENV === 'preview') return true
  const {isEnabled} = await draftMode()
  // @TODO also check for VERCEL_ENV when deciding if we're in preview mode
  return isEnabled
}

/**
 * When fetching data in a server component the right `perspective` and `stega` options are automatically set based on the environment.
 */
export const sanityFetch = async <const QueryString extends string>({
  query,
  params,
  stega,
}: Pick<SanityFetchOptions<QueryString>, 'query' | 'params' | 'stega'>) => {
  const isPreviewModeEnabled = await isPreviewMode()
  const perspective = isPreviewModeEnabled ? 'drafts' : 'published'
  return _sanityFetch({query, params, perspective, stega: stega ?? isPreviewModeEnabled})
}

/**
 * When using `generateMetadata`, `generateViewport` and similar, we never need stega in strings as those are used for detecting where to render overlays
 * when in visual editing.
 */
export const sanityFetchMetadata = async <const QueryString extends string>({
  query,
  params,
}: Pick<SanityFetchOptions<QueryString>, 'query' | 'params'>) => {
  const perspective = (await isPreviewMode()) ? 'drafts' : 'published'
  return _sanityFetch({query, params, perspective, stega: false})
}

/**
 * When using `generateStaticParams` we are always querying published content, and it should never contain stega in strings
 */
export const sanityFetchStaticParams = async <const QueryString extends string>({
  query,
  params,
}: Pick<SanityFetchOptions<QueryString>, 'query' | 'params'>) => {
  const {data} = await _sanityFetch({query, params, perspective: 'published', stega: false})
  return data
}
