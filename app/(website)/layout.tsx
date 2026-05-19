'use cache'

import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {Navbar} from '@/components/Navbar'
import IntroTemplate from '@/intro-template'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  SanityLive,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata, Viewport} from 'next'
import {defineQuery} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Toaster} from 'sonner'
import {disableDraftMode} from './actions'
import {DraftModeToast} from './DraftModeToast'
import {handleError} from './client-functions'

const layoutMetadataQuery = defineQuery(`{
  "settings": *[_type == "settings"][0]{ogImage},
  "home": *[_type == "home"][0]{
    title,
    "overview": pt::text(overview),
  }
}`)

async function cachedLayoutMetadata({
  perspective,
}: Pick<DynamicFetchOptions, 'perspective'>) {
  'use cache'
  const {data} = await sanityFetchMetadata({query: layoutMetadataQuery, perspective})
  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const {settings, home} = (await cachedLayoutMetadata({perspective})) ?? {}

  const ogImage = urlForOpenGraphImage(settings?.ogImage)
  return {
    title: home?.title
      ? {template: `%s | ${home.title}`, default: home.title || 'Personal website'}
      : undefined,
    description: home?.overview,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export const viewport: Viewport = {themeColor: '#000'}

export default async function PersonalLayout({children}: LayoutProps<'/'>) {
  'use cache'
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        {isDraftMode ? (
          <Suspense>
            <DynamicNavbar />
          </Suspense>
        ) : (
          <CachedNavbar perspective="published" stega={false} />
        )}
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        {isDraftMode ? (
          <Suspense>
            <DynamicFooter />
          </Suspense>
        ) : (
          <CachedFooter perspective="published" stega={false} />
        )}
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </div>
      <Toaster />
      <SanityLive onError={handleError} includeDrafts={isDraftMode} />
      {isDraftMode && (
        <>
          <DraftModeToast action={disableDraftMode} />
          <VisualEditing />
        </>
      )}
      <SpeedInsights />
    </>
  )
}

async function DynamicNavbar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedNavbar perspective={perspective} stega={stega} />
}

async function CachedNavbar({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return <Navbar data={data} />
}

async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedFooter perspective={perspective} stega={stega} />
}

async function CachedFooter({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  if (!Array.isArray(data?.footer)) return null
  return (
    <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
      <CustomPortableText
        id={data._id}
        type={data._type}
        path={['footer']}
        paragraphClasses="text-md md:text-xl"
        value={data.footer}
      />
    </footer>
  )
}
