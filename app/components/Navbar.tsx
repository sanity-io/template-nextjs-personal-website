'use client'
import { Menu, Page } from 'app/queries'
import Link from 'next/link'

import ThemeToggle from './ThemeToggle'
// import { useIsSanityUser } from '../'
// import { SanityMenu } from './SanityMenu'

export function Navbar({ menu }: { menu: Menu }) {
  const { menuItems } = menu

  return (
    <div className="p-4 sm:px-5 md:px-6">
      <div className="flex justify-between">
        <div>
          {menuItems.map((menuItem, key) => (
            <Link
              key={key}
              className={`font-inter  mr-4 hover:text-white ${
                menuItem.slug.current === 'home'
                  ? 'text-black'
                  : 'text-gray-600'
              }`}
              href={`/${
                menuItem.slug.current === 'home' ? '' : menuItem.slug.current
              }`}
            >
              {menuItem.title}
            </Link>
          ))}
        </div>

        <div className="px-3 text-lg">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
