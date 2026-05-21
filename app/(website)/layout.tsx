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

export default async function PersonalLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        {isDraftMode ? (
          <Suspense fallback={<NavbarFallback />}>
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

/**
 * Shared cache leaf — both the navbar and footer derive from the same `settingsQuery`, so
 * neither has to wait independently for the same data.
 */
async function fetchSettings({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return data
}

async function DynamicNavbar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedNavbar perspective={perspective} stega={stega} />
}

async function CachedNavbar({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Navbar data={data} />
}

/**
 * Mirrors the real `<Navbar>` shell so the static fallback occupies the same vertical space.
 * Width of the placeholder link is arbitrary — height is what matters to avoid layout shift.
 */
function NavbarFallback() {
  return (
    <header
      aria-busy
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
    >
      <span className="text-lg md:text-xl" aria-hidden>
        <span className="inline-block h-[1em] w-24 animate-pulse rounded bg-gray-200 align-middle md:w-32" />
      </span>
    </header>
  )
}

async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedFooter perspective={perspective} stega={stega} />
}

async function CachedFooter({perspective, stega}: DynamicFetchOptions) {
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
