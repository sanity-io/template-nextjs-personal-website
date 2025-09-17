import type {NextRequest} from 'next/server'
import {unstable_expireTag as expireTag} from 'next/cache'

export async function POST(request: NextRequest) {
  const tags = request.nextUrl.searchParams.getAll('tag')

  expireTag(...tags)
  console.log(`<SanityLive /> expired tags: ${tags.join(', ')}`)

  return Response.json(tags)
}
