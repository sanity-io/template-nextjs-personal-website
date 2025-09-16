import type {NextConfig} from 'next'

const config: NextConfig = {
  experimental: {
    // Speeds up performance by automatically generating useMemo and useCallback in client components
    reactCompiler: true,
    // Required by `next-sanity/experimental/live`
    cacheComponents: true,
    cacheLife: {
      default: {
        // Sanity Live handles on-demand revalidation, so the default 15min time based revalidation is too short
        revalidate: 60 * 60 * 24 * 90, // 90 days
      },
    },
  },
  // Helps catch bugs
  reactStrictMode: true,
  images: {
    remotePatterns: [{hostname: 'cdn.sanity.io'}],
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === 'production',
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
