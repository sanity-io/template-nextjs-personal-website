import {resolvePerspectiveFromCookies} from 'next-sanity/live'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function proxy(request: NextRequest) {
  const perspective = await resolvePerspectiveFromCookies({cookies: await cookies()})

  // rewrites the request to include the perspective
  const nextUrl = new URL(
    `/${perspective}${request.nextUrl.pathname}${request.nextUrl.search}`,
    request.url,
  )

  return NextResponse.rewrite(nextUrl, {request})
}

export const config = {
  // Run for website routes only; exclude Next.js internals, Vercel, API, Studio,
  // favicon, .well-known, robots.txt, sitemap.xml, and all static files (.js, .css, etc.)
  matcher: [
    '/((?!_next|_vercel|api|studio|favicon|\\.well-known|robots\\.|sitemap\\.|[^/]*\\.).*)?',
  ],
}
