import { ProjectPage } from 'components/pages/project/ProjectPage'
import ProjectPreview from 'components/pages/project/ProjectPreview'
import { getClient } from 'lib/sanity.client'
import { resolveHref } from 'lib/sanity.links'
import {
  homePageTitleQuery,
  projectBySlugQuery,
  projectPaths,
  settingsQuery,
} from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { ProjectPayload, SettingsPayload } from 'types'

interface PageProps {
  project: ProjectPayload
  settings: SettingsPayload
  homePageTitle?: string
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token: string
}

export default function ProjectSlugRoute(props: PageProps) {
  const { homePageTitle, settings, project, preview, token } = props

  if (preview) {
    return (
      <ProjectPreview
        project={project}
        settings={settings}
        homePageTitle={homePageTitle}
      />
    )
  }

  return (
    <ProjectPage
      homePageTitle={homePageTitle}
      project={project}
      settings={settings}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData, params = {} } = ctx
  const client = getClient(preview ? previewData : undefined)

  const [settings, project, homePageTitle] = await Promise.all([
    client.fetch<SettingsPayload | null>(settingsQuery),
    client.fetch<ProjectPayload | null>(projectBySlugQuery, {
      slug: params.slug,
    }),
    client.fetch<string | null>(homePageTitleQuery),
  ])

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
      settings: settings ?? {},
      homePageTitle: homePageTitle ?? undefined,
      preview,
      token: previewData?.token ?? null,
    },
  }
}

export const getStaticPaths = async () => {
  const client = getClient()
  const paths = await client.fetch<string[]>(projectPaths)

  return {
    paths: paths?.map((slug) => resolveHref('project', slug)) || [],
    fallback: false,
  }
}
