import Link from 'next/link'

import ThemeToggle from './ThemeToggle'
// import { useIsSanityUser } from '../'
// import { SanityMenu } from './SanityMenu'

export function Navbar() {
  //const isSanityUser = useIsSanityUser()

  return (
    <div className="p-4 sm:px-5 md:px-6">
      <div className="flex items-center">
        <div className="flex-1 tracking-tight">
          <Link className="mr-4 hover:text-black " href="/">
            <span className=""></span> Personal
          </Link>
          <Link className="mr-4 text-gray-600 hover:text-black" href="/">
            <span className=""></span> Projects
          </Link>
          <Link className=" text-gray-600 hover:text-black" href="/about">
            About
          </Link>
        </div>
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
