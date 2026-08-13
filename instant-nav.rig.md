# instant-nav rig: sanity-template-template-nextjs-personal-website

- BUILD: `EXPOSE_TESTING_API=1 npm run build` then `npx next start --port 3000`. Never measure on `next dev`.
- EXPOSE: `experimental.exposeTestingApiInProductionBuild` is `true` when `EXPOSE_TESTING_API=1` (set at build time). Do not set this in real production.
- RUN: `npx playwright test` (script: `npm run test:e2e`) against `BASE_URL` (default `http://localhost:3000`). Locally Playwright reuses an already-running `next start` on PORT; in CI it starts `npx next start` itself (`webServer`).
- TEST USER: anonymous public visitor. The site has no auth. Required CMS data: published `project-alpha` and `project-bravo` documents, with `project-bravo` in Settings → Menu Items so the navbar Link is present on `/projects/project-alpha`.
- DRIFT: no feature flags, plans, roles, or login. Failures come from missing Sanity documents/menu items, an unpublished draft, or a build that was not produced with `EXPOSE_TESTING_API=1`.
- LOOP: stop whatever owns port 3000 → `EXPOSE_TESTING_API=1 npm run build` → `npx next start --port 3000` → `npx playwright test` → read the failure → fix → rebuild. Fully agent-drivable. Fail the loop on `EADDRINUSE`. Confirm the newly started `next start` process owns port 3000 before running tests.
- LIVENESS: n/a (local `build && start`; the artifact is the one just built).
- WALLS:
  - `npm run build` needs `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` (`generateStaticParams` fetches slugs from Sanity).
  - Chromium must be installed once: `npx playwright install chromium`.
  - GitHub CI (`.github/workflows/ci.yml`) runs type-check, lint, `EXPOSE_TESTING_API=1 npm run build`, and `npm run test:e2e`. Required Actions secrets: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`. Optional: `SANITY_API_WRITE_TOKEN` (draft-mode e2e). Never set `EXPOSE_TESTING_API` on Vercel.
