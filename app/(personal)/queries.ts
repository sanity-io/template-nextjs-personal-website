import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

const settingsFields = groq`
_id, title, overview, showcaseProjects[]->{title, overview, coverImage}, footer,
`

export const settingsQuery = groq`
*[_type == "landingpage"][0]{${settingsFields}}
`

export interface ShowcaseProjects {
  title?: string
  overview?: any[]
  coverImage?: { asset?: any }
}
export interface Settings {
  title?: string
  overview?: any[]
  showcaseProjects?: ShowcaseProjects[]
  footer?: any[]
}

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

export interface Menu {
  menuItems?: Page[]
}

export const menuQuery = groq`
*[_type == "menu"][0]{menuItems[]->{title, slug, content}}
`

export async function getMenuItems(
  token?: string | null
): Promise<Menu | undefined> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(menuQuery)
  }
  return undefined
}
