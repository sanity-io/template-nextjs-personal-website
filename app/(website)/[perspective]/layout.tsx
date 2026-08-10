import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {Navbar} from '@/components/Navbar'
import IntroTemplate from '@/intro-template'
import {
  normalizePerspective,
  sanityFetch,
  sanityFetchMetadata,
  SanityLive,
  type FetchOptions,
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

export async function generateMetadata({params}: LayoutProps<'/[perspective]'>): Promise<Metadata> {
  const {perspective} = await params

  const layoutMetadataQuery = defineQuery(`{
    "settings": *[_type == "settings"][0]{ogImage},
    "home": *[_type == "home"][0]{
      title,
      "overview": pt::text(overview),
    }
  }`)

  const {
    data: {settings, home},
  } = await sanityFetchMetadata({
    query: layoutMetadataQuery,
    perspective: normalizePerspective(perspective),
  })

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

export default function PersonalLayout({params, children}: LayoutProps<'/[perspective]'>) {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        <Suspense fallback={<NavbarFallback />}>
          {params.then(({perspective}) => (
            <CachedNavbar perspective={normalizePerspective(perspective)} />
          ))}
        </Suspense>
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        <Suspense>
          {params.then(({perspective}) => (
            <CachedFooter perspective={normalizePerspective(perspective)} />
          ))}
        </Suspense>
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </div>
      <Toaster />
      {draftMode().then(({isEnabled: isDraftMode}) => {
        return (
          <>
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
          </>
        )
      })}
      <SpeedInsights />
    </>
  )
}

/**
 * Shared cache leaf — both the navbar and footer derive from the same `settingsQuery`, so
 * neither has to wait independently for the same data.
 */
async function fetchSettings({perspective}: FetchOptions) {
  'use cache'

  const {data} = await sanityFetch({query: settingsQuery, perspective})
  return data
}

async function CachedNavbar({perspective}: FetchOptions) {
  'use cache'

  const data = await fetchSettings({perspective})
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

async function CachedFooter({perspective}: FetchOptions) {
  'use cache'

  const data = await fetchSettings({perspective})

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
