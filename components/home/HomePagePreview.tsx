'use client'

import { usePreview } from 'lib/sanity.preview'

import { homeQuery } from '../../lib/sanity.queries'
import type { HomePagePayload } from '../../types'
import { HomePage } from './HomePage'

export function HomePagePreview({ token }: { token: null | string }) {
  const home: HomePagePayload = usePreview(token, homeQuery)

  return <HomePage home={home} />
}
