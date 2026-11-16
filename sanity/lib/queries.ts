import {defineQuery} from 'next-sanity'

import type {AllSanitySchemaTypes, Slug} from '@/sanity.types'

/**
 * Custom GROQ functions for `next-sanity/image`: crop, hotspot, asset URL, LQIP, and dimensions.
 * Functions must be declared at the start of every query that calls them, so prepend this constant.
 * https://www.sanity.io/docs/content-lake/custom-groq-functions
 */
export const imageFunctions = /* groq */ `
  fn image::asset($asset) = $asset->{url, metadata{lqip, dimensions}};
  fn image::field($image) = $image{crop, hotspot, "asset": image::asset(asset)};
  fn image::richText($blocks) = $blocks[]{
    ...,
    _type == "image" => {_key, _type, alt, caption, crop, hotspot, "asset": image::asset(asset)},
    _type == "timeline" => {
      ...,
      items[]{
        ...,
        milestones[]{
          ...,
          "image": image::field(image)
        }
      }
    }
  };
`

export const settingsQuery = defineQuery(`
  ${imageFunctions}
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
    "ogImage": image::field(ogImage),
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
