import { usePreview } from 'lib/sanity.preview'
import { pagesBySlugQuery } from 'lib/sanity.queries'
import type { PagePayload } from 'types'

import { Page, PageProps } from './Page'

export default function PagePreview({
  token,
  page,
  settings,
  homePageTitle,
}: {
  token: null | string
} & PageProps) {
  const pagePreview: PagePayload = usePreview(token, pagesBySlugQuery, {
    slug: page.slug,
  })

  return (
    <Page
      page={pagePreview}
      settings={settings}
      homePageTitle={homePageTitle}
      preview={true}
    />
  )
}
