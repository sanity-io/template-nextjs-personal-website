# instant-nav rig: sanity-template-template-nextjs-personal-website

- BUILD: `EXPOSE_TESTING_API=1 npm run build` then `npx next start --port 3000`. Never measure on `next dev`.
- EXPOSE: `experimental.exposeTestingApiInProductionBuild` is `true` when `EXPOSE_TESTING_API=1` (set at build time). Do not set this in real production.
- RUN: `npx playwright test` (script: `npm run test:e2e`) against `BASE_URL` (default `http://localhost:3000`). Locally Playwright reuses an already-running `next start` on PORT; in CI it starts `npx next start` itself (`webServer`).
- TEST USER: anonymous public visitor. The site has no auth. Required CMS data: at least one published project in the homepage showcase (the e2e specs discover slugs from those links). Sibling navbar project links are used when present; otherwise the showcase cards drive navigation.
- DRIFT: no feature flags, plans, roles, or login. Failures come from an empty homepage showcase, or a build that was not produced with `EXPOSE_TESTING_API=1`.
- LOOP: stop whatever owns port 3000 → `EXPOSE_TESTING_API=1 npm run build` → `npx next start --port 3000` → `npx playwright test` → read the failure → fix → rebuild. Fully agent-drivable. Fail the loop on `EADDRINUSE`. Confirm the newly started `next start` process owns port 3000 before running tests.
- LIVENESS: n/a (local `build && start`; the artifact is the one just built).
- WALLS:
  - `npm run build` needs `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` (`generateStaticParams` fetches slugs from Sanity).
  - Chromium must be installed once: `npx playwright install chromium`.
  - GitHub CI (`.github/workflows/ci.yml`) runs type-check, lint, `EXPOSE_TESTING_API=1 npm run build`, and `npm run test:e2e`. Actions variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`. Secret: `SANITY_API_READ_TOKEN`. Optional secret: `SANITY_API_WRITE_TOKEN` (draft-mode e2e). Never set `EXPOSE_TESTING_API` on Vercel.
