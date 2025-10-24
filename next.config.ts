import {NextConfig} from 'next'

const config: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  images: {remotePatterns: [{hostname: 'cdn.sanity.io'}]},
  // Set this to false if you want production builds to abort if there's type errors
  typescript: {ignoreBuildErrors: process.env.VERCEL_ENV === 'production'},
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
}

export default config
