import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id, 
    footer,
    overview, 
    showcaseProjects[]->{
      _type,
      coverImage, 
      overview, 
      "slug": slug.current,
      tags, 
      title, 
    }, 
    title, 
  }
`

export const homePageTitleQuery = groq`
  *[_type == "home"][0].title
`

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    body,
    overview,
    slug,
    title,
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    client, 
    coverImage,
    description,
    duration, 
    overview,
    site, 
    "slug": slug.current,
    tags,
    title,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    footer,
    menuItems[]->{
      _type,
      "slug": slug.current,
      title
    },
    ogImage,
    title
  }
`
