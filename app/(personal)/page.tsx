import { HomePage } from 'components/home/HomePage'
import { HomePagePreview } from 'components/home/HomePagePreview'
import { PreviewSuspense } from 'components/PreviewSuspense'
import { PreviewWrapper } from 'components/PreviewWrapper'
import { getHomePage } from 'lib/sanity.client'
import { previewData } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function IndexRoute() {
  const token = previewData().token || null
  const data = (await getHomePage({ token })) || {
    title: '',
    overview: [],
    showcaseProjects: [],
  }

  if (!data && !token) {
    notFound()
  }

  return (
    <>
      {token ? (
        <>
          <PreviewSuspense
            fallback={
              <PreviewWrapper>
                <HomePage data={data} />
              </PreviewWrapper>
            }
          >
            <HomePagePreview token={token} />
          </PreviewSuspense>
        </>
      ) : (
        <HomePage data={data} />
      )}
    </>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
