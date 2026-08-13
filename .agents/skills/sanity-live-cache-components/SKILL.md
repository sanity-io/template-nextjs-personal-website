---
name: sanity-live-cache-components
description: Integrates Sanity Live with Next.js Cache Components in next-sanity v13+ apps. Sets up a draft-aware sanityFetch wrapper, [perspective] route rewriting via proxy.ts, route-level 'use cache' leaves, <SanityLive>, Visual Editing, and Presentation Tool handling. Sequences with the official Next.js skills (next-cache-components-adoption, next-cache-components-optimizer, next-partial-prefetching-adoption, next-dev-loop). Use when configuring or migrating a Next.js app to cacheComponents with Sanity, when adding sanityFetch, when wiring <SanityLive>/<VisualEditing>, or when refactoring perspective handling.
---

# Sanity Live + Cache Components

Wires `next-sanity` into a Next.js 16+ app with `cacheComponents: true`. Data is fetched with a draft-aware `sanityFetch` wrapper from `sanity/lib/live.ts`, while route components provide `'use cache'` boundaries at cached leaves. A root-level `proxy.ts` rewrites requests into a `/<perspective>/...` route tree, and `<SanityLive>` in the website layout revalidates cached content over an EventSource connection to Sanity Content Lake. Visual Editing and Presentation Tool are supported when draft mode is enabled.

Read the relevant guide in `node_modules/next/dist/docs/` (when available) before writing code. If a guide conflicts with this skill, follow this skill.

This skill assumes familiarity with Cache Components fundamentals — `'use cache'`, `cacheLife`, `cacheTag`, and the cookies/headers/params rule — covered by the [Cache Components guide](https://nextjs.org/docs/app/getting-started/cache-components) (bundled offline under `node_modules/next/dist/docs/`). The only Sanity-relevant exception: `await draftMode()` is allowed inside `'use cache'` (Next.js bypasses caching when draft mode is enabled — see [the `use cache` reference](https://nextjs.org/docs/app/api-reference/directives/use-cache#draft-mode)).

## Where this skill fits

Next.js ships official skills for the framework-generic workflows (see [Setting up your project for AI coding agents](https://nextjs.org/docs/app/guides/ai-agents)). This skill covers only the Sanity surface and defers everything else to them. Install them from the Next.js repository:

```bash
npx skills add vercel/next.js --skill next-dev-loop
npx skills add vercel/next.js --skill next-cache-components-adoption
npx skills add vercel/next.js --skill next-cache-components-optimizer
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

When their rules apply — blocking-route triage, `<Suspense>` placement, loading-UI reuse, `instant()` regression tests, link prefetch audits — follow them; don't re-derive that guidance from here.

Recommended sequence when migrating an app:

1. **[`next-cache-components-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-adoption)** — enables `cacheComponents: true` and works the app to a passing build, route by route. Tell it to leave the Sanity surface to this skill:

   > Adopt Cache Components in this project using the next-cache-components-adoption Skill. Defer draft mode handling and every `sanityFetch` / `<SanityLive>` call site to the sanity-live-cache-components skill: leave those routes opted out (`export const instant = false`) rather than refactoring the Sanity data fetching.

2. **This skill** — set up `defineLive` and the `live.ts` helpers, refactor `sanityFetch` call sites to pass route-derived `perspective`, wire `<SanityLive>`/`<VisualEditing>` and draft mode, add `proxy.ts` perspective rewriting, then remove the remaining opt-outs on the deferred Sanity routes. Use the adoption skill's per-route loop and success bar for that removal (dev overlay clean, browser-verified, `next build` passes) — this skill supplies the Sanity-specific fixes, the loop mechanics are the adoption skill's.

3. **Either or both, optional follow-ups:**
   - [`next-cache-components-optimizer`](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-optimizer) — grows a route's static shell and guards it with an `@next/playwright` `instant()` test. Prompt: _"Make the navigation to `/<route>` instant using the next-cache-components-optimizer Skill."_
   - [`next-partial-prefetching-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-partial-prefetching-adoption) — enables `partialPrefetching` and audits `<Link prefetch={true}>` usage. Prompt: _"Adopt Partial Prefetching in this project using the next-partial-prefetching-adoption Skill."_

Nothing in this skill blocks either one: the [three-layer pattern](#5-apply-the-three-layer-pattern-to-pages-and-layouts) keeps routes fully prerenderable in the published branch, which is exactly the shell those skills grow and prefetch. Sanity content fetched in route-level `'use cache'` leaves also satisfies the "cached URL-dependent content" requirement for [runtime prefetching](https://nextjs.org/docs/app/guides/runtime-prefetching).

Throughout all of it, verify changes at runtime with [`next-dev-loop`](https://github.com/vercel/next.js/tree/canary/skills/next-dev-loop) — a passing compile doesn't prove what ended up in the static shell versus streamed.

## Prerequisites

- Next.js 16.3+ installed in the project (check `package.json` or run `pnpm list next` / `npm ls next` — don't use `pnpm view next version`, that reports the registry's latest, not what's installed). `next-sanity` v13 supports Next.js 16, but the official skills this skill sequences with require 16.3+.
- `AGENTS.md` exists. On Next.js 16.3+, `next dev` auto-generates it (pointing agents at the bundled docs); on older versions [follow the guide](https://nextjs.org/docs/app/guides/ai-agents#existing-projects).
- These environment variables are set:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_READ_TOKEN`
- Embedded Sanity Studio configuration (`sanity.config.ts`, `sanity.cli.ts`, anything under `sanity/`) needs no changes — this skill only touches the Next.js app surface.

## Reference files

| File                                                                 | When to read                                                                                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [reference/live-helpers.md](reference/live-helpers.md)               | Full `client.ts` / `live.ts`, draft-aware `sanityFetch`, and `sanityFetch*` helper details                                     |
| [reference/three-layer-pattern.md](reference/three-layer-pattern.md) | The Page → Dynamic → Cached pattern for `page.tsx`, including the `searchParams` variant                                       |
| [reference/layouts.md](reference/layouts.md)                         | Non-blocking data fetching inside `layout.tsx`                                                                                 |
| [reference/dynamic-segments.md](reference/dynamic-segments.md)       | High-performance `[slug]` routes: `loading.tsx` + partial `generateStaticParams`, or non-blocking dynamic `params` in a layout |

---

## 1. Install `next-sanity@^13`

```bash
npm install next-sanity@^13 --save-exact
```

### Migrating an existing Sanity Live setup

If the app is already using `defineLive`, this skill is a refactor, not a rewrite. The 5-step sequence below still applies, but watch for these specific differences:

- **Don't overwrite `client.ts` or `live.ts`** if they exist. Append missing options. Preserve any existing `token` and `stega.*` settings — see [reference/live-helpers.md](reference/live-helpers.md).
- **Search the codebase for hardcoded `stega: false` in normal page content fetches** and remove it so draft mode can enable Visual Editing overlays.
- **Search for `sanityFetch` calls inside `generateStaticParams`** → swap for `sanityFetchStaticParams`.
- **Search for `sanityFetch` calls inside `generateMetadata` / `sitemap.ts` / `opengraph-image.tsx` / etc.** → swap for `sanityFetchMetadata`.
- **Search for `sanityInternalFetch` callsites outside `live.ts`** → use `sanityFetch` (or one of the specialized helper wrappers) instead.
- **Verify there is exactly one `<SanityLive>` and one `<VisualEditing>` in the tree.** Multiple renders are undefined behavior.

The "Anti-patterns to grep for" section at the bottom of this file lists the search patterns.

---

## 2. Configure `next.config.ts`

Enable `cacheComponents` and set `cacheLife.default` to `sanity` so default revalidation is 1 year (instead of 15 minutes). `sanityFetch` is optimized for on-demand revalidation and doesn't need time-based revalidation.

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

## 3. Configure `defineLive` and export helpers

Create `src/sanity/lib/client.ts` and `src/sanity/lib/live.ts`. The core of `live.ts`:

```ts
// src/sanity/lib/live.ts (excerpt)
export const {SanityLive, sanityFetch: sanityInternalFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

function withDraftMode(fn: typeof sanityInternalFetch) {
  return async (options) => {
    const {isEnabled: isDraftMode} = await draftMode()

    return fn({
      ...options,
      perspective: isDraftMode ? options.perspective : 'published',
      stega: isDraftMode,
    })
  }
}

export const sanityFetch = withDraftMode(sanityInternalFetch)
```

Full file contents (including `client.ts`, `normalizePerspective`, `sanityFetchMetadata`, and `sanityFetchStaticParams`) and per-helper guidance: [reference/live-helpers.md](reference/live-helpers.md).

The helpers exported from `live.ts`:

| Helper                    | Used in                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `sanityFetch`             | Main fetch helper for server components; draft mode controls `stega` and published fallback    |
| `sanityFetchMetadata`     | `generateMetadata`, `generateViewport`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, etc. |
| `sanityFetchStaticParams` | `generateStaticParams` only                                                                    |
| `normalizePerspective`    | Converts route segment values to `LivePerspective` for typed fetch calls                       |
| `FetchOptions`            | Shared type for cached leaf component props (`perspective`)                                    |
| `SanityLive`              | Rendered once in the website layout                                                            |

## 3.5. Add perspective route rewriting via `proxy.ts`

This implementation uses a `proxy.ts` file at the repository root to rewrite incoming website requests into `/<perspective>/...`, where perspective is resolved from Sanity cookies.

```ts
// proxy.ts (excerpt)
export async function proxy(request: NextRequest) {
  const perspective = await resolvePerspectiveFromCookies({cookies: await cookies()})
  const nextUrl = new URL(
    `/${perspective}${request.nextUrl.pathname}${request.nextUrl.search}`,
    request.url,
  )
  return NextResponse.rewrite(nextUrl, {request})
}
```

Use a matcher that excludes Next internals, API routes, Studio, and static assets.

---

## 4. Render `<SanityLive>` in a root layout

`<SanityLive>` and `<VisualEditing>` both belong in a `layout.tsx`, never a `page.tsx`. Both must be rendered at most once across the whole tree — duplicate renders are undefined behavior.

- `includeDrafts` is **required** when `defineLive` is configured with `strict: true` (the recommended setup). TypeScript will surface the error if it's missing; pass `includeDrafts={isDraftMode}` so live revalidation includes drafts only in draft mode.
- Preserve any existing optional callback props on `<SanityLive>` when migrating: `onError`, `onWelcome`, `onReconnect`. They are commonly wired to a toast/notification helper and silently dropping them regresses UX.

In this implementation, the website layout is intentionally **not** `async`. Keep the layout sync and resolve draft mode with `draftMode().then(...)` where you render `<SanityLive>` / `<VisualEditing>`.

```tsx
// src/app/(website)/[perspective]/layout.tsx (excerpt)
import {SanityLive} from '@/sanity/lib/live'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'

export default function PersonalLayout({params, children}: LayoutProps<'/[perspective]'>) {
  return (
    <>
      {/* ...website shell... */}
      {children}

      {draftMode().then(({isEnabled: isDraftMode}) => (
        <>
          <SanityLive includeDrafts={isDraftMode} />
          {isDraftMode && <VisualEditing />}
        </>
      ))}
    </>
  )
}
```

### With an embedded Sanity Studio

If a route mounts `NextStudio` from `next-sanity/studio` (e.g. `app/studio/[[...index]]/page.tsx`), `<SanityLive>` must live in a layout the embedded studio doesn't share. Use [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups): put `<SanityLive>` in `src/app/(website)/layout.tsx` and keep the rest of the app under `src/app/(website)`.

---

## 5. Apply the three-layer pattern to pages and layouts

Every route that should be statically prerendered uses the same shape:

```text
Page/Layout (Layer 1: route shell)
  └── <Suspense fallback={...}>
        {params.then(({perspective, ...rest}) => (
          <CachedX perspective={normalizePerspective(perspective)} {...rest} />
        ))}

Cached leaf (Layer 2)
  ├── 'use cache'
  └── await sanityFetch({ query, perspective })
```

**Critical rules**:

- The top-level `Page` / `Layout` must **not** have `'use cache'`. It resolves `params` and passes a normalized `perspective` into a cached child.
- Add `'use cache'` to the leaf component that calls `sanityFetch`. This caches rendered JSX for the leaf while `sanityFetch` handles Sanity live invalidation tags internally.
- `sanityFetch` automatically sets `stega` from `draftMode()` and forces `published` perspective outside draft mode.
- Use `<Suspense>` around `params.then(...)` wrappers so dynamic param resolution does not block the outer shell.

Pick the right reference for the file you're editing:

- **`page.tsx`** with static or `generateStaticParams`-backed params → [reference/three-layer-pattern.md](reference/three-layer-pattern.md).
- **`page.tsx`** that uses `searchParams` or other dynamic APIs → the `searchParams` variant in [reference/three-layer-pattern.md](reference/three-layer-pattern.md).
- **`layout.tsx`** that fetches its own data → [reference/layouts.md](reference/layouts.md).
- **Dynamic `[slug]` route** that needs the `loading.tsx` + partial `generateStaticParams` optimization, or a layout that needs non-blocking `params` → [reference/dynamic-segments.md](reference/dynamic-segments.md).

---

## Verifying the Sanity surface

Use [`next-dev-loop`](https://github.com/vercel/next.js/tree/canary/skills/next-dev-loop) after each refactor; the loop mechanics and success bar live in the official skills. The Sanity-specific things to confirm:

- Published branch: the route prerenders fully (`◐` or `○` in the build's route table) and content renders without a `<Suspense>` fallback flash.
- Draft mode: enabling it streams draft content, `<VisualEditing>` overlays appear, and switching perspectives in Presentation Tool changes the rendered content.
- Live updates: editing published content in the Studio revalidates the route (via `<SanityLive>`) without a rebuild.

## Anti-patterns to grep for

When auditing an app, search for these and refactor:

- Hardcoded `stega: false` in route content fetches that should support visual editing previews.
- `sanityInternalFetch(` used directly in routes/components (except the helper wrappers in `live.ts`).
- `sanityFetch(` inside `generateStaticParams` instead of `sanityFetchStaticParams`.
- `sanityFetch(` inside `generateMetadata` / `generateViewport` / `sitemap.ts` / `robots.ts` / `opengraph-image.tsx` etc. instead of `sanityFetchMetadata`.
- `sanityFetch(` in a component without its own `'use cache'` directive when that component is expected to be cacheable.
- More than one `<SanityLive>` or `<VisualEditing>` rendered in the tree → consolidate to a single render in the website layout.
- Missing `proxy.ts`, or matcher patterns that accidentally rewrite `/studio`, `/api`, or static asset requests.
