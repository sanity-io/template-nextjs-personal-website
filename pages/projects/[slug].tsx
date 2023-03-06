import { PreviewSuspense } from '@sanity/preview-kit'
import { ProjectPage } from 'components/pages/project/ProjectPage'
import { PreviewWrapper } from 'components/preview/PreviewWrapper'
import {
  getHomePageTitle,
  getProjectBySlug,
  getProjectPaths,
  getSettings,
} from 'lib/sanity.client'
import { resolveHref } from 'lib/sanity.links'
import { GetStaticProps } from 'next'
import { lazy } from 'react'
import { ProjectPayload, SettingsPayload } from 'types'

const ProjectPreview = lazy(
  () => import('components/pages/project/ProjectPreview')
)

interface PageProps {
  project?: ProjectPayload
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
  const { homePageTitle, settings, project, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <PreviewWrapper>
            <ProjectPage
              homePageTitle={homePageTitle}
              project={project}
              settings={settings}
              preview={preview}
            />
          </PreviewWrapper>
        }
      >
        <ProjectPreview
          token={token}
          project={project}
          settings={settings}
          homePageTitle={homePageTitle}
        />
      </PreviewSuspense>
    )
  }

  return (
    <ProjectPage
      homePageTitle={homePageTitle}
      project={project}
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

  const [settings, project, homePageTitle] = await Promise.all([
    getSettings({ token }),
    getProjectBySlug({ token, slug: params.slug }),
    getHomePageTitle({ token }),
  ])

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
      settings,
      homePageTitle,
      preview,
      token: previewData.token ?? null,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = await getProjectPaths()

  return {
    paths: paths?.map((slug) => resolveHref('project', slug)) || [],
    fallback: false,
  }
}
