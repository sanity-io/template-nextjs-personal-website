import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { createClient, groq } from 'next-sanity'

const projectFields = groq`
  _id,
  title,
  "slug": slug.current,
  overview,
  coverImage,
  description
`

export const projectsSlugsQuery = groq`
*[_type == "page" && defined(slug.current)][].slug.current
`

export const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0] {
  ${projectFields}
}
`

export interface Project {
  title?: string
  slug?: string
  overview?: any[]
  coverImage?: { asset?: any }
  description?: any[]
}

export async function getProjectBySlug(slug: string): Promise<Project> {
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
