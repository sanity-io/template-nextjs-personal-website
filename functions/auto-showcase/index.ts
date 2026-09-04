import type {SanityClient} from '@sanity/client'
import {documentEventHandler} from '@sanity/functions'

import {datasetClient, dryRun, isRevisionConflict} from '../lib/agent'
import type {AutoShowcasePayload} from '../lib/events'
import {homesMissingProject, homeVariantsQuery, showcaseReference, type HomeVariant} from './plan'

export const handler = documentEventHandler<AutoShowcasePayload>(async ({context, event}) => {
  const client = datasetClient(context)
  const options = {dryRun: dryRun(context)}
  try {
    await appendToHomes(client, event.data._id, options)
  } catch (error) {
    if (!isRevisionConflict(error)) throw error
    console.log('auto-showcase: a home document changed meanwhile, retrying once')
    await appendToHomes(client, event.data._id, options)
  }
})

async function appendToHomes(client: SanityClient, projectId: string, options: {dryRun: boolean}) {
  const homes = await client.fetch<HomeVariant[]>(homeVariantsQuery, {id: projectId})
  const targets = homesMissingProject(homes)
  if (targets.length === 0) {
    console.log(`auto-showcase: ${projectId} is already listed on ${homes.length} home document(s)`)
    return
  }

  const transaction = client.transaction()
  for (const home of targets) {
    transaction.patch(home._id, (patch) =>
      patch
        .ifRevisionId(home._rev)
        .setIfMissing({showcaseProjects: []})
        .append('showcaseProjects', [showcaseReference(projectId)]),
    )
  }
  await transaction.commit(options)
  console.log(
    `auto-showcase${options.dryRun ? ' (dry run)' : ''}: appended ${projectId} to ${targets.map((home) => home._id).join(', ')}`,
  )
}
