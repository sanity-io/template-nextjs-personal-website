import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {connection} from 'next/server'

import {client} from '@/sanity/lib/client'
import {getViewerToken} from '@/sanity/lib/token'

export async function GET(request: Request) {
  await connection()
  const {GET: enableDraftMode} = defineEnableDraftMode({
    client: client.withConfig({token: await getViewerToken()}),
  })
  return enableDraftMode(request)
}
