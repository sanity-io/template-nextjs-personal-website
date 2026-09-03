import {timingSafeEqual} from 'node:crypto'

import {parseTags} from 'next-sanity/live'
import {revalidateTag} from 'next/cache'
import {type NextRequest} from 'next/server'

/**
 * Called by the sync tag invalidate Sanity Function in `functions/invalidate-sync-tags` with the
 * sync tags that changed, before Sanity releases the matching live event to browsers connected
 * with `<SanityLive waitFor="function">`.
 *
 * Expects `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` and a JSON body of
 * `{"syncTags": ["s1:...", ...]}`. The tags are prefixed with `sanity:` to match the cache tags
 * that `sanityFetch` assigns, and expired immediately (`{expire: 0}`) rather than with a
 * stale-while-revalidate profile: the function's `done()` call is what triggers the browser's
 * `router.refresh()`, so that request must render fresh content instead of serving stale.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return Response.json(
      {message: 'SANITY_REVALIDATE_SECRET is not configured for this deployment'},
      {status: 503},
    )
  }
  if (!isAuthorized(request.headers.get('authorization'), secret)) {
    return Response.json({message: 'Invalid or missing bearer token'}, {status: 401})
  }

  let syncTags: unknown
  try {
    ;({syncTags} = (await request.json()) as {syncTags?: unknown})
  } catch {
    return Response.json({message: 'Request body must be JSON'}, {status: 400})
  }
  if (!Array.isArray(syncTags) || !syncTags.every((tag) => typeof tag === 'string')) {
    return Response.json({message: '`syncTags` must be an array of strings'}, {status: 400})
  }

  let tags: string[]
  try {
    ;({tags} = parseTags(syncTags.map((tag) => `sanity:${tag}`)))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid sync tags'
    return Response.json({message}, {status: 400})
  }

  for (const tag of tags) {
    revalidateTag(tag, {expire: 0})
  }

  return Response.json({revalidated: true, tags, now: Date.now()})
}

function isAuthorized(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual = Buffer.from(header ?? '')
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
