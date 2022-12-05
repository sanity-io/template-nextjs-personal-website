import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { groq } from 'next-sanity'
import { createClient } from 'next-sanity'

export interface About {
  name?: string
  overview?: any[]
}

export interface Page {
  name?: string
  overview?: any[]
  content?: any[]
}

const pageFields = groq`
  _id,
  title,
  slug,
  overview,
  content,
`

export const pageSlugsQuery = groq`
*[_type == "page" && defined(slug.current)][].slug.current
`

export const pagesBySlugQuery = groq`
*[_type == "page" && slug.current == $slug][0] {
  ${pageFields}
}
`

export async function getPageBySlug(slug: string): Promise<Page> {
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
