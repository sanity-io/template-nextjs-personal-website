import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {Navbar} from '@/components/Navbar'
import IntroTemplate from '@/intro-template'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, Viewport} from 'next'
import {toPlainText, type PortableTextBlock} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {cookies, draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Toaster} from 'sonner'
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {resolvePerspectiveFromCookie} from 'next-sanity/experimental/live'
import type {SettingsQueryResult} from '@/sanity.types'

export async function generateMetadata(): Promise<Metadata> {
  const isDraftMode = (await draftMode()).isEnabled
  const perspective = (await isDraftMode)
    ? await resolvePerspectiveFromCookie({cookies: await cookies()})
    : 'published'
  const [{data: settings}, {data: homePage}] = await Promise.all([
    sanityFetch({query: settingsQuery, perspective, stega: false}),
    sanityFetch({query: homePageQuery, perspective, stega: false}),
  ])

  const ogImage = urlForOpenGraphImage(
    // @ts-expect-error - @TODO update @sanity/image-url types so it's compatible
    settings?.ogImage,
  )
  return {
    title: homePage?.title
      ? {
          template: `%s | ${homePage.title}`,
          default: homePage.title || 'Personal website',
        }
      : undefined,
    description: homePage?.overview ? toPlainText(homePage.overview) : undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export default async function PersonalLayout({children}: {children: React.ReactNode}) {
  const isDraftMode = (await draftMode()).isEnabled
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        <Suspense
          // @TODO add a fallback that reduces layout shift
          fallback={null}
        >
          {isDraftMode ? (
            <DynamicLayout>{children}</DynamicLayout>
          ) : (
            <CachedLayout>{children}</CachedLayout>
          )}
        </Suspense>
      </div>
      <Toaster />
      <SanityLive onError={handleError} />
      {isDraftMode && (
        <>
          <DraftModeToast />
          <VisualEditing />
        </>
      )}
      <SpeedInsights />
    </>
  )
}

/**
 * Resolves cookies for the perspective in draft mode, important that it's wrapped in a <Suspense> boundary for PPR to work its magic
 */
async function DynamicLayout({children}: {children: React.ReactNode}) {
  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookie({cookies: jar})
  const {data} = await sanityFetch({query: settingsQuery, perspective})
  return <CachedContent data={data}>{children}</CachedContent>
}

/**
 * Runs in production, takes full advantage of prerender and PPR
 */
async function CachedLayout({children}: {children: React.ReactNode}) {
  'use cache'

  const {data} = await sanityFetch({query: settingsQuery, perspective: 'published', stega: false})

  return <CachedContent data={data}>{children}</CachedContent>
}

/**
 * Shared by both the cached and dynamic layouts, it is its own cache layer so that even if the `sanityFetch` is
 * revalidated and refetched, the component output doesn't change if `data` is the same.
 */
async function CachedContent({
  children,
  data,
}: {
  children: React.ReactNode
  data: SettingsQueryResult
}) {
  'use cache'

  return (
    <>
      <Navbar data={data} />
      <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
      <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
        {data?.footer && (
          <CustomPortableText
            id={data._id}
            type={data._type}
            path={['footer']}
            paragraphClasses="text-md md:text-xl"
            value={data.footer as unknown as PortableTextBlock[]}
          />
        )}
      </footer>
    </>
  )
}
