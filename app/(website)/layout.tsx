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
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const layoutMetadataQuery = defineQuery(`{
    "settings": *[_type == "settings"][0]{ogImage},
    "home": *[_type == "home"][0]{
      title,
      "overview": pt::text(overview),
    }
  }`)
  const {
    data: {settings, home},
  } = await sanityFetchMetadata({query: layoutMetadataQuery, perspective})

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

async function fetchSettings({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return data
}

export default async function PersonalLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        {isDraftMode ? (
          <Suspense fallback={<NavbarFallback />}>
            <DynamicNavbarShell />
          </Suspense>
        ) : (
          <CachedNavbarShell perspective="published" stega={false} />
        )}
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        {isDraftMode ? (
          <Suspense fallback={null}>
            <DynamicFooterShell />
          </Suspense>
        ) : (
          <CachedFooterShell perspective="published" stega={false} />
        )}
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </div>
      <Toaster />
      <SanityLive includeDrafts={isDraftMode} onError={handleError} />
      {isDraftMode && (
        <>
          <DraftModeToast
            action={async () => {
              'use server'

              await Promise.allSettled([
                (await draftMode()).disable(),
                // Simulate a delay to show the loading state
                new Promise((resolve) => setTimeout(resolve, 1000)),
              ])
            }}
          />
          <VisualEditing />
        </>
      )}
      <SpeedInsights />
    </>
  )
}

async function DynamicNavbarShell() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedNavbarShell perspective={perspective} stega={stega} />
}

async function CachedNavbarShell({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Navbar data={data} />
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32" />
  )
}

async function DynamicFooterShell() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedFooterShell perspective={perspective} stega={stega} />
}

async function CachedFooterShell({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  if (!Array.isArray(data?.footer)) {
    return null
  }
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
