import { ProjectPage } from 'components/pages/project/ProjectPage'
import ProjectPreview from 'components/pages/project/ProjectPreview'
import { readToken } from 'lib/sanity.api'
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

export default function ProjectSlugRoute(props: PageProps) {
  const { homePageTitle, settings, project, preview } = props

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

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

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
      preview: draftMode,
      token: draftMode ? readToken : null,
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
