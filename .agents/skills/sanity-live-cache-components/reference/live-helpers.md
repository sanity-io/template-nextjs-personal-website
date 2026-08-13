# Live helpers: `client.ts` and `live.ts`

This project uses a draft-aware `sanityFetch` wrapper and route-level `'use cache'` leaves. It does not use a shared `cachedSanity` helper.

## Contents

- [`client.ts`](#clientts)
- [`live.ts`](#livets)
- [`sanityFetch`](#sanityfetch)
- [`sanityFetchMetadata`](#sanityfetchmetadata)
- [`sanityFetchStaticParams`](#sanityfetchstaticparams)
- [`normalizePerspective`](#normalizeperspective)
- [Anti-patterns to grep for](#anti-patterns-to-grep-for)

## `client.ts`

Keep the existing `sanity/lib/client.ts` shape. Do not rewrite env access patterns if the project already centralizes them.

## `live.ts`

The implementation shape in this repository:

```ts
// sanity/lib/live.ts (excerpt)
import {type QueryParams} from 'next-sanity'
import {defineLive, type LivePerspective} from 'next-sanity/live'
import {draftMode} from 'next/headers'
import {client} from './client'
import {token} from './token'

export const {SanityLive, sanityFetch: sanityInternalFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

type WithDraftModeOptions<QueryString extends string> = Omit<
  Parameters<typeof sanityInternalFetch<QueryString>>[0],
  'perspective' | 'stega'
> &
  Partial<Pick<Parameters<typeof sanityInternalFetch<QueryString>>[0], 'perspective'>>

function withDraftMode(fn: typeof sanityInternalFetch) {
  return async <const QueryString extends string>(options: WithDraftModeOptions<QueryString>) => {
    const {isEnabled: isDraftMode} = await draftMode()

    return fn({
      ...options,
      perspective: isDraftMode ? options.perspective : 'published',
      stega: isDraftMode,
    } as Parameters<typeof sanityInternalFetch<QueryString>>[0])
  }
}

export const sanityFetch = withDraftMode(sanityInternalFetch)

export function normalizePerspective(perspective: string): LivePerspective {
  return (perspective as LivePerspective) ?? 'published'
}

export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString
  params?: QueryParams
}) {
  'use cache'
  const {data} = await sanityInternalFetch({query, params, perspective: 'published', stega: false})
  return {data}
}

export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString
  params?: QueryParams
  perspective: LivePerspective
}) {
  'use cache'
  const {data} = await sanityInternalFetch({query, params, perspective, stega: false})
  return {data}
}
```

## `sanityFetch`

Default content fetch helper for server components in this project.

- Always call it from a function/component with `'use cache'` if you want cacheable output.
- Pass `perspective` from route params after `normalizePerspective(...)`.
- Do not pass `stega`; it is controlled by `draftMode()` inside `withDraftMode`.

Pattern:

```tsx
import {normalizePerspective, sanityFetch, type FetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function CachedPage({perspective}: FetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "home"][0]`)
  const {data} = await sanityFetch({
    query: pageQuery,
    perspective: normalizePerspective(perspective),
  })
  return <section>{/* render data */}</section>
}
```

## `sanityFetchMetadata`

Use only in metadata contexts (`generateMetadata`, `generateViewport`, `sitemap.ts`, etc.).

- `stega` is always `false`.
- You still pass `perspective` from route params using `normalizePerspective`.

## `sanityFetchStaticParams`

Use only in `generateStaticParams`.

- Always published perspective.
- Always `stega: false`.

With Cache Components enabled, `generateStaticParams` must return at least one item. If your CMS can be empty, return a placeholder param.

## `normalizePerspective`

Converts the `[perspective]` segment string into `LivePerspective` for typed fetch calls.

This project uses `proxy.ts` to rewrite website routes to `/<perspective>/...`, so route files consume perspective from params instead of reading cookies directly.

## Anti-patterns to grep for

- `sanityInternalFetch(` outside `sanity/lib/live.ts`.
- `sanityFetch(` used in a component without `'use cache'` when the component is expected to be cacheable.
- `sanityFetch(` inside `generateStaticParams` (use `sanityFetchStaticParams`).
- `sanityFetch(` inside metadata functions/routes (use `sanityFetchMetadata`).
- Hardcoded `stega: false` in normal page/layout content fetches.
- More than one `<SanityLive>` or `<VisualEditing>` render in the website tree.
