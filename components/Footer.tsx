import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'
import {CustomPortableText} from './CustomPortableText'

export function Footer() {
  return (
    <Suspense fallback={<Template>&nbsp;</Template>}>
      <CachedFooter />
    </Suspense>
  )
}

async function CachedFooter() {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery})
  return (
    <Template>
      {data?.footer && (
        <CustomPortableText
          id={data._id}
          type={data._type}
          path={['footer']}
          paragraphClasses="text-md md:text-xl"
          value={data.footer as unknown as PortableTextBlock[]}
        />
      )}
    </Template>
  )
}

function Template({children}: {children: React.ReactNode}) {
  return <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">{children}</footer>
}
