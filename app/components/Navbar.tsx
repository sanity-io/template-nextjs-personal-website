'use client'
import { MenuItem, Page } from 'app/queries'
import Link from 'next/link'

import ThemeToggle from './ThemeToggle'
// import { useIsSanityUser } from '../'
// import { SanityMenu } from './SanityMenu'

export function Navbar({ menuItems: items }: { menuItems: MenuItem }) {
  //const isSanityUser = useIsSanityUser()
  const { menuItems } = items
  console.log(menuItems)

  return (
    <div className="p-4 sm:px-5 md:px-6">
      <div className="flex items-center">
        {menuItems.map((menuItem, key) => (
          <Link
            key={key}
            className={`font-inter  mr-4 hover:text-white ${
              menuItem.slug.current === 'home' ? 'text-black' : 'text-gray-600'
            }`}
            href={`/${
              menuItem.slug.current === 'home' ? '' : menuItem.slug.current
            }`}
          >
            {menuItem.title}
          </Link>
        ))}

        <div className="px-3 text-lg">
          <ThemeToggle />
        </div>
        {/* {isSanityUser && (
          <div className="pl-3" style={{ margin: '-3px 0' }}>
            <SanityMenu />
          </div>
        )} */}
      </div>
    </div>
  )
}
