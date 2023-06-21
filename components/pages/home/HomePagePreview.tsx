import { homePageQuery } from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'
import type { HomePagePayload } from 'types'

import { HomePage, HomePageProps } from './HomePage'

export default function HomePagePreview({
  page: initialPage,
  settings,
}: HomePageProps) {
  const [page, loading] = useLiveQuery<HomePagePayload | null>(
    initialPage,
    homePageQuery
  )

  if (!page) {
    return (
      <div className="text-center">
        Please start editing your Home document to see the preview!
      </div>
    )
  }

  return <HomePage page={page} settings={settings} preview loading={loading} />
}
