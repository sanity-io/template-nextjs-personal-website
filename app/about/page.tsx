import React from 'react'

import { AboutPage } from './AboutPage'
import { getAbout, getPageBySlug } from './queries'

export default async function About() {
  const about = await getAbout()
  const page = await getPageBySlug('about')

  return <AboutPage page={page} />
}
