'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import type {ComponentProps, MouseEvent} from 'react'

import {useIsDraftMode} from '@/components/DraftModeContext'

function hrefToPath(href: ComponentProps<typeof Link>['href']): string | null {
  if (typeof href === 'string') return href
  if (href && typeof href === 'object' && href.pathname) {
    return href.pathname
  }
  return null
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

/**
 * Presentation overlays call `preventDefault` on the bubble phase for hovered
 * `data-sanity` nodes inside the preview iframe, which swallows Next.js `<Link>`
 * navigation. Push the route during capture so project/menu clicks still navigate.
 *
 * @TODO Remove this capture-phase `router.push` workaround once
 * `@sanity/visual-editing` stops calling `preventDefault` on those overlay clicks.
 *
 * In draft mode we also disable prefetching. With Cache Components enabled,
 * prefetching a dynamic `[slug]` route in draft caches one sibling's RSC under the
 * shared segment entry, so every later `/projects/[slug]` (or `/[slug]`) navigation
 * reuses it and the page stays "stuck" on the first project while the URL changes.
 * Published keeps default prefetching so navigation stays instant.
 *
 * @TODO Report the draft prefetch collision upstream to Vercel (next.js) and drop
 * this `prefetch={false}` branch once fixed; `key`/`bfcacheId`/`cacheLife({stale:0})`
 * do not work around it.
 */
export function AppLink({onClickCapture, prefetch, ...props}: ComponentProps<typeof Link>) {
  const router = useRouter()
  const isDraftMode = useIsDraftMode()
  return (
    <Link
      {...props}
      prefetch={isDraftMode ? false : prefetch}
      onClickCapture={(event) => {
        onClickCapture?.(event)
        if (event.defaultPrevented || isModifiedClick(event)) return
        const path = hrefToPath(props.href)
        if (!path || /^(https?:|mailto:|tel:)/i.test(path)) return
        router.push(path)
      }}
    />
  )
}
