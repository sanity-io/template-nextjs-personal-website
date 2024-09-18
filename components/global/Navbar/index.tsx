import Link from 'next/link'

import { sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { resolveHref } from '@/sanity/lib/utils'

export async function Navbar() {
  const { data } = await sanityFetch({ query: settingsQuery })

  const menuItems = data?.menuItems
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32">
      {menuItems &&
        menuItems.map((menuItem, key) => {
          const href = resolveHref(menuItem?._type, menuItem?.slug)
          if (!href) {
            return null
          }
          return (
            <Link
              key={key}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem?._type === 'home'
                  ? 'font-extrabold text-black'
                  : 'text-gray-600'
              }`}
              href={href}
            >
              {menuItem.title}
            </Link>
          )
        })}
    </div>
  )
}
