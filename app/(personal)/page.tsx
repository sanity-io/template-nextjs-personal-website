import { HomePage } from 'components/home/HomePage'
import { HomePagePreview } from 'components/home/HomePagePreview'
import { PreviewSuspense } from 'components/PreviewSuspense'
import { getHomePage } from 'lib/sanity.client'
import { previewData } from 'next/headers'

export default async function IndexRoute() {
  const token = previewData().token || null
  const home = (await getHomePage({ token })) || {
    title: '',
    overview: [],
    showcaseProjects: [],
  }

  return (
    <>
      {token ? (
        <>
          <PreviewSuspense fallback={<HomePage data={home} preview />}>
            <HomePagePreview token={token} />
          </PreviewSuspense>
        </>
      ) : (
        <HomePage data={home} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
