---
name: sanity-live-cache-components
description: Migrate next-sanity apps to cacheComponents - strict mode, three-layer component pattern, explicit perspective/stega/includeDrafts, prop-drilling conventions
---

# Sanity Live + Cache Components

You are an expect in Next.js who's aware that your training data is likely outdated, always read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
If the guide conflicts what is said in this skill, then follow this skill's instructions.
You will be integrating Sanity Live to your Next.js app, so that data is fetched with `sanityFetch` which calls `cacheTag` and `cacheLife` internally, and a `<SanityLive />` component rendered in the root layout that handles revalidating cached content in response to live events sent by Sanity Content Lake over an EventSource connection. Your integration is sophisticated and ensures it fully supports visual editing and presentation tool, which is enabled when nextjs is in draft mode.

## Prerequisites

- You have upgraded to `next@16.2.x` or later.
- You have a working Next.js 16+ app with the following environment variables setup already:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_READ_TOKEN`

---

## 1. Upgrade to `next-sanity@latest`

If `next-sanity@latest` isn't v13 yet then use `next-sanity@cache-components` instead, check with `npm dist-tags ls next-sanity | grep latest`.

```bash
npm install next-sanity@^13 --save-exact
```

---

## 2. Configure `next.config.ts`

The `cacheComponents` flag must be set to `true`, and it's also recommended to set `cacheLife.default` to `sanity` so that the default revalidation time is 1 year instead of 15 minutes, as `sanityFetch` is optimized for on-demand revalidation and does not need any time-based revalidation.

```ts
// next.config.ts
import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
}

export default nextConfig
```

---

## 3. Configure `defineLive` and export `sanityFetch`, `<SanityLive>`, and other helpers

### `client.ts`

Projects typically have a `src/sanity/lib/client.ts` file that exports a `const client = createClient({})`,
it should look like this:

```ts
// src/sanity/lib/client.ts
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: 'v2026-05-19',
  perspective: 'published',
  stega: {studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'},
})
```

The `client.ts` file should use a modern `apiVersion` (for example today's date as a hardcoded string), and `stega: {studioUrl}` to enable stega encoding.
`stega.studioUrl` can be a relative string if there's a route that renders an embedded Sanity Studio, using `NextStudio` from `next-sanity/studio`. Otherwise it could be an absolute URL, typically set by an environment variable.

### `live.ts`

Create a `live.ts` file in the same directory as `client.ts` that exports `sanityFetch`, `<SanityLive>`, and other helpers:

```ts
// src/sanity/lib/live.ts
import {type QueryParams} from 'next-sanity'
import {defineLive, resolvePerspectiveFromCookies, type LivePerspective} from 'next-sanity/live'
import {cookies, draftMode} from 'next/headers'
import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const {SanityLive, sanityFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

export interface DynamicFetchOptions {
  perspective: LivePerspective
  stega: boolean
}
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return {perspective: 'published', stega: false}
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', stega: true}
}

// For usage within `generateStaticParams`
export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString
  params?: QueryParams
}) {
  const {data} = await sanityFetch({query, params, perspective: 'published', stega: false})
  return {data}
}

// For usage within `generateMetadata` and `generateViewport`
export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString
  params?: QueryParams
  perspective: LivePerspective
}) {
  const {data} = await sanityFetch({query, params, perspective, stega: false})
  return {data}
}
```

#### `sanityFetch`

For fetching data in React Server Components that has `'use cache'` directives and eventually rendered in a `page.tsx` or `layout.tsx`.
The `stega` option is for Visual Editing support, when `stega: true`, with `stega.studioUrl` set in `createClient`, and with `<VisualEditing />` rendered in a root layout, then this will render click-to-edit overlays on top of content.

- The `perspective` option is for switching between published and draft content, and specific Sanity Content Releases.
- The `getDynamicFetchOptions` helper also ensures that `perspective` is resolved from the `'sanity-preview-perspective'` cookie, this cookie is managed by `<VisualEditing>` when the app is rendered in a preview iframe within Presentation Tool in a Sanity Studio. The user can change which content releases to preview, and the iframe automatically updates to show the content for the selected content release.

Any async function that calls `sanityFetch` should have `'use cache'` or `'use cache: remote'` directives.
That async function boundary should take `perspective` and `stega` options as props, it should never hardcode them to `perspective: 'published'` or `stega: false` as this would mean Visual Editing and previewing draft content as well as specific content releases won't work.

In other words, always do this:

```tsx
import {sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function CachedComponent({slug, perspective, stega}: {slug: string} & DynamicFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({query: pageQuery, params: {slug}, perspective, stega})
}
```

Never do:

```tsx
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function CachedComponent({slug}: {slug: string}) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective: 'published',
    stega: false,
  }) // oh no, perspective and stega options are hardcoded!
}
```

If `sanityFetch` is called within a server action (boundary with `'use server'`) then you should never hardcode `perspective` or `stega` either, and also never take them as props to the server action function since server action input are considered untrusted and can be manipulated by the client and the underlying POST request.
Resolve them in the `'use server'` boundary, and pass them as props to a `'use cache'` boundary that calls `sanityFetch`.
In other words, always do this for server action functions:

```tsx
import {sanityFetch, type DynamicFetchOptions, getDynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function fetchMore({page, perspective, stega}: {page: string} & DynamicFetchOptions) {
  'use cache'
  const pagesQuery = defineQuery(`*[_type == "page"][0...$page]`)
  const {data} = await sanityFetch({query: pagesQuery, params: {page}, perspective, stega})
  return data
}
async function renderMore({page}: {page: string}) {
  'use server'
  const {perspective, stega} = await getDynamicFetchOptions()
  const data = await fetchMore({page, perspective, stega})
}
```

Never do:

```tsx
import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function fetchMore({page}: {page: string}) {
  'use cache'
  const pagesQuery = defineQuery(`*[_type == "page"][0...$page]`)
  const {data} = await sanityFetch({
    query: pagesQuery,
    params: {page},
    perspective: 'published',
    stega: false,
  }) // oh no, perspective and stega options are hardcoded!
  return data
}
async function renderMore({page}: {page: string}) {
  'use server'
  const data = await fetchMore({page})
}
```

```tsx
import {sanityFetch, getDynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function renderMore({page}: {page: string}) {
  'use server'
  const {perspective, stega} = await getDynamicFetchOptions()
  const pagesQuery = defineQuery(`*[_type == "page"][0...$page]`)
  const {data} = await sanityFetch({query: pagesQuery, params: {page}, perspective, stega}) // oh no, sanityFetch is called in a 'use server' boundary directly, this means it won't be cached
}
```

If `sanityFetch` is called in a `route.ts` file, then you typically want to hardcode `stega: false` and only resolve `perspective`, as the route handler is unlikely to return a `Response` that will be rendered in the same DOM as an `<VisualEditing>` component and thus use the stega encoded strings to render overlays. Thus the stega is at best going to be ignored and bloat the payload size unnecessarily, at worst it can cause errors and unexpected behavior.

#### `sanityFetchMetadata`

For fetching data in `generateMetadata`, `generateSitemaps`, `generateViewport`, `generateImageMetadata` functions and `icon.tsx`, `apple-icon.tsx`, `manifest.ts`, `opengraph-image.tsx`, `twitter-image.tsx`, `robots.ts`, `sitemap.ts` files.

It's used the same way as `sanityFetch`, but without the ability to set `stega: true` as `sanityFetchMetadata` is designed to be used in contexts where stega encoding is never needed and should always be `false`.

Presentation Tool supports opening an app in a new preview window, in addition to its preview iframe. To ensure that the correct content release is previewed when checking metadata like `<title>` and such it's necessary to resolve `perspective`, as with `sanityFetch`.

This means you should always do:

```ts
import {
  sanityFetchMetadata,
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function cachedMetadata({
  slug,
  perspective,
}: {slug: string} & Pick<DynamicFetchOptions, 'perspective'>) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetchMetadata({query: pageQuery, params: {slug}, perspective})
  return data
}
export async function generateMetadata({params}: PageProps<'/[slug]'>) {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const data = await cachedMetadata({slug, perspective})
}
```

Never do:

```ts
import {sanityFetchMetadata} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
async function cachedMetadata({slug}: {slug: string}) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetchMetadata({
    query: pageQuery,
    params: {slug},
    perspective: 'published',
  }) // oh no, perspsective is hardcoded and perspective switching won't work
  return data
}
export async function generateMetadata({params}: PageProps<'/[slug]'>) {
  const {slug} = await params
  const data = await cachedMetadata({slug, perspective})
}
```

```ts
import {sanityFetchMetadata, getDynamicFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
export async function generateMetadata({params}: PageProps<'/[slug]'>) {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetchMetadata({query: pageQuery, params: {slug}, perspective}) // oh no, this fetch is not cached!
}
```

#### `getDynamicFetchOptions`

Since `sanityFetch` is designed to be called inside a `'use cache'` boundary, we need to resolve `perspective` and `stega` options outside of it and pass it as props.
The way `perspective` is resolved includes calling a dynamic API, `cookies()`, which means it needs to happen in a component that is wrapped in `<Suspense>` so that it does not block the page. That means `getDynamicFetchOptions` can't be called in the body of a `layout.tsx` or a `page.tsx` component, as it would mean said top-level components would no longer be cached.
When Cache Components are enabled the `<Suspense>` boundaries determine what's part of the static shell that is prerendered during `next build`, and what is streamed in at runtime. Thus we only want to use these `<Suspense>` boundaries when in draft mode.

Here's an example of what that looks like for a `<Footer>` component in a `layout.tsx` that fetches data:

```tsx
// src/app/(website)/layout.tsx
'use cache'
import {sanityFetch, SanityLive, getDynamicFetchOptions} from '@/sanity/lib/live'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <>
      {children}
      {isDraftMode ? (
        <Suspense fallback={<FooterFallback />}>
          <DynamicFooter />
        </Suspense>
      ) : (
        <Footer perspective="published" stega={false} />
      )}
    </>
  )
}
async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <Footer perspective={perspective} stega={stega} />
}
async function Footer({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: footerQuery, perspective, stega})
  return <footer>{/* use `data` to render stuff */}</footer>
}
function FooterFallback() {
  return (
    <footer>
      <p>Loading footer...</p>
    </footer>
  )
}
```

In this example the `<Footer perspective="published" stega={false} />` is able to be part of the static shell during prerender, so the whole layout is properly cached and only revalidated whenever content used by the `sanityFetch` call in `Footer` changes. While also ensuring that while in draft mode the page does not block on the `sanityFetch` call and the layout can render immediately, using its static shell while the `<DynamicFooter>` is streaming in at the `<Suspense>` boundary. If it's fast enough then `<FooterFallback>` will never show.

Having `'use cache'` at the top of the `layout.tsx` is preferred, having the directive at the top of the body of `WebsiteLayout` is also acceptable.

#### `sanityFetchStaticParams`

When fetching data in a `generateStaticParams` function, then we never want `stega` since the data is used to generate route params, and we also know that this function is only called at `next build` time so there is no point in trying to resolve a `perspective` from `cookies`, as it's never run at request time where there might be cookies.

In other words, never call `sanityFetch` in a `generateStaticParmas` function, always use `sanityFetchStaticParams`. Never call `sanityFetchStaticParams` outside of a `generateStaticParams` function.

---

## 4. Render `<SanityLive>` in a root layout

The `<SanityLive>` component exported from `defineLive` should be in the root layout.
Usually that is `src/app/layout.tsx`, and is also where `<VisualEditing />` from `next-sanity/visual-editing` is rendered. Regardless of how the Next.js app might be using Route Groups and nested layouts and pages, the `<SanityLive>` and `<VisualEditing>` components should be in a `layout.tsx`, not a `page.tsx`. At any point in time both components should at most be rendered once, rendering the same component multiple times is undefined behavior and can cause unexpected problems.

```tsx
// src/app/layout.tsx
'use cache'
import {SanityLive} from '@/sanity/lib/live'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
```

### Dealing with embedded Sanity Studio

If there's a route that renders an embedded Sanity Studio, using `NextStudio` from `next-sanity/studio`, then the `<SanityLive>` needs to be in a layout that won't be used by the embedded studio, using [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups).
For example, if `NextStudio` is used on `app/studio/[[...index]]/page.tsx`, then the `<SanityLive>` needs to be in `src/app/(website)/layout.tsx` and the rest of the app should be in `src/app/(website)`.

---

## 5. The Three-Layer Component Pattern

This is the core architecture for every route that can be fully statically prerendered and cached.

### Structure

```
Page/Layout (Layer 1)
  ├── NOT draft mode → <CachedX perspective="published" stega={false} />  (no Suspense)
  └── draft mode → <Suspense fallback={...}>
                      <DynamicX params={params} />  (Layer 2)
                        └── <CachedX params={await params} perspective={p} stega={s} />  (Layer 3)
```

### Example with a `[slug]/page.tsx` route

The layer examples below showcase how to handle params on a `/[slug]/page.tsx` route, which requires a `generateStaticParams` function like the one below:

```tsx
// src/app/[slug]/page.tsx
import {defineQuery} from 'next-sanity'
import {sanityFetchStaticParams} from '@/sanity/lib/live'

export async function generateStaticParams() {
  const pageSlugsQuery = defineQuery(
    `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
  )
  return await sanityFetchStaticParams({query: pageSlugsQuery})
}
```

On routes like `/layout.tsx`, or `/page.tsx`, then you can omit the `params` handling.

### Layer 1: Page Component

Calls `draftMode()` and branches:

```tsx
// src/app/[slug]/page.tsx (continued)
import {draftMode} from 'next/headers'

export default async function Page({params}: PageProps<'/[slug]'>) {
  'use cache'
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense
        // optional, but highly recommended, a good fallback skeleton should not cause layout shift when `<Suspense>` transitions from showing `fallback` to `children`
        fallback={<PageFallback />}
      >
        <DynamicPage
          // do not await `params` here, it needs to be awaited in `<DynamicPage>` for the Suspense boundary to work
          params={params}
        />
      </Suspense>
    )
  }
  return <CachedPage perspective="published" stega={false} />
}
```

- `Page` should have a `'use cache'` directive, so that it doesn't accidentally start using dynamic APIs like `cookies()` that would make it no longer part of the static shell.
- Requires `generateStaticParams` if `params` is used as input to `sanityFetch`
- **Not in draft mode**: no `<Suspense>` boundary, maximizes static shell
- **In draft mode**: render `<DynamicPage />` in a `<Suspense>` boundary, preferrably with a good fallback skeleton as it'll suspend twice:
  1. first suspend when `<DynamicPage>` is rendered as it will `await getDynamicFetchOptions()`
  2. second suspend when `<CachedPage />` is rendered as it will `await sanityFetch()` using the `perspective` and `stega` options resolved by `<DynamicPage>`

#### `searchParams` and other dynamic APIs

If you need to use `searchParams` or other dynamic APIs (or `params` without providing `generateStaticParams` or a `loading.tsx` for the route) as input to the `sanityFetch`, then you should always render the `<Suspense>` tree and no longer branch on `draftMode`:

```tsx
// src/app/[slug]/page.tsx (continued)
import {draftMode} from 'next/headers'

// Do not export an async function here, to avoid accidentally blocking render while awaiting a dynamic API
export default function Page({params}: PageProps<'/[slug]'>) {
  return (
    <Suspense
      // not optional since we no longer branch on `draftMode`, not providing a skeleton means Suspense will render `null`, causing massive layout shift that users hate
      fallback={<PageFallback />}
    >
      <DynamicPage
        // do not await `params` here, it needs to be awaited in `<DynamicPage>` for the Suspense boundary to work
        params={params}
      />
    </Suspense>
  )
}
```

### Layer 2: Dynamic Component

Since `<CachedPage>` has `'use cache'` it's not allowed to call `cookies()` or `await props.params`, so `<DynamicPage>` must await them and pass them as props.

```tsx
// src/app/[slug]/page.tsx (continued)
import {getDynamicFetchOptions} from '@/sanity/lib/live'

async function DynamicPage({params}: Pick<PageProps<'/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])

  return <CachedPage slug={slug} perspective={perspective} stega={stega} />
}
```

### Layer 3: Cached Component

Has `'use cache'` and only receives plain, serializable props:

```tsx
// src/app/[slug]/page.tsx (continued)
import {defineQuery} from 'next-sanity'
import {type DynamicFetchOptions} from '@/sanity/lib/live'

async function CachedPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective,
    stega,
  })
}
```

---

## 6. Non-blocking data fetching for `layout.tsx` in draft mode

When using `sanityFetch` in a `layout.tsx` file then it's important to keep these constraints in mind when implementing the 3-layer pattern:
- The top-level component in `layout.tsx` should not `await` any dynamic APIs or perform data fetching, it can reduce the static shell, and it slows down streaming in draft mode.
- Data fetching, and [dynamic API calls, should be pushed closer to where it's used](https://nextjs.org/docs/app/guides/streaming#push-dynamic-access-down).
- Shared data fetching can be extracted to a reused async `use cache` boundary function to reduce the footprint of multiple components that need the same data and to reduce latency in draft mode.

In other words, do this:
```tsx
// src/app
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {getDynamicFetchOptions, type DynamicFetchOptions, sanityFetch} from '@/sanity/lib/live'

export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  'use cache'
  const {isEnabled: isDraftMode} = await draftMode()
  return <>
    {children}
    {isDraftMode ? (
      <Suspense fallback={<FooterFallback />}>
        <DynamicFooter />
      </Suspense>
    ) : (
      <CachedFooter perspective="published" stega={false} />
    )}
  </>
}

async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <Footer perspective={perspective} stega={stega} />
}

async function CachedFooter({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const footerQuery = defineQuery()
  const {data} = await sanityFetch({query: footerQuery, perspective, stega})
}

function FooterFallback() {
  return <footer>Loading footer...</footer>
}
```
