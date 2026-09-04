import {documentEventHandler} from '@sanity/functions'

import {agentClient, datasetClient, dryRun, isDraftId, schemaId} from '../lib/agent'
import type {GenerateImagesPayload} from '../lib/events'
import {SETTLE_MS, settled} from '../lib/settle'
import {imageInstruction, imageInstructionParams} from './instruction'
import {
  imageFieldsProjection,
  planImageJobs,
  siteContext,
  siteContextQuery,
  withoutDraftJobs,
  type ImageFields,
  type SiteDocument,
} from './plan'

/**
 * Generate uploads the finished image to the document itself about 25 seconds after this returns,
 * and that asset change triggers describe-images for the alt text. A second prompt edit or a manual
 * upload inside that window ends with whichever write lands last.
 */
export const handler = documentEventHandler<GenerateImagesPayload>(async ({context, event}) => {
  const doc = event.data
  const {_id} = doc
  const isDraft = isDraftId(_id)
  const client = datasetClient(context)

  const fresh = await settled<ImageFields & {_rev: string}>(
    client,
    _id,
    `{_rev, ${imageFieldsProjection}}`,
    SETTLE_MS.prompt,
  )
  if (fresh === null) {
    console.log(`generate-images ${_id}: the document is gone`)
    return
  }
  if (fresh._rev !== doc._rev) {
    console.log(`generate-images ${_id}: changed while settling, the newer event owns it`)
    return
  }

  const draft = isDraft
    ? null
    : await client.fetch<ImageFields | null>(`*[_id == $id][0]{${imageFieldsProjection}}`, {
        id: `drafts.${_id}`,
      })
  const jobs = withoutDraftJobs(planImageJobs(doc.jobs, fresh), draft)
  const skipped = doc.jobs.filter((job) => !jobs.includes(job)).map((job) => job.field)
  if (jobs.length === 0) {
    console.log(
      `generate-images ${_id}: nothing to generate for ${skipped.join(', ')}, the prompt changed, an image arrived or the draft owns it`,
    )
    return
  }

  const site = siteContext(await client.fetch<SiteDocument[]>(siteContextQuery), isDraft)
  const agent = agentClient(context)
  const noWrite = dryRun(context)
  for (const job of jobs) {
    await agent.agent.action.generate({
      schemaId,
      documentId: _id,
      forcePublishedWrite: !isDraft,
      noWrite,
      instruction: imageInstruction(job.kind),
      instructionParams: imageInstructionParams(job, doc, site),
      target: {path: [job.field, 'asset']},
    })
  }
  console.log(
    `generate-images ${_id}: ${noWrite ? 'dry run, would generate' : 'generating'} ${jobs.map((job) => job.field).join(', ')}` +
      (skipped.length > 0 ? `; skipped ${skipped.join(', ')}` : ''),
  )
})
