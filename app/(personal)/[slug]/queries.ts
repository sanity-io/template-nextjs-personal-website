import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import { createClient, groq } from 'next-sanity'

const projectFields = groq`
  _id,
  title,
  "slug": slug.current,
  overview,
  coverImage,
  description,
  duration, 
  client, 
  site, 
  tags
`

export const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0] {
  ${projectFields}
}
`

export interface Project {
  title: string
  slug: string
  overview: any[]
  coverImage?: { asset?: any }
  description?: any[]
  duration?: any
  client?: string
  site?: string
  tags?: any[]
}

export async function getProjectBySlug(
  slug: string
): Promise<Project> | undefined {
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
