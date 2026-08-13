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

export default config
