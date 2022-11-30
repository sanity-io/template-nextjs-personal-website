import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

export const settingsQuery = groq`
*[_type == "settings"][0]
`

export interface Settings {
  navigation?: any
  footer?: any[]
}

export async function getFooter(
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
