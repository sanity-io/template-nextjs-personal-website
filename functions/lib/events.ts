import type {BlueprintDocumentFunctionResourceEvent} from '@sanity/blueprints'

export type FunctionName =
  | 'describe-images'
  | 'generate-images'
  | 'auto-slug'
  | 'auto-tag'
  | 'seo-overview'
  | 'slug-redirects'
  | 'auto-showcase'

export type FunctionEvent = Omit<BlueprintDocumentFunctionResourceEvent, 'resource'>

export interface FunctionSpec {
  event: FunctionEvent
  timeout: number
}

export type SlugDocumentType = 'project' | 'page'

const created = '!defined(before())'

export type AltPath = (string | {_key: string})[]

export interface DescribeImagesPayload {
  _id: string
  title: string | null
  targets: AltPath[]
}

type RichTextField = 'description' | 'body'

const altMissingImages = (field: RichTextField) =>
  `${field}[_type == "image" && defined(asset) && !defined(alt)]`

// groq-js accepts a filtered array as a `changedAny` selector but not an attribute mapped over it
// (`description[_type == "image"].asset`), so a block's alt or caption edit counts as a change too.
const imageBlocksChanged = (field: RichTextField) =>
  `(count(${altMissingImages(field)}) > 0 && (${created} || delta::changedAny(${field}[_type == "image"])))`

const altTargets = (field: RichTextField) =>
  `...${altMissingImages(field)}{"path": ["${field}", {"_key": _key}, "alt"]}.path`

const coverAltMissing = 'defined(coverImage.asset) && !defined(coverImage.alt)'

const describeImages: FunctionSpec = {
  timeout: 30,
  event: {
    on: ['create', 'update'],
    includeDrafts: true,
    filter: `_type in ["project", "page"] && (
      (${coverAltMissing} && (${created} || delta::changedAny(coverImage.asset))) ||
      ${imageBlocksChanged('description')} ||
      ${imageBlocksChanged('body')}
    )`,
    projection: `{
      _id, title,
      "targets": array::compact([
        select(${coverAltMissing} => ["coverImage", "alt"]),
        ${altTargets('description')},
        ${altTargets('body')}
      ])
    }`,
  },
}

const imageKinds = {coverImage: 'cover', ogImage: 'og'} as const

type ImageField = keyof typeof imageKinds

export type ImageJob = {
  [Field in ImageField]: {field: Field; kind: (typeof imageKinds)[Field]; prompt: string}
}[ImageField]

export interface GenerateImagesPayload {
  _id: string
  _type: SlugDocumentType | 'settings'
  _rev: string
  title: string | null
  overview: string | null
  jobs: ImageJob[]
}

const wantsImage = (field: ImageField) =>
  `(defined(${field}.imagePrompt) && !defined(${field}.asset) && (${created} || delta::changedAny(${field}.imagePrompt) || defined(before().${field}.asset)))`

const imageJob = (field: ImageField) =>
  `select(${wantsImage(field)} => {"field": "${field}", "kind": "${imageKinds[field]}", "prompt": ${field}.imagePrompt})`

const generateImages: FunctionSpec = {
  timeout: 30,
  event: {
    on: ['create', 'update'],
    includeDrafts: true,
    filter: `_type in ["project", "page", "settings"] && (${wantsImage('coverImage')} || ${wantsImage('ogImage')})`,
    projection: `{
      _id, _type, _rev, title, "overview": pt::text(overview),
      "jobs": array::compact([${imageJob('coverImage')}, ${imageJob('ogImage')}])
    }`,
  },
}

export interface AutoSlugPayload {
  _id: string
  _type: SlugDocumentType
  _rev: string
  title: string
}

const autoSlug: FunctionSpec = {
  timeout: 15,
  event: {
    on: ['create', 'update'],
    includeDrafts: true,
    filter: '_type in ["project", "page"] && defined(title) && !defined(slug.current)',
    projection: '{_id, _type, _rev, title}',
  },
}

export interface AutoTagPayload {
  _id: string
  _rev: string
}

const autoTag: FunctionSpec = {
  timeout: 30,
  event: {
    on: ['create'],
    filter:
      '_type == "project" && count(coalesce(tags, [])) == 0 && length(pt::text(description)) > 0',
    projection: '{_id, _rev}',
  },
}

export interface SeoOverviewPayload {
  _id: string
  _type: SlugDocumentType
  _rev: string
}

const prose = (doc: 'before()' | 'after()') => `pt::text(coalesce(${doc}.description, ${doc}.body))`

const seoOverview: FunctionSpec = {
  timeout: 30,
  event: {
    on: ['create', 'update'],
    includeDrafts: true,
    filter: `_type in ["project", "page"] &&
      length(coalesce(pt::text(overview), "")) == 0 &&
      length(pt::text(coalesce(description, body))) >= 200 &&
      (${created} || ${prose('before()')} != ${prose('after()')})`,
    projection: '{_id, _type, _rev}',
  },
}

export interface SlugRedirectsPayload {
  _id: string
  _type: SlugDocumentType
  from: string
}

const slugRedirects: FunctionSpec = {
  timeout: 15,
  event: {
    on: ['update'],
    filter:
      '_type in ["project", "page"] && delta::changedAny(slug.current) && defined(before().slug.current) && defined(after().slug.current)',
    projection: '{_id, _type, "from": before().slug.current}',
  },
}

export interface AutoShowcasePayload {
  _id: string
}

const autoShowcase: FunctionSpec = {
  timeout: 15,
  event: {
    on: ['create'],
    filter: '_type == "project"',
    projection: '{_id}',
  },
}

export const functionSpecs: Record<FunctionName, FunctionSpec> = {
  'describe-images': describeImages,
  'generate-images': generateImages,
  'auto-slug': autoSlug,
  'auto-tag': autoTag,
  'seo-overview': seoOverview,
  'slug-redirects': slugRedirects,
  'auto-showcase': autoShowcase,
}
