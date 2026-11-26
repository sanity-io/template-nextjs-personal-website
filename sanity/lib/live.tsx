import {type QueryParams} from 'next-sanity'
import {defineLive, resolvePerspectiveFromCookies, type LivePerspective} from 'next-sanity/live'
import {cookies, draftMode} from 'next/headers'
import {type ComponentProps} from 'react'

import {client} from './client'
import {RefreshBeforeTokenExpiry} from './RefreshBeforeTokenExpiry'
import {getViewerToken} from './token'

const publishedLive = defineLive({client, serverToken: false, browserToken: false, strict: true})

type Live = typeof publishedLive

// Under the SDK's 60 s window, so the refresh render waits for a newly minted token.
const REFRESH_BEFORE_EXPIRY_MS = 45_000

function tokenRefreshDelay(token: string | undefined): number | undefined {
  const payload = token?.split('.')[1]
  if (!payload) {
    return undefined
  }
  try {
    const {exp} = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' ? exp * 1000 - REFRESH_BEFORE_EXPIRY_MS - Date.now() : undefined
  } catch {
    return undefined
  }
}

let viewerLive: {token: string; live: Live} | undefined

async function resolveViewerLive(): Promise<{token: string; live: Live}> {
  const token = await getViewerToken()
  if (viewerLive?.token !== token) {
    viewerLive = {
      token,
      live: defineLive({client, serverToken: token, browserToken: token, strict: true}),
    }
  }
  return viewerLive
}

export const sanityFetch: Live['sanityFetch'] = async (options) => {
  const needsToken = options.perspective !== 'published' || options.stega === true
  const {live} = needsToken ? await resolveViewerLive() : {live: publishedLive}
  return live.sanityFetch(options)
}

export async function SanityLive(props: ComponentProps<Live['SanityLive']>) {
  const {token, live}: {token?: string; live: Live} = props.includeDrafts
    ? await resolveViewerLive()
    : {live: publishedLive}
  const refreshInMs = tokenRefreshDelay(token)
  return (
    <>
      <live.SanityLive {...props} />
      {refreshInMs !== undefined && <RefreshBeforeTokenExpiry refreshInMs={refreshInMs} />}
    </>
  )
}

/**
 * `<SanityLive waitFor>` value. Only set `SANITY_LIVE_WAIT_FOR_FUNCTION=true` once the Sanity
 * Function in `functions/invalidate-sync-tags` is deployed, see "Sanity Functions" in the README.
 */
export const liveWaitFor: 'function' | undefined =
  process.env.SANITY_LIVE_WAIT_FOR_FUNCTION === 'true' ? 'function' : undefined

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
