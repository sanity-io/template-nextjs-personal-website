import React from 'react'

import { AboutPage } from './AboutPage'
import { getAbout } from './queries'

export default async function About() {
  const about = await getAbout()

  return <AboutPage about={about} />
}
