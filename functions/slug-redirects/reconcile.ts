import {createHash} from 'node:crypto'

export interface RedirectDoc {
  _id: string
  _type: 'redirect'
  from: string
  to: string
}

export interface SlugChange {
  fromPath: string
  toPath: string
}

export interface RedirectPlan {
  createOrReplace: RedirectDoc[]
  delete: string[]
}

export const redirectId = (path: string) =>
  `redirect-${createHash('sha1').update(path).digest('hex').slice(0, 16)}`

export function reconcileRedirects(existing: RedirectDoc[], change: SlugChange): RedirectPlan {
  const desired = new Map<string, string | null>([[change.fromPath, change.toPath]])
  for (const doc of existing) {
    if (doc.to === change.fromPath) desired.set(doc.from, change.toPath)
  }
  desired.set(change.toPath, null)
  for (const [from, to] of desired) {
    if (from === to) desired.set(from, null)
  }

  const plan: RedirectPlan = {createOrReplace: [], delete: []}
  for (const [from, to] of desired) {
    const rows = existing.filter((doc) => doc.from === from)
    if (to === null) {
      plan.delete.push(...rows.map((doc) => doc._id))
      continue
    }
    const wanted: RedirectDoc = {_id: redirectId(from), _type: 'redirect', from, to}
    const current = rows.find((doc) => doc._id === wanted._id)
    if (current?.to !== wanted.to) plan.createOrReplace.push(wanted)
    plan.delete.push(...rows.filter((doc) => doc._id !== wanted._id).map((doc) => doc._id))
  }
  return plan
}
