import {syncTagInvalidateEventHandler} from '@sanity/functions'

/**
 * Forwards invalidated sync tags to the Next.js app's `/api/revalidate` route, then tells Sanity
 * it's done so the live event is released to `<SanityLive waitFor="function">` clients with the
 * cache already expired. `REVALIDATE_URL` and `SANITY_REVALIDATE_SECRET` are set by `sanity.blueprint.ts`.
 */
export const handler = syncTagInvalidateEventHandler(async ({event, done}) => {
  const {syncTags} = event.data

  try {
    await revalidate(syncTags)
  } catch (error) {
    console.error('Failed to revalidate the Next.js cache, releasing the live event anyway', error)
  }

  // Until `done` runs, Sanity holds the event back from every `waitFor=function` client.
  const response = await done(syncTags)
  if (!response.ok) {
    console.error('Sanity invalidation done endpoint responded with HTTP', response.status)
  }
})

async function revalidate(syncTags: string[]) {
  const url = process.env.REVALIDATE_URL
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!url || !secret) {
    throw new Error('REVALIDATE_URL and SANITY_REVALIDATE_SECRET must be set on the function')
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${secret}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({syncTags}),
  })
  if (!response.ok) {
    throw new Error(`${url} responded with HTTP ${response.status}: ${await response.text()}`)
  }
  console.log(`Revalidated ${syncTags.length} sync tags:`, syncTags.join(', '))
}
