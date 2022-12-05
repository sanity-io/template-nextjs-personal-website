'use client'

import { homeQuery, Settings } from 'app/(personal)/queries'
import { usePreview } from 'lib/sanity.preview'

import { HomePage } from '../HomePage'

export function HomePagePreview({ token }: { token: null | string }) {
  const settings: Settings = usePreview(token, homeQuery)

  return <HomePage settings={settings} />
}
