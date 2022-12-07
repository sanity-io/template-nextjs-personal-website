import { groq } from 'next-sanity'

const homeFields = groq`
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
`

const pageFields = groq`
  _id,
  content,
  overview,
  slug,
  title,
`

const postFields = groq`
  _id,
  title,
  date,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{
    name, 
    picture
  },
`

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

export const homeQuery = groq`
*[_type == "home"][0]{${homeFields}}
`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const pagesQuery = groq`
*[_type == "page"]
`

export const pageSlugsQuery = groq`
*[_type == "page" && defined(slug.current)][].slug.current
`

export const pagesBySlugQuery = groq`
*[_type == "page" && slug.current == $slug][0] {
  ${pageFields}
}
`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`
export const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0] {
  ${projectFields}
}
`

export const settingsQuery = groq`
*[_type == "settings"][0]{
  footer,
  menuItems[]->{
    _type,
    (_type == 'home') => {    
      "href": "/"
    },
    (_type == 'page') => {    
      "href": "/page/" + slug.current      
    },  
    (_type == 'project') => {    
      "href": "/project/" + slug.current      
    },    
    content,
    title
  }
}
`
