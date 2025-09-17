import type {NextRequest} from 'next/server'
import {unstable_expireTag as expireTag} from 'next/cache'
import {draftMode} from 'next/headers'

export async function POST(request: NextRequest) {
  const {isEnabled: isDraftModeEnabled} = await draftMode()
  const tags = request.nextUrl.searchParams
    .getAll('tag')
    .map((tag) => (isDraftModeEnabled ? `drafts:${tag}` : `sanity:${tag}`))

  // If in draft mode all tags must be prefixed with 'draft:'
  // if ((await draftMode()).isEnabled) {
  //   if (!tags.every((tag) => tag.startsWith('drafts:'))) {
  //     return Response.json(
  //       {error: 'All tags must be prefixed with "drafts:" in draft mode'},
  //       {status: 400},
  //     )
  //   }
  // } else if (!tags.every((tag) => tag.startsWith('sanity:'))) {
  //   return Response.json(
  //     {error: 'All tags must be prefixed with "sanity:" in production mode'},
  //     {status: 400},
  //   )
  // }

  expireTag(...tags)
  console.log(`<SanityLive /> expired tags: ${tags.join(', ')}`)

  return Response.json(tags)
}
