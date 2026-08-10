import {type QueryParams} from 'next-sanity'
import {defineLive, type LivePerspective} from 'next-sanity/live'
import {draftMode} from 'next/headers'
import {client} from './client'
import {token} from './token'

/**
 * Live content integration primitives for Next.js.
 *
 * - `SanityLive` enables live updates in the app tree.
 * - `sanityInternalFetch` is the low-level fetcher from `defineLive`.
 */
export const {SanityLive, sanityFetch: sanityInternalFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

export interface FetchOptions {
  perspective: LivePerspective
}

/**
 * Options accepted by the draft-aware fetch wrapper.
 *
 * `stega` and the final `perspective` are derived from Next.js draft mode,
 * so callers only provide a draft perspective candidate.
 */
type WithDraftModeOptions<QueryString extends string> = Omit<
  Parameters<typeof sanityInternalFetch<QueryString>>[0],
  'perspective' | 'stega'
> &
  Partial<Pick<Parameters<typeof sanityInternalFetch<QueryString>>[0], 'perspective'>>

/**
 * Wraps `sanityInternalFetch` so draft mode controls perspective/stega automatically.
 *
 * When draft mode is disabled, all reads are forced to `published`.
 */
function withDraftMode(fn: typeof sanityInternalFetch) {
  return async <const QueryString extends string>(options: WithDraftModeOptions<QueryString>) => {
    const {isEnabled: isDraftMode} = await draftMode()

    return fn({
      ...options,
      perspective: isDraftMode ? options.perspective : 'published',
      stega: isDraftMode,
    } as Parameters<typeof sanityInternalFetch<QueryString>>[0])
  }
}

/**
 * App-level Sanity fetch helper that automatically syncs with Next.js draft mode.
 */
export const sanityFetch = withDraftMode(sanityInternalFetch)

export function normalizePerspective(perspective: string): LivePerspective {
  return (perspective as LivePerspective) ?? 'published'
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
  const {data} = await sanityInternalFetch({query, params, perspective: 'published', stega: false})
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
  const {data} = await sanityInternalFetch({query, params, perspective, stega: false})
  return {data}
}
