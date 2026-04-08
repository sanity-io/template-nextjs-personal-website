import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {type PortableTextBlock} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {CustomPortableText} from './CustomPortableText'

export async function Footer() {
  const {isEnabled} = await draftMode()
  if (isEnabled) {
    return (
      <Suspense fallback={<Template>&nbsp;</Template>}>
        <DynamicFooter />
      </Suspense>
    )
  }
  return <CachedFooter perspective="published" stega={false} isDraftMode={false} />
}

async function DynamicFooter() {
  const {perspective, stega, isDraftMode} = await getDynamicFetchOptions()

  return <CachedFooter perspective={perspective} stega={stega} isDraftMode={isDraftMode} />
}

async function CachedFooter({perspective, stega, isDraftMode}: Pick<DynamicFetchOptions, 'perspective' | 'stega' | 'isDraftMode'>) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return (
    <Template>
      {data?.footer && (
        <CustomPortableText
          id={data._id}
          type={data._type}
          path={['footer']}
          paragraphClasses="text-md md:text-xl"
          value={data.footer as unknown as PortableTextBlock[]}
          isDraftMode={isDraftMode}
        />
      )}
    </Template>
  )
}

function Template({children}: {children: React.ReactNode}) {
  return <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">{children}</footer>
}
