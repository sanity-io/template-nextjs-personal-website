'use client'

import { usePreview } from 'lib/sanity.preview'

import { pagesBySlugQuery } from '../../lib/sanity.queries'
import type { PagePayload } from '../../types'
import { Page } from './Page'

export function PagePreview({
  token,
  slug,
}: {
  token: null | string
  slug: string
}) {
  const about: PagePayload = usePreview(token, pagesBySlugQuery, {
    slug: slug,
  })

  return <Page page={about} />
}
