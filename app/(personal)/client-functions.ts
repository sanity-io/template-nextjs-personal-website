'use client'

import {type SyncTag} from '@sanity/client'
import {isCorsOriginError} from 'next-sanity/live'
import {toast} from 'sonner'

export function handleError(error: unknown) {
  if (isCorsOriginError(error)) {
    const {addOriginUrl} = error
    toast.error(`Sanity Live couldn't connect`, {
      description: `Your origin is blocked by CORS policy`,
      duration: Infinity,
      action: addOriginUrl
        ? {
            label: 'Manage',
            onClick: () => window.open(addOriginUrl.toString(), '_blank'),
          }
        : undefined,
    })
  } else if (error instanceof Error) {
    console.error(error)
    toast.error(error.name, {description: error.message, duration: Infinity})
  } else {
    console.error(error)
    toast.error('Unknown error', {
      description: 'Check the console for more details',
      duration: Infinity,
    })
  }
}

export async function revalidateSyncTags(tags: SyncTag[]): Promise<'refresh'> {
  const url = new URL('/api/revalidate-sync-tags', window.location.origin)
  for (const tag of tags) {
    url.searchParams.append('tag', tag)
  }
  const response = await fetch(url, {method: 'POST'})
  if (!response.ok) {
    throw new Error('Failed to revalidate sync tags')
  }
  const json = await response.json()
  console.log('revalidated sync tags', tags, json)
  return 'refresh'
}
