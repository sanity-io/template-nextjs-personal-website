import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

const homeFields = groq`
_id, title, overview, showcaseProjects[]->{title, overview, coverImage}, footer,
`

export const homeQuery = groq`
*[_type == "home"][0]{${homeFields}}
`

export interface ShowcaseProjects {
  title?: string
  overview?: any[]
  coverImage?: { asset?: any }
}
export interface Home {
  title?: string
  overview?: any[]
  showcaseProjects?: ShowcaseProjects[]
  footer?: any[]
}

export async function getHome(
  token?: string | null
): Promise<Home | undefined> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(homeQuery)
  }
  return undefined
}

export const pagesQuery = groq`
*[_type == "page"]
`

export interface Page {
  title?: string
  slug?: Slug
  content?: any[]
}

export interface Slug {
  current?: string
}

export async function getPages(
  token?: string | null
): Promise<Page[] | undefined> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(pagesQuery)
  }
  return undefined
}

export interface Settings {
  menuItems?: Page[]
  footer?: any[]
}

export interface Menu {
  menuItems?: Page[]
}

export const settingsQuery = groq`
*[_type == "settings"][0]{menuItems[]->{title, slug, content}, footer}
`

export async function getSettings(
  token?: string | null
): Promise<Settings | undefined> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(settingsQuery)
  }
  return undefined
}
