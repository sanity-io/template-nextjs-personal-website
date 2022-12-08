import { toPlainText } from '@portabletext/react'
import { SiteMeta } from 'components/global/SiteMeta'
import { getHomePage, getSettings } from 'lib/sanity.client'
import { previewData } from 'next/headers'

export default async function HomePageHead() {
  const token = previewData().token

  const [settings, page] = await Promise.all([
    getSettings({ token }),
    getHomePage({ token }),
  ])

  return (
    <SiteMeta
      description={page?.overview ? toPlainText(page.overview) : ''}
      image={settings?.ogImage}
      title={page?.title}
    />
  )
}
