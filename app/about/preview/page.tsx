import { previewData } from 'next/headers'
import { redirect } from 'next/navigation'

import { PreviewSuspense } from '../../components/PreviewSuspense'
import { AboutPage } from '../AboutPage'
import { getAbout } from '../queries'
import { AboutPagePreview } from './AboutPagePreview'

export default async function Preview() {
  // If preview mode isn't active, we redirect to the production page
  if (!previewData()) {
    return redirect(`/about`)
  }

  const token = previewData().token || null
  const about = getAbout(token)
  return (
    <PreviewSuspense fallback={<AboutPage about={await about} />}>
      <AboutPagePreview token={token} />
    </PreviewSuspense>
  )
}
