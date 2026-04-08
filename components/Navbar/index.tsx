import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean} from 'next-sanity'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {Suspense} from 'react'
// import { PreviewNavbar } from './PreviewNavbar'
import { NavbarFallback, NavbarTemplate } from './NavbarTemplate'
import { PresentationQuery } from '../PresentationQuery'

export async function Navbar() {
  const {isEnabled} = await draftMode()
  if (isEnabled) {
    return (
      <Suspense
        fallback={
          <NavbarFallback />
        }
      >
        <DynamicNavbar />
      </Suspense>
    )
  }
  return <CachedNavbar perspective="published" stega={false} isDraftMode={false} />
}

async function DynamicNavbar() {
  const {perspective, stega, isDraftMode} = await getDynamicFetchOptions()

  return <><CachedNavbar perspective={perspective} stega={stega} isDraftMode={isDraftMode} /><PresentationQuery query={settingsQuery} params={undefined} perspective={perspective} stega={stega} /></>
}

async function CachedNavbar({perspective, stega, isDraftMode}: Pick<DynamicFetchOptions, 'perspective' | 'stega' | 'isDraftMode'>) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return <NavbarTemplate dataAttribute={dataAttribute} data={data} isDraftMode={isDraftMode} />

}
