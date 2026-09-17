import {documentEventHandler} from '@sanity/functions'

import {agentClient, datasetClient, dryRun, isRevisionConflict, schemaId} from '../lib/agent'
import type {AutoTagPayload} from '../lib/events'
import {normalizeTags} from './tags'

const TAG_INSTRUCTION =
  "Add three to five tags for this project based on $title and $description. Reuse tags from $existing when they fit, otherwise create new ones. Tags are lowercase, one word or a hyphenated phrase, no '#'."

const EXISTING_TAGS_QUERY = 'array::compact(array::unique(*[_type == "project"].tags[]))'

export const handler = documentEventHandler<AutoTagPayload>(async ({context, event}) => {
  const {_id, _rev} = event.data

  const result = await agentClient(context).agent.action.generate<{tags?: unknown}>({
    schemaId,
    documentId: _id,
    noWrite: true,
    instruction: TAG_INSTRUCTION,
    instructionParams: {
      title: {type: 'field', path: 'title'},
      description: {type: 'field', path: 'description'},
      existing: {type: 'groq', query: EXISTING_TAGS_QUERY},
    },
    target: {path: 'tags', operation: 'set'},
  })

  const tags = normalizeTags(result.tags)
  if (tags.length === 0) {
    console.log(`auto-tag ${_id}: skipped, Generate returned no usable tags`)
    return
  }

  const dry = dryRun(context)
  const client = datasetClient(context)
  try {
    await client.patch(_id).ifRevisionId(_rev).set({tags}).commit({dryRun: dry})
  } catch (error) {
    if (!isRevisionConflict(error)) throw error
    // describe-images writes to the same document on this publish, so losing the race is normal.
    const fresh = await client.fetch<{_rev: string; tags: string[] | null} | null>(
      '*[_id == $id][0]{_rev, tags}',
      {id: _id},
    )
    if (!fresh || fresh.tags?.length) {
      console.log(`auto-tag ${_id}: skipped, the document changed before the tags were written`)
      return
    }
    await client.patch(_id).ifRevisionId(fresh._rev).set({tags}).commit({dryRun: dry})
  }
  console.log(`auto-tag ${_id}: set tags ${tags.join(', ')}${dry ? ' (dry run)' : ''}`)
})
