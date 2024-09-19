import '@/styles/index.css'

import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import { toPlainText, VisualEditing } from 'next-sanity'
import { Suspense } from 'react'

import { Footer } from '@/components/global/Footer'
import { Navbar } from '@/components/global/Navbar'
import IntroTemplate from '@/intro-template'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { homePageQuery, settingsQuery } from '@/sanity/lib/queries'
import { urlForOpenGraphImage } from '@/sanity/lib/utils'

import { handleDraftModeAction } from './actions'

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: settings }, { data: homePage }] = await Promise.all([
    sanityFetch({ query: settingsQuery, stega: false }),
    sanityFetch({ query: homePageQuery, stega: false }),
  ])

  const ogImage = urlForOpenGraphImage(settings?.ogImage as unknown as any)
  return {
    title: homePage?.title
      ? {
          template: `%s | ${homePage.title}`,
          default: homePage.title || 'Personal website',
        }
      : undefined,
    description: homePage?.overview
      ? toPlainText(homePage.overview)
      : undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export default async function IndexRoute({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        <Suspense>
          <Navbar />
        </Suspense>
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">
          <Suspense>{children}</Suspense>
        </div>
        <Suspense>
          <Footer />
        </Suspense>
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </div>
      {draftMode().isEnabled && <VisualEditing />}
      <SanityLive handleDraftModeAction={handleDraftModeAction} />
    </>
  )
}
