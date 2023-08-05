import { pagesBySlugQuery } from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'
import type { PagePayload } from 'types'

import { Page, PageProps } from './Page'

export default function PagePreview({
  page: initialPage,
  settings,
  homePageTitle,
}: PageProps) {
  const [page, loading] = useLiveQuery<PagePayload | null>(
    initialPage,
    pagesBySlugQuery,
    {
      slug: initialPage.slug,
    },
  )

  return (
    <Page
      page={page ?? initialPage}
      settings={settings}
      homePageTitle={homePageTitle}
      preview
      loading={loading}
    />
  )
}
