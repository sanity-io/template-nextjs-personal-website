import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean} from 'next-sanity'
import Link from 'next/link'
import {Suspense} from 'react'

export function Navbar() {
  return (
    <Suspense
      fallback={
        <Template>
          <span className="text-lg hover:text-black md:text-xl font-extrabold text-black">
            Loading navbar…
          </span>
        </Template>
      }
    >
      <DynamicNavbar />
    </Suspense>
  )
}

async function DynamicNavbar() {
  const {perspective, stega} = await getDynamicFetchOptions()

  return <CachedNavbar perspective={perspective} stega={stega} />
}

async function CachedNavbar({perspective, stega}: DynamicFetchOptions) {
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
  return (
    <Template dataSanity={dataAttribute?.('menuItems')}>
      <OptimisticSortOrder id={data?._id} path="menuItems">
        {data?.menuItems?.map((menuItem) => {
          if (!menuItem?._type) return null
          const href = resolveHref(menuItem._type, menuItem?.slug)
          if (!href) {
            return null
          }
          return (
            <Link
              key={menuItem._key}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
              }`}
              data-sanity={dataAttribute?.([
                'menuItems',
                {_key: menuItem._key as unknown as string},
              ])}
              href={href}
            >
              {stegaClean(menuItem.title)}
            </Link>
          )
        })}
      </OptimisticSortOrder>
    </Template>
  )
}

function Template({
  children,
  dataSanity,
}: {
  children: React.ReactNode
  dataSanity?: string | undefined
}) {
  return (
    <header
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
      data-sanity={dataSanity}
    >
      {children}
    </header>
  )
}
