import { toPlainText } from '@portabletext/react'
import { SiteMeta } from 'components/global/SiteMeta'
import { HomePagePayload, SettingsPayload } from 'types'

export interface HomePageHeadProps {
  settings?: SettingsPayload
  page?: HomePagePayload
}

export default function HomePageHead({ settings, page }: HomePageHeadProps) {
  return (
    <SiteMeta
      description={page?.overview ? toPlainText(page.overview) : ''}
      image={settings?.ogImage}
      title={page?.title}
    />
  )
}
