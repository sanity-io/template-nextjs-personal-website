import { HomePage } from 'components/pages/home/HomePage'
import Layout from 'components/shared/Layout'
import { readToken } from 'lib/sanity.api'
import { getClient } from 'lib/sanity.client'
import { homePageQuery, settingsQuery } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useLiveQuery } from 'next-sanity/preview'
import { HomePagePayload, SettingsPayload } from 'types'

interface PageProps {
  page: HomePagePayload
  settings: SettingsPayload
  draftMode: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

export default function IndexPage(props: PageProps) {
  const { page: initialPage, settings, draftMode } = props
  const [page, loading] = useLiveQuery<HomePagePayload | null>(
    initialPage,
    homePageQuery,
  )

  if (!page) {
    return (
      <Layout settings={settings} preview={draftMode} loading={loading}>
        {draftMode ? (
          <div className="text-center">
            Please start editing your Home document to see the preview!
          </div>
        ) : (
          <div className="text-center">
            You don&rsquo;t have a homepage document yet,{' '}
            <Link
              href="/studio/desk/home%7C%2Cview%3Dpreview"
              className="underline"
            >
              create one now
            </Link>
            !
          </div>
        )}
      </Layout>
    )
  }

  return (
    <HomePage
      preview={draftMode}
      loading={loading}
      page={page}
      settings={settings}
    />
  )
}

const fallbackPage: HomePagePayload = {
  title: '',
  overview: [],
  showcaseProjects: [],
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode)

  const [settings, page] = await Promise.all([
    client.fetch<SettingsPayload | null>(settingsQuery),
    client.fetch<HomePagePayload | null>(homePageQuery),
  ])

  return {
    props: {
      page: page ?? fallbackPage,
      settings: settings ?? {},
      draftMode,
      token: draftMode ? readToken : null,
    },
  }
}
