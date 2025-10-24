import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, defineQuery} from 'next-sanity'
import Link from 'next/link'

const navbarQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    }
  }`)
export async function Navbar() {
  // Disable stega since `data-sanity` attributes are used here for marking clickable elements
  const {data} = await sanityFetch({query: navbarQuery, stega: false})
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
    >
      <OptimisticSortOrder id={data?._id} path="menuItems">
        {data?.menuItems?.map((menuItem) => {
          const href = resolveHref(menuItem?._type, menuItem?.slug)
          if (!href) {
            return null
          }
          return (
            <Link
              key={menuItem._key}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem?._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
              }`}
              data-sanity={dataAttribute?.([
                'menuItems',
                {_key: menuItem._key as unknown as string},
              ])}
              href={href}
            >
              {menuItem.title}
            </Link>
          )
        })}
      </OptimisticSortOrder>
    </header>
  )
}

export function FallbackNavbar() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32">
      <span className="animate-pulse text-lg hover:text-black md:text-xl font-extrabold text-black">
        Loading…
      </span>
    </header>
  )
}
