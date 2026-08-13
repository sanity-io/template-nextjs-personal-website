'use client'

import Link from 'next/link'
import type {ComponentProps} from 'react'

import {useIsDraftMode} from '@/components/DraftModeContext'

/**
 * Published links default to `prefetch={true}` so Partial Prefetching also resolves
 * URL data (`params`) and the cached content behind it before the click — required for
 * instant project/page titles. Callers can still pass an explicit `prefetch` value.
 *
 * In draft mode we disable prefetching. With Cache Components enabled, prefetching a
 * dynamic `[slug]` route in draft caches one sibling's RSC under the shared segment entry,
 * so every later `/projects/[slug]` (or `/[slug]`) navigation reuses it and the page stays
 * "stuck" on the first project while the URL changes.
 *
 * @TODO Report the draft prefetch collision upstream to Vercel (next.js) and drop this
 * `prefetch={false}` branch once fixed; `key`/`bfcacheId`/`cacheLife({stale:0})` don't help.
 */
export function AppLink({prefetch, ...props}: ComponentProps<typeof Link>) {
  const isDraftMode = useIsDraftMode()
  return <Link {...props} prefetch={isDraftMode ? false : (prefetch ?? true)} />
}
