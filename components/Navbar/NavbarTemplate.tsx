import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean, type CreateDataAttribute} from 'next-sanity'
import Link from 'next/link'
import type { SettingsQueryResult } from '@/sanity.types'

export function NavbarFallback() {
 return <Template>
 <span className="text-lg hover:text-black md:text-xl font-extrabold text-black">
   Loading navbar…
 </span>
</Template> 
}

export function NavbarTemplate({dataAttribute, data, isDraftMode}: {dataAttribute: CreateDataAttribute<{
  baseUrl: string;
  id: string;
  type: "settings";
}>| null; data: SettingsQueryResult; isDraftMode: boolean}) {
  return <Template dataSanity={dataAttribute?.('menuItems')}>
  <OptimisticSortOrder id={data?._id} path="menuItems" isDraftMode={isDraftMode}>
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
