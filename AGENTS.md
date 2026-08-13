<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a personal-website starter: a Next.js 16 app (App Router, Cache Components + Turbopack) whose content lives in Sanity, with a Sanity Studio mounted at `/studio`. Standard scripts live in `package.json`; CI (`.github/workflows/ci.yml`) runs `npm run type-check`, `npm run lint`, a production build with `EXPOSE_TESTING_API=1`, and `npm run test:e2e`. CI reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` from Actions variables and `SANITY_API_READ_TOKEN` from secrets. Optional: `SANITY_API_WRITE_TOKEN` (draft-mode e2e). Do not set `EXPOSE_TESTING_API` on Vercel.

- Environment variables: the app requires `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` (`sanity/lib/token.ts` throws if the read token is missing); `SANITY_API_WRITE_TOKEN` is optional. In Cursor Cloud these are provided as Cloud Agent secrets and injected as environment variables (verified: the app boots from them with no `.env.local` present). They point at a dedicated Sanity dev project. Injected env vars take precedence over any `.env.local`; for local work outside Cloud, copy `.env.local.example` to `.env.local` and fill values from https://manage.sanity.io.
- Running the app: `npm run dev` (site at http://localhost:3000, Studio at http://localhost:3000/studio). Sanity typegen runs once at startup so `sanityFetch` query result typings are current; after editing schemas or GROQ queries, re-run `npm run typegen` manually to refresh them (no watcher yet). To skip typegen entirely, run `npx next dev --turbopack` directly.
- Logging into the Studio non-interactively: an Editor-role Sanity robot token is provided as the `STUDIO_AUTH_TOKEN` secret. Build a login URL and open it in the browser — the Studio consumes the token from the URL hash and authenticates automatically (no OAuth provider screen), verified working. Generate the URL with: `node -e "console.log('http://localhost:3000/studio#token=' + encodeURIComponent(process.env.STUDIO_AUTH_TOKEN))"`.
- Testing live updates: use the Presentation tool at `/studio/presentation/` and make draft edits — when SanityLive is working, draft changes show up live in the preview iframe (if they never appear at all, SanityLive is broken). Switch the perspective selector on that screen to `published` to verify that publishing documents also surfaces them.
- The `<!-- BEGIN:nextjs-agent-rules -->` block above is written/re-added by `next dev` (`node_modules/next/dist/server/lib/generate-agent-files.js`); committing it alongside your work keeps the tree clean.
