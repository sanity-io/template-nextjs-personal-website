import {syncTagInvalidateEventHandler} from '@sanity/functions'

/**
 * Sync tag invalidate function for `<SanityLive waitFor="function">`.
 *
 * Sanity invokes this function when published content changes, before the corresponding live
 * event is released to browsers connected with `waitFor=function`. It forwards the invalidated
 * sync tags to the Next.js app's `/api/revalidate` route handler, which expires the matching
 * `sanity:<tag>` cache tags, and then calls `done()` so Sanity releases the event. By the time
 * the browser calls `router.refresh()`, the cache is already invalidated.
 *
 * Configure the deployed function with:
 *   npx sanity functions env add invalidate-sync-tags REVALIDATE_URL https://<your-site>/api/revalidate
 *   npx sanity functions env add invalidate-sync-tags SANITY_REVALIDATE_SECRET <same value as the Next.js app>
 */
export const handler = syncTagInvalidateEventHandler(async ({event, done}) => {
  const {syncTags} = event.data

  try {
    await revalidate(syncTags)
  } catch (error) {
    console.error('Failed to revalidate the Next.js cache, releasing the live event anyway', error)
  } finally {
    // `done` must always run: until it does, Sanity holds the live event back from every
    // `waitFor=function` client, and content would silently stop updating in the browser.
    try {
      const response = await done(syncTags)
      if (!response.ok) {
        console.error('Sanity invalidation done endpoint responded with HTTP', response.status)
      }
    } catch (error) {
      console.error('Error invoking Sanity invalidation done endpoint', error)
    }
  }
})

async function revalidate(syncTags: string[]): Promise<void> {
  const url = process.env.REVALIDATE_URL
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!url) {
    throw new Error('REVALIDATE_URL is not set')
  }
  if (!secret) {
    throw new Error('SANITY_REVALIDATE_SECRET is not set')
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
