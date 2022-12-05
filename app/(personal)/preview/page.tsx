import { previewData } from 'next/headers'
import { redirect } from 'next/navigation'

import { PreviewSuspense } from '../components/PreviewSuspense'
import { HomePage } from '../HomePage'
import { getHome } from '../queries'
import { HomePagePreview } from './HomePagePreview'

export default async function Preview() {
  // If preview mode isn't active, we redirect to the production page
  if (!previewData()) {
    return redirect(`/`)
  }

  const token = previewData().token || null
  const home = getHome('/')
  return (
    <PreviewSuspense fallback={<HomePage home={await home} />}>
      <HomePagePreview token={token} />
    </PreviewSuspense>
  )
}
