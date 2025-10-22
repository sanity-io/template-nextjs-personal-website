import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {Navbar} from '@/components/Navbar'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, Viewport} from 'next'
import {toPlainText, type PortableTextBlock} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {cookies, draftMode} from 'next/headers'
import {Toaster} from 'sonner'
import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {resolvePerspectiveFromCookies} from 'next-sanity/experimental/live'

export async function generateMetadata(): Promise<Metadata> {
  const isDraftMode = (await draftMode()).isEnabled
  const perspective = isDraftMode
    ? await resolvePerspectiveFromCookies({cookies: await cookies()})
    : 'published'
  const [{data: settings}, {data: homePage}] = await Promise.all([
    sanityFetch({query: settingsQuery, perspective}),
    sanityFetch({query: homePageQuery, perspective}),
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
  const perspective = isDraftMode
    ? await resolvePerspectiveFromCookies({cookies: await cookies()})
    : 'published'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega: isDraftMode})

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-black">
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
