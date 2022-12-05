'use client'

import { Home, homeQuery } from 'app/(personal)/queries'
import { usePreview } from 'lib/sanity.preview'

import { HomePage } from '../HomePage'

export function HomePagePreview({ token }: { token: null | string }) {
  const home: Home = usePreview(token, homeQuery)

  return <HomePage home={home} />
}
