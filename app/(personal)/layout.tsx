import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {Navbar} from '@/components/Navbar'
import IntroTemplate from '@/intro-template'
import {
  getDynamicFetchOptions,
  sanityFetch,
  SanityLive,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata, Viewport} from 'next'
import {toPlainText, type PortableTextBlock} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Toaster} from 'sonner'
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  return cachedLayoutMetadata({perspective})
}

async function cachedLayoutMetadata({
  perspective,
}: Pick<DynamicFetchOptions, 'perspective'>): Promise<Metadata> {
  'use cache'
  const [{data: settings}, {data: homePage}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false, perspective}),
    sanityFetch({query: homePageQuery, stega: false, perspective}),
  ])

  // @ts-ignore the image type sometimes fails
  const ogImage = urlForOpenGraphImage(settings?.ogImage)
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

export default async function IndexRoute({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        {isDraftMode ? (
          <Suspense fallback={<Navbar perspective="published" stega={false} />}>
            <DynamicNavbar />
          </Suspense>
        ) : (
          <Navbar perspective="published" stega={false} />
        )}
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        {isDraftMode ? (
          <Suspense fallback={<Footer perspective="published" stega={false} />}>
            <DynamicFooter />
          </Suspense>
        ) : (
          <Footer perspective="published" stega={false} />
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

async function DynamicNavbar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <Navbar perspective={perspective} stega={stega} />
}

async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <Footer perspective={perspective} stega={stega} />
}

async function Footer({
  perspective,
  stega,
}: Pick<DynamicFetchOptions, 'perspective' | 'stega'>) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return (
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
  )
}
