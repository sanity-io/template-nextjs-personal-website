'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import type {ComponentProps, MouseEvent} from 'react'

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
 */
export function AppLink({onClickCapture, ...props}: ComponentProps<typeof Link>) {
  const router = useRouter()
  return (
    <Link
      {...props}
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
