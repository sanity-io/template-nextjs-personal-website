'use cache'

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio v3.
 * All routes under /studio will be handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import config from '@/sanity.config'
import {NextStudio} from 'next-sanity/studio'
import {unstable_cacheLife as cacheLife} from 'next/cache'

export default async function StudioPage() {
  cacheLife('max')
  return (
    <>
      <meta name="referrer" content="same-origin" />
      <meta name="robots" content="noindex" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <NextStudio config={config} />
    </>
  )
}
