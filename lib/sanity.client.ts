import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { createClient } from 'next-sanity'

import type {
  HomePagePayload,
  MenuItem,
  PagePayload,
  ProjectPayload,
  SettingsPayload,
} from '../types'
import {
  homeQuery,
  pagesBySlugQuery,
  pagesQuery,
  projectBySlugQuery,
  settingsQuery,
} from './sanity.queries'

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

export async function getHome(
  token?: string | null
): Promise<HomePagePayload | undefined> {
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

export async function getPageBySlug(slug: string): Promise<PagePayload> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
    })
    return (await client.fetch(pagesBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getPages(
  token?: string | null
): Promise<MenuItem[] | undefined> {
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

export async function getProjectBySlug(
  slug: string
): Promise<ProjectPayload> | undefined {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
    })
    return (await client.fetch(projectBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getSettings(
  token?: string | null
): Promise<SettingsPayload | undefined> {
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
