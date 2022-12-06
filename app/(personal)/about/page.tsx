import { previewData } from 'next/headers'
import React from 'react'

import { PreviewSuspense } from '../components/PreviewSuspense'
import { AboutPage } from './AboutPage'
import { AboutPagePreview } from './AboutPagePreview'
import { getPageBySlug } from './queries'

export default async function About() {
  const token = previewData().token || null
  const about = await getPageBySlug('about')

  return (
    <>
      {token ? (
        <PreviewSuspense fallback={<AboutPage page={about} />}>
          <AboutPagePreview token={token} />
        </PreviewSuspense>
      ) : (
        <AboutPage page={about} />
      )}
    </>
  )
}
