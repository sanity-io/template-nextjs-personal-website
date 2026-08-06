<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a personal-website starter: a Next.js 16 app (App Router, Cache Components + Turbopack) whose content lives in Sanity, with a Sanity Studio mounted at `/studio`. Standard scripts live in `package.json`; CI (`.github/workflows/ci.yml`) runs `npm run type-check` and `npm run lint`. There are no automated tests.

- Environment variables: the app requires `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` (`sanity/lib/token.ts` throws if the read token is missing). These are read from `.env.local` (gitignored; see `.env.local.example`). A `.env.local` pointing at a dedicated Sanity project (`jslcjxc0` / `production`) already exists on the VM; if it is ever missing, recreate it from `.env.local.example` with values from https://manage.sanity.io.
- Running the app: `npm run dev` fails on a clean checkout because `predev` runs `sanity schema extract`, which refuses to overwrite the committed `schema.json` (no `--force`). Run `npx next dev --turbopack` instead (the `schema.json`/`sanity.types.ts` artifacts are already committed and regenerate byte-identically), or `rm -f schema.json && npm run dev`. The site is at http://localhost:3000 and the Studio at http://localhost:3000/studio.
- Cache Components caching gotcha: pages use `'use cache'` and prerender a static shell. After publishing content, the server-rendered HTML can keep showing the previously cached (e.g. empty) state; restart the dev server (or `rm -rf .next`) to force a fresh render. In a real browser, the `<SanityLive>` client connection revalidates on content changes.
- The `<!-- BEGIN:nextjs-agent-rules -->` block above is written/re-added by `next dev` (`node_modules/next/dist/server/lib/generate-agent-files.js`); committing it alongside your work keeps the tree clean.
