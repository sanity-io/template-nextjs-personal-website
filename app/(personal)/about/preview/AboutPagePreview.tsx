'use client'

import { Page } from 'app/(personal)/queries'
import { usePreview } from 'lib/sanity.preview'

import { AboutPage } from '../AboutPage'
import { About, aboutQuery } from '../queries'

export function AboutPagePreview({ token }: { token: null | string }) {
  const about: About = usePreview(token, aboutQuery)

  return <AboutPage about={about} />
}
