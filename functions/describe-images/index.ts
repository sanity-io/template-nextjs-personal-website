import {documentEventHandler} from '@sanity/functions'

import {agentClient, datasetClient, dryRun, schemaId} from '../lib/agent'
import type {DescribeImagesPayload} from '../lib/events'
import {readAlts} from './alts'

const ALT_INSTRUCTION =
  "Write alt text for a screen reader user. One sentence, at most 125 characters. Name the subject and the setting. Do not start with 'Image of' or 'Picture of'. The image illustrates the project or page titled $title."

/**
 * Transform only describes the images (`noWrite`); this function owns the write and uses
 * `setIfMissing` so alt text an editor typed while Transform ran is never overwritten. A failed
 * Transform leaves alt empty until the next asset change, which is the trigger anyway.
 */
export const handler = documentEventHandler<DescribeImagesPayload>(async ({context, event}) => {
  const {_id, targets} = event.data

  const described = await agentClient(context).agent.action.transform({
    schemaId,
    documentId: _id,
    noWrite: true,
    instruction: ALT_INSTRUCTION,
    instructionParams: {title: {type: 'field', path: 'title'}},
    target: targets.map((path) => ({path, operation: {type: 'image-description'}})),
  })

  const alts = readAlts(described, targets)
  const paths = Object.keys(alts)
  const undescribed = targets.length - paths.length
  if (paths.length === 0) {
    console.log(`describe-images ${_id}: Transform described none of ${targets.length} images`)
    return
  }

  const dry = dryRun(context)
  await datasetClient(context).patch(_id).setIfMissing(alts).commit({dryRun: dry})
  console.log(
    `describe-images ${_id}: ${dry ? 'dry run, would setIfMissing' : 'setIfMissing'} ${paths.join(', ')}` +
      (undescribed > 0 ? `; no text for ${undescribed} more` : ''),
  )
})
