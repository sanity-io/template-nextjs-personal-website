import { PreviewSuspense } from '@sanity/preview-kit'
import { Page } from 'components/pages/page/Page'
import { PreviewWrapper } from 'components/preview/PreviewWrapper'
import {
  getHomePageTitle,
  getPageBySlug,
  getPagePaths,
  getSettings,
} from 'lib/sanity.client'
import { resolveHref } from 'lib/sanity.links'
import { GetStaticProps } from 'next'
import { lazy } from 'react'
import { PagePayload, SettingsPayload } from 'types'

const PagePreview = lazy(() => import('components/pages/page/PagePreview'))

interface PageProps {
  page?: PagePayload
  settings?: SettingsPayload
  homePageTitle?: string
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function ProjectSlugRoute(props: PageProps) {
  const { homePageTitle, settings, page, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <PreviewWrapper>
            <Page
              homePageTitle={homePageTitle}
              page={page}
              settings={settings}
              preview={preview}
            />
          </PreviewWrapper>
        }
      >
        <PagePreview
          token={token}
          page={page}
          settings={settings}
          homePageTitle={homePageTitle}
        />
      </PreviewSuspense>
    )
  }

  return (
    <Page
      homePageTitle={homePageTitle}
      page={page}
      settings={settings}
      preview={preview}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = previewData.token

  const [settings, page, homePageTitle] = await Promise.all([
    getSettings({ token }),
    getPageBySlug({ token, slug: params.slug }),
    getHomePageTitle({ token }),
  ])

  if (!page) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page,
      settings,
      homePageTitle,
      preview,
      token: previewData.token ?? null,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = await getPagePaths()

  return {
    paths: paths?.map((slug) => resolveHref('page', slug)) || [],
    fallback: false,
  }
}
