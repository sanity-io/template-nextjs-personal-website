'use client'

import { Page } from 'app/(personal)/queries'
import { usePreview } from 'lib/sanity.preview'

import { AboutPage } from '../AboutPage'
import { pagesBySlugQuery } from '../queries'

export function AboutPagePreview({ token }: { token: null | string }) {
  const about: Page = usePreview(token, pagesBySlugQuery, { slug: 'about' })

  return <AboutPage page={about} />
}
