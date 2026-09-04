import {documentEventHandler} from '@sanity/functions'

import {resolveHref} from '../../sanity/lib/href'
import {datasetClient, dryRun} from '../lib/agent'
import type {SlugRedirectsPayload} from '../lib/events'
import {reconcileRedirects, type RedirectDoc} from './reconcile'

const existingRedirectsQuery = `*[_type == "redirect" && !(_id in path("drafts.**")) && defined(from) && defined(to) && (from in $paths || to == $fromPath)]{_id, _type, from, to}`

export const handler = documentEventHandler<SlugRedirectsPayload>(async ({context, event}) => {
  const {_id, _type, from} = event.data
  const client = datasetClient(context)

  // The event's own `after()` slug is history by the time this runs; plan against the dataset.
  const current = await client.fetch<string | null>('*[_id == $id][0].slug.current', {id: _id})
  if (current === null || current === from) {
    console.log(`slug-redirects: ${_id} no longer needs a redirect from "${from}"`)
    return
  }

  const fromPath = resolveHref(_type, from)
  const toPath = resolveHref(_type, current)
  if (!fromPath || !toPath) {
    console.error(`slug-redirects: no site path for ${_type} "${from}" -> "${current}"`)
    return
  }

  const existing = await client.fetch<RedirectDoc[]>(existingRedirectsQuery, {
    paths: [fromPath, toPath],
    fromPath,
  })
  const plan = reconcileRedirects(existing, {fromPath, toPath})
  if (plan.createOrReplace.length === 0 && plan.delete.length === 0) {
    console.log(`slug-redirects: redirects for ${fromPath} -> ${toPath} are already in place`)
    return
  }

  const transaction = client.transaction()
  for (const doc of plan.createOrReplace) transaction.createOrReplace(doc)
  for (const id of plan.delete) transaction.delete(id)
  await transaction.commit({dryRun: dryRun(context)})
  console.log(
    `slug-redirects: ${fromPath} -> ${toPath}, wrote ${plan.createOrReplace.length} and deleted ${plan.delete.length} redirect(s)`,
  )
})
