import {ClientError} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

import {slugify, slugMaxLength} from '../../sanity/lib/slugify'
import {datasetClient, dryRun} from '../lib/agent'
import type {AutoSlugPayload} from '../lib/events'
import {SETTLE_MS, settled} from '../lib/settle'
import {SLUG_CANDIDATES, slugCandidates, uniqueSlug} from './unique'

/** Room for the `-20` suffix so every numbered candidate fits the schema's maximum length. */
const SUFFIX_ROOM = 3

export const handler = documentEventHandler<AutoSlugPayload>(async ({context, event}) => {
  const {_id, _type, _rev, title} = event.data
  const client = datasetClient(context)

  const fresh = await settled<{_rev: string}>(client, _id, '{_rev}', SETTLE_MS.title)
  if (fresh?._rev !== _rev) {
    console.log(`auto-slug ${_id}: skipped, the document changed or was deleted while settling`)
    return
  }

  const base = slugify(title, slugMaxLength[_type] - SUFFIX_ROOM)
  if (base === '') {
    console.log(`auto-slug ${_id}: skipped, "${title}" has no slug characters`)
    return
  }

  const publishedId = _id.replace(/^drafts\./, '')
  const taken = await client.fetch<string[]>(
    '*[_type == $type && slug.current in $candidates && !(_id in $ids)].slug.current',
    {
      type: _type,
      candidates: slugCandidates(base, SLUG_CANDIDATES),
      ids: [publishedId, `drafts.${publishedId}`],
    },
  )
  const current = uniqueSlug(base, taken)

  const dry = dryRun(context)
  try {
    await client
      .patch(_id)
      .ifRevisionId(fresh._rev)
      .setIfMissing({slug: {_type: 'slug', current}})
      .commit({dryRun: dry})
  } catch (error) {
    if (error instanceof ClientError && error.statusCode === 409) {
      console.log(`auto-slug ${_id}: skipped, the document changed before the slug was written`)
      return
    }
    throw error
  }
  console.log(`auto-slug ${_id}: set slug "${current}"${dry ? ' (dry run)' : ''}`)
})
