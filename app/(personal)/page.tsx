import { previewData } from 'next/headers'

import { HomePage } from '../../components/home/HomePage'
import { HomePagePreview } from '../../components/home/HomePagePreview'
import { PreviewSuspense } from '../../components/PreviewSuspense'
import { getHome } from '../../lib/sanity.client'

export default async function IndexRoute() {
  const token = previewData().token || null
  const home = await getHome()

  return (
    <>
      {token ? (
        <>
          <PreviewSuspense fallback={<HomePage home={home} />}>
            <HomePagePreview token={token} />
          </PreviewSuspense>
        </>
      ) : (
        <HomePage home={home} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
