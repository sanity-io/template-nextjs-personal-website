'use client'

import { useEffect } from 'react'

/**
 * Workaround to force pages to scroll to the top when navigating with `<Link>`.
 * Delete this once this issue is resolved in Next 13
 * https://github.com/vercel/next.js/issues/42492
 */

export default function ScrollUp() {
  useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), [])

  return null
}
