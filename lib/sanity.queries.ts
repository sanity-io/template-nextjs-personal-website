import { groq } from 'next-sanity'

export const homePageQuery = groq`
*[_type == "home"][0]{
  _id, 
  footer,
  overview, 
  showcaseProjects[]->{
    coverImage, 
    overview, 
    slug,
    tags, 
    title, 
  }, 
  title, 
}
`

export const pagesQuery = groq`
*[_type == "page"]
`

export const pagesBySlugQuery = groq`
*[_type == "page" && slug.current == $slug][0] {
  _id,
  content,
  overview,
  slug,
  title,
}
`

export const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0] {
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
}
`

export const settingsQuery = groq`
*[_type == "settings"][0]{
  footer,
  menuItems[]->{
    _type,
    content,
    "slug": slug.current,
    title
  }
}
`
