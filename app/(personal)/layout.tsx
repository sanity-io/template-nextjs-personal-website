import '@/styles/index.css'
import {FallbackNavbar, Navbar} from '@/components/Navbar'
import IntroTemplate from '@/intro-template'
import {isPreviewMode, sanityFetchMetadata, SanityLive} from '@/sanity/lib/live'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, Viewport} from 'next'
import {defineQuery} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Toaster} from 'sonner'
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {DEFAULT_TITLE} from '../constants'
import {Footer} from '@/components/Footer'

export async function generateMetadata(): Promise<Metadata> {
  // Only select exactly the fields we need
  const layoutMetadataQuery = defineQuery(`{
    "settings": *[_type == "settings"][0]{ogImage},
    "home": *[_type == "home"][0]{
      title,
      // Render portabletext to string
      "description": pt::text(overview)
    }
  }`)
  const {data, tags} = await sanityFetchMetadata({
    query: layoutMetadataQuery,
    params: {defaultTitle: DEFAULT_TITLE},
  })

  const ogImage = urlForOpenGraphImage(
    // @ts-expect-error - @TODO update @sanity/image-url types so it's compatible
    data?.ogImage,
  )
  return {
    title: data?.home?.title
      ? {
          template: `%s | ${data.home.title}`,
          default: data.home.title,
        }
      : DEFAULT_TITLE,
    // @TODO truncate to max length of 155 characters
    description: data?.home?.description?.trim().split('\n').join(' ').split('  ').join(' '),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export default async function PersonalWebsiteLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
        <Suspense fallback={<FallbackNavbar />}>
          <Navbar />
        </Suspense>
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        <Footer />
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </div>
      <Toaster />
      {(await isPreviewMode()) && <VisualEditing />}
      <SanityLive onError={handleError} />
      {(await draftMode()).isEnabled && <DraftModeToast />}
      <SpeedInsights />
    </>
  )
}
