import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

export const aboutQuery = groq`
*[_type == "about"][0]
`

export interface About {
  name?: string
}

export async function getAbout(
  token?: string | null
): Promise<About | undefined> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(aboutQuery)
  }
  return undefined
}
