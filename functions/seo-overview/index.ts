import {documentEventHandler} from '@sanity/functions'

import {portableTextToString} from '../../sanity/lib/portable-text'
import {agentClient, datasetClient, dryRun, isRevisionConflict, schemaId} from '../lib/agent'
import type {SeoOverviewPayload, SlugDocumentType} from '../lib/events'
import {SETTLE_MS, settled} from '../lib/settle'

const OVERVIEW_INSTRUCTION =
  'Write the meta description for this page in one plain sentence of at most 155 characters, based on $title and $body. No markdown, no quotes.'

/** The same limit the schema enforces on `overview` with `maxPortableTextLength`. */
const OVERVIEW_MAX_LENGTH = 155

function bodyPath(type: SlugDocumentType): 'description' | 'body' {
  switch (type) {
    case 'project':
      return 'description'
    case 'page':
      return 'body'
    default: {
      const unhandled: never = type
      throw new Error(`Unhandled document type ${String(unhandled)}`)
    }
  }
}

export const handler = documentEventHandler<SeoOverviewPayload>(async ({context, event}) => {
  const {_id, _type, _rev} = event.data
  const client = datasetClient(context)

  const fresh = await settled<{_rev: string}>(client, _id, '{_rev}', SETTLE_MS.body)
  if (fresh?._rev !== _rev) {
    console.log(`seo-overview ${_id}: skipped, the document changed or was deleted while settling`)
    return
  }

  const result = await agentClient(context).agent.action.generate<{overview?: unknown}>({
    schemaId,
    documentId: _id,
    noWrite: true,
    instruction: OVERVIEW_INSTRUCTION,
    instructionParams: {
      title: {type: 'field', path: 'title'},
      body: {type: 'field', path: bodyPath(_type)},
    },
    target: {path: 'overview', operation: 'set'},
  })

  const text = portableTextToString(result.overview)
  if (text.length === 0 || text.length > OVERVIEW_MAX_LENGTH) {
    console.log(`seo-overview ${_id}: skipped, Generate returned ${text.length} characters`)
    return
  }

  const dry = dryRun(context)
  try {
    await client
      .patch(_id)
      .ifRevisionId(fresh._rev)
      .set({overview: result.overview})
      .commit({dryRun: dry})
  } catch (error) {
    if (!isRevisionConflict(error)) throw error
    console.log(
      `seo-overview ${_id}: skipped, the document changed before the overview was written`,
    )
    return
  }
  console.log(
    `seo-overview ${_id}: set a ${text.length}-character overview${dry ? ' (dry run)' : ''}`,
  )
})
