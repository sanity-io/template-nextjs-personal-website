import {createDataAttribute, stegaClean} from 'next-sanity'

import {AppLink} from '@/components/AppLink'
import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import type {SettingsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {resolveHref} from '@/sanity/lib/utils'

interface NavbarProps {
  data: SettingsQueryResult
}
export function Navbar(props: NavbarProps) {
  const {data} = props
  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null
  return (
    <header
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
      data-sanity={dataAttribute?.('menuItems')}
      data-testid="site-header"
    >
      <OptimisticSortOrder id={data?._id} path="menuItems">
        {data?.menuItems?.map((menuItem) => {
          const href = resolveHref(menuItem?._type, menuItem?.slug)
          if (!href) {
            return null
          }
          return (
            <AppLink
              key={menuItem._key}
              // `/[slug]` and `/projects/[slug]` read URL data, which the shared App Shell
              // can't carry. Runtime prefetching resolves their cached content per link so
              // navigation stays instant. See:
              // https://nextjs.org/docs/app/guides/runtime-prefetching
              prefetch={menuItem?._type === 'home' ? undefined : true}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem?._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
              }`}
              data-sanity={dataAttribute?.([
                'menuItems',
                {_key: menuItem._key as unknown as string},
              ])}
              data-testid={`nav-link${href === '/' ? '-home' : href.replaceAll('/', '-')}`}
              href={href}
            >
              {stegaClean(menuItem.title)}
            </AppLink>
          )
        })}
      </OptimisticSortOrder>
    </header>
  )
}
