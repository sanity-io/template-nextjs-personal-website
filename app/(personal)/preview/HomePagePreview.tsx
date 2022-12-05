'use client'

import { Settings, settingsQuery } from 'app/(personal)/queries'
import { usePreview } from 'lib/sanity.preview'

import { HomePage } from '../HomePage'

export function HomePagePreview({ token }: { token: null | string }) {
  const settings: Settings = usePreview(token, settingsQuery)

  return <HomePage settings={settings} />
}
