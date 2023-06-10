import { pagesBySlugQuery } from 'lib/sanity.queries'
import { useListeningQuery, useListeningQueryStatus } from 'next-sanity/preview'
import type { PagePayload } from 'types'

import { Page, PageProps } from './Page'

export default function PagePreview({
  page,
  settings,
  homePageTitle,
}: PageProps) {
  const params = { slug: page.slug }
  const pagePreview = useListeningQuery<PagePayload>(
    page,
    pagesBySlugQuery,
    params
  )
  const loading =
    useListeningQueryStatus(pagesBySlugQuery, params) === 'loading'

  return (
    <Page
      page={pagePreview}
      settings={settings}
      homePageTitle={homePageTitle}
      preview
      loading={loading}
    />
  )
}
