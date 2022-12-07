'use client'

import { usePreview } from 'lib/sanity.preview'

import { pagesBySlugQuery } from '../lib/sanity.queries'
import type { PagePayload } from '../types'
import { Page } from './Page'

export function AboutPagePreview({ token }: { token: null | string }) {
  const about: PagePayload = usePreview(token, pagesBySlugQuery, {
    slug: 'about',
  })

  return <Page page={about} />
}
