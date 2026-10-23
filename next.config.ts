import {withGroqFiles} from '@sanity-labs/groq-content-mapper/next'
import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const config: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {default: sanity},
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
    // Opt-in for local/CI production builds measured by `instant()`. Never set
    // EXPOSE_TESTING_API in real production.
    exposeTestingApiInProductionBuild: process.env.EXPOSE_TESTING_API === '1',
    // Turbopack minifies CSS with Lightning CSS against browserslist defaults
    // that still down-transpile `light-dark()` into `--lightningcss-light` /
    // `--lightningcss-dark` toggled only by `prefers-color-scheme`. Studio
    // theme colors from `@sanity/ui` v5 then follow the OS instead of
    // `color-scheme` when the two disagree. Exclude the polyfill — same as
    // Tailwind and sanity#14704 — rather than raising CSS targets (that would
    // change other lowering). See https://github.com/parcel-bundler/lightningcss/issues/873
    lightningCssFeatures: {
      exclude: ['light-dark'],
    },
  },
  images: {
    remotePatterns: [{hostname: 'cdn.sanity.io'}],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
}

// Turbopack delivers `import q from './x.groq' with {type: 'text'}` on its own; the wrapper
// re-runs the production type check with `--runExternalCode` so the `.groq` content mapper
// in tsconfig.json can type those imports (Next's own check runs `tsc` without that flag).
export default withGroqFiles(config)
