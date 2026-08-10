# Three-layer component pattern

This repository uses a simplified three-layer pattern centered on a `[perspective]` segment and route-level `'use cache'` leaves.

## Structure

```text
Page/Layout shell (non-async)
  └── <Suspense fallback={...}>
        {params.then(({perspective, ...rest}) => (
          <CachedX perspective={normalizePerspective(perspective)} {...rest} />
        ))}

Cached leaf
  ├── 'use cache'
  └── await sanityFetch({ query, params?, perspective })
```

## `generateStaticParams` for dynamic routes

Use `sanityFetchStaticParams` and include the `perspective` segment in returned params.

```tsx
import {sanityFetchStaticParams} from '@/sanity/lib/live'
import {slugsByTypeQuery, type SlugsByTypeQueryParams} from '@/sanity/lib/queries'

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'page'} satisfies SlugsByTypeQueryParams,
  })

  const staticParams = (data ?? []).map(({slug}) => ({perspective: 'published' as const, slug}))
  return staticParams.length > 0
    ? staticParams
    : [{perspective: 'published' as const, slug: '__placeholder__'}]
}
```

## Layer 1: Route shell

Keep top-level routes non-async and pass unresolved `params` into a Suspense-wrapped resolver:

```tsx
import {normalizePerspective} from '@/sanity/lib/live'
import {Suspense} from 'react'

export default function Page({params}: PageProps<'/[perspective]/[slug]'>) {
  return (
    <Suspense>
      {params.then(({perspective, slug}) => (
        <CachedPage perspective={normalizePerspective(perspective)} slug={slug} />
      ))}
    </Suspense>
  )
}
```

## Layer 2: Cached leaf

The cached leaf owns data fetching and rendering:

```tsx
import {sanityFetch, type FetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function CachedPage({slug, perspective}: {slug: string} & FetchOptions) {
  'use cache'

  const query = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({query, params: {slug}, perspective})
  return <article>{/* render data */}</article>
}
```

## Metadata route variant

For `generateMetadata`, use `sanityFetchMetadata` with normalized perspective:

```ts
import {normalizePerspective, sanityFetchMetadata} from '@/sanity/lib/live'

export async function generateMetadata({params}: PageProps<'/[perspective]/[slug]'>) {
  const {perspective, slug} = await params
  const {data} = await sanityFetchMetadata({
    query: metadataQuery,
    params: {slug},
    perspective: normalizePerspective(perspective),
  })
  return {title: data?.title}
}
```

## Notes

- Do not add `'use cache'` to the top-level page/layout function.
- Do not read cookies directly in route files for perspective resolution; use the `[perspective]` param supplied by `proxy.ts`.
- If a route has dynamic slug params, keep `generateStaticParams` present and non-empty with Cache Components enabled.
