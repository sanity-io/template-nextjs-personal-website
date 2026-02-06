import '@/styles/index.css'
import {Footer} from '@/components/Footer'
import {Navbar} from '@/components/Navbar'
import {IntroTemplate} from '@/intro-template'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata, Viewport} from 'next'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {Toaster} from 'sonner'
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'
import { Fragment } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  'use cache'

  const [{data: settings}, {data: homePage}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false, perspective: 'published'}),
    sanityFetch({query: homePageQuery, stega: false, perspective: 'published'}),
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

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <CachedLayout
      navbar={<Navbar key="navbar" />}
      footer={<Footer key="footer" />}
      live={<SanityLive key="live" includeAllDocuments={isDraftMode} onError={handleError} />}
      visualEditing={
        isDraftMode && (
          <Fragment key="visual-editing">
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
          </Fragment>
        )
      }
    >
      {children}
    </CachedLayout>
  )
}

async function CachedLayout({
  children,
  navbar,
  footer,
  live,
  visualEditing,
}: {
  children: React.ReactNode
  navbar: React.ReactNode
  footer: React.ReactNode
  live: React.ReactNode
  visualEditing: React.ReactNode
}) {
  'use cache'

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        {navbar}
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        {footer}
        <IntroTemplate />
      </div>
      <Toaster />
      {live}
      {visualEditing}
      <SpeedInsights />
    </>
  )
}
