import {timingSafeEqual} from 'node:crypto'

import {parseTags} from 'next-sanity/live'
import {revalidateTag} from 'next/cache'
import {type NextRequest} from 'next/server'

/**
 * Called by the Sanity Function in `functions/invalidate-sync-tags` before Sanity releases a live
 * event to `<SanityLive waitFor="function">` clients. Expires the cache tags immediately instead
 * of stale-while-revalidate, since the `router.refresh()` that follows must render fresh content.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return Response.json({message: 'SANITY_REVALIDATE_SECRET is not configured'}, {status: 503})
  }
  if (!isAuthorized(request.headers.get('authorization'), secret)) {
    return Response.json({message: 'Invalid or missing bearer token'}, {status: 401})
  }

  let body: {syncTags?: unknown}
  try {
    body = await request.json()
  } catch {
    return Response.json({message: 'Request body must be JSON'}, {status: 400})
  }
  const {syncTags} = body
  if (
    !Array.isArray(syncTags) ||
    syncTags.length === 0 ||
    !syncTags.every((tag) => typeof tag === 'string')
  ) {
    return Response.json(
      {message: '`syncTags` must be a non-empty array of strings'},
      {status: 400},
    )
  }

  const {tags} = parseTags(syncTags.map((tag) => `sanity:${tag}`))
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
