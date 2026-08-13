# Non-blocking layout patterns

This project uses a non-async website layout and resolves dynamic bits with promises inside JSX.

## Rules

- Keep `app/(website)/[perspective]/layout.tsx` synchronous.
- Resolve route params inside `<Suspense>` via `params.then(...)`.
- Put `'use cache'` on data-fetching leaf components.
- Render `<SanityLive>` and `<VisualEditing>` once using `draftMode().then(...)`.

## Canonical pattern

```tsx
// app/(website)/[perspective]/layout.tsx (excerpt)
import {normalizePerspective, sanityFetch, SanityLive, type FetchOptions} from '@/sanity/lib/live'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

export default function PersonalLayout({params, children}: LayoutProps<'/[perspective]'>) {
  return (
    <>
      <Suspense fallback={<NavbarFallback />}>
        {params.then(({perspective}) => (
          <CachedNavbar perspective={normalizePerspective(perspective)} />
        ))}
      </Suspense>

      {children}

      <Suspense>
        {params.then(({perspective}) => (
          <CachedFooter perspective={normalizePerspective(perspective)} />
        ))}
      </Suspense>

      {draftMode().then(({isEnabled: isDraftMode}) => (
        <>
          <SanityLive includeDrafts={isDraftMode} />
          {isDraftMode && <VisualEditing />}
        </>
      ))}
    </>
  )
}

async function CachedNavbar({perspective}: FetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective})
  return <Navbar data={data} />
}

async function CachedFooter({perspective}: FetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective})
  return <Footer data={data} />
}
```

## Why this pattern

- `children` can stream independently from navbar/footer data.
- Perspective comes from `[perspective]` route params (rewritten by `proxy.ts`).
- Live invalidation works through `sanityFetch` + `<SanityLive>`.

## Anti-patterns

- Making the layout `async` just to `await draftMode()`.
- Reading cookies directly in layout files for perspective.
- Wrapping all `children` inside one cached data-fetching component.
- Rendering multiple `<SanityLive>` or `<VisualEditing>` instances.
