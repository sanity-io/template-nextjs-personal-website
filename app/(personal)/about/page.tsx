import React from 'react'

import { AboutPage } from './AboutPage'
import { getPageBySlug } from './queries'

export default async function About() {
  const page = await getPageBySlug('about')

  return <AboutPage page={page} />
}
