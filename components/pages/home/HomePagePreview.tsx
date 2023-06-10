import { homePageQuery } from 'lib/sanity.queries'
import { useListeningQuery, useListeningQueryStatus } from 'next-sanity/preview'
import type { HomePagePayload } from 'types'

import { HomePage, HomePageProps } from './HomePage'

export default function HomePagePreview({ page, settings }: HomePageProps) {
  const home = useListeningQuery<HomePagePayload>(page, homePageQuery)
  const loading = useListeningQueryStatus(homePageQuery) === 'loading'

  if (!home) {
    return (
      <div className="text-center">
        Please start editing your Home document to see the preview!
      </div>
    )
  }

  return <HomePage page={home} settings={settings} preview loading={loading} />
}
