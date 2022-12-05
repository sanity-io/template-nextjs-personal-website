import { previewData } from 'next/headers'
import { redirect } from 'next/navigation'

import { PreviewSuspense } from '../components/PreviewSuspense'
import { HomePage } from '../HomePage'
import { getSettings } from '../queries'
import { HomePagePreview } from './HomePagePreview'

export default async function Preview() {
  // If preview mode isn't active, we redirect to the production page
  if (!previewData()) {
    return redirect(`/`)
  }

  const token = previewData().token || null
  const settings = getSettings('/')
  return (
    <PreviewSuspense fallback={<HomePage settings={await settings} />}>
      <HomePagePreview token={token} />
    </PreviewSuspense>
  )
}
