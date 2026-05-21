import {type QueryParams} from 'next-sanity'
import {defineLive, resolvePerspectiveFromCookies, type LivePerspective} from 'next-sanity/live'
import {cookies, draftMode} from 'next/headers'
import {client} from './client'
import {token} from './token'

export const {SanityLive, sanityFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

export interface DynamicFetchOptions {
  perspective: LivePerspective
  stega: boolean
}

/**
 * Resolves `perspective` and `stega` outside of any `'use cache'` boundary so they can be
 * passed as plain serializable props into a cached leaf. Calls `cookies()`, so callers must
 * be wrapped in `<Suspense>` (or sit next to a `loading.tsx`).
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return {perspective: 'published', stega: false}
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', stega: true}
}

/**
 * For usage within `generateStaticParams`.
 *
 * Hardcodes `perspective: 'published'` and `stega: false` because perspective cookies aren't
 * available at build time and stega data is never wanted as route params.
 */
export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString
  params?: QueryParams
}) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective: 'published', stega: false})
  return {data}
}

/**
 * For usage within `generateMetadata`, `generateViewport`, `sitemap.ts`, `robots.ts`,
 * `opengraph-image.tsx`, and other file-based metadata routes. `stega` is hardcoded `false`
 * because metadata never renders alongside `<VisualEditing>`, but `perspective` must still
 * be resolved (Presentation Tool can open a standalone preview window).
 */
export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString
  params?: QueryParams
  perspective: LivePerspective
}) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective, stega: false})
  return {data}
}
