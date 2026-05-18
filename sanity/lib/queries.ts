import type {AllSanitySchemaTypes, Slug} from '@/sanity.types'
import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    },
    ogImage,
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current}
`)
// Infer valid `type` params from all TypeGen schema types that has a top-level `slug` field
export type SlugsByTypeQueryParams = {
  type: AllSanitySchemaTypes extends infer SchemaType
    ? SchemaType extends unknown
      ? 'slug' extends keyof SchemaType
        ? SchemaType extends {_type: infer Type extends string; slug?: Slug}
          ? Type
          : never
        : never
      : never
    : never
}
