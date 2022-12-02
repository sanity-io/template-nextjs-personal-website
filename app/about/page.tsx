import React from 'react'

import { AboutPage } from './AboutPage'
import { getAbout, getPageBySlug } from './queries'

export default async function About() {
  const about = await getAbout()
  const page = await getPageBySlug('about')
  //console.log(page)

  return <AboutPage page={page} />
}
