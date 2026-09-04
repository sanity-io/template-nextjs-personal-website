import {describe, expect, it} from 'vitest'

import {reconcileRedirects, redirectId, type RedirectDoc, type RedirectPlan} from './reconcile'

const redirect = (from: string, to: string, _id = redirectId(from)): RedirectDoc => ({
  _id,
  _type: 'redirect',
  from,
  to,
})

const apply = (existing: RedirectDoc[], plan: RedirectPlan): RedirectDoc[] => {
  const replaced = new Set(plan.createOrReplace.map((doc) => doc._id))
  return [
    ...existing.filter((doc) => !plan.delete.includes(doc._id) && !replaced.has(doc._id)),
    ...plan.createOrReplace,
  ]
}

const table = (docs: RedirectDoc[]) => Object.fromEntries(docs.map((doc) => [doc.from, doc.to]))

describe('redirectId', () => {
  it('maps a path to one stable document id', () => {
    expect(redirectId('/projects/old')).toBe(redirectId('/projects/old'))
    expect(redirectId('/projects/old')).not.toBe(redirectId('/projects/new'))
    expect(redirectId('/projects/old')).toMatch(/^redirect-[0-9a-f]{16}$/)
  })
})

describe('reconcileRedirects', () => {
  it('creates the redirect for a first rename', () => {
    const plan = reconcileRedirects([], {fromPath: '/projects/a', toPath: '/projects/b'})
    expect(plan).toEqual({createOrReplace: [redirect('/projects/a', '/projects/b')], delete: []})
  })

  it('collapses a chain so A->B then B->C leaves A->C and B->C', () => {
    const afterFirst = apply([], reconcileRedirects([], {fromPath: '/a', toPath: '/b'}))
    const afterSecond = apply(
      afterFirst,
      reconcileRedirects(afterFirst, {fromPath: '/b', toPath: '/c'}),
    )
    expect(table(afterSecond)).toEqual({'/a': '/c', '/b': '/c'})
    expect(afterSecond.filter((doc) => doc.from === '/a')).toHaveLength(1)
  })

  it('renaming back B->A deletes A->B and writes no self redirect', () => {
    const existing = [redirect('/a', '/b')]
    const plan = reconcileRedirects(existing, {fromPath: '/b', toPath: '/a'})
    expect(plan).toEqual({createOrReplace: [redirect('/b', '/a')], delete: [redirectId('/a')]})
    expect(table(apply(existing, plan))).toEqual({'/b': '/a'})
  })

  it('applying the same change twice yields the same end state and an empty second plan', () => {
    const change = {fromPath: '/a', toPath: '/b'}
    const once = apply([], reconcileRedirects([], change))
    const secondPlan = reconcileRedirects(once, change)
    expect(secondPlan).toEqual({createOrReplace: [], delete: []})
    expect(apply(once, secondPlan)).toEqual(once)
  })

  it('deletes a redirect whose from equals the new path', () => {
    const existing = [redirect('/c', '/x')]
    const plan = reconcileRedirects(existing, {fromPath: '/b', toPath: '/c'})
    expect(plan.delete).toEqual([redirectId('/c')])
    expect(table(apply(existing, plan))).toEqual({'/b': '/c'})
  })

  it('is order independent for a stale A->B event after B->C was applied', () => {
    const current = [redirect('/a', '/c'), redirect('/b', '/c')]
    const stale = reconcileRedirects(current, {fromPath: '/a', toPath: '/c'})
    expect(stale).toEqual({createOrReplace: [], delete: []})
  })

  it('replaces hand-made duplicates for the same path with the canonical document', () => {
    const existing = [redirect('/a', '/old', 'manual-1'), redirect('/a', '/older', 'manual-2')]
    const plan = reconcileRedirects(existing, {fromPath: '/a', toPath: '/b'})
    expect(plan).toEqual({
      createOrReplace: [redirect('/a', '/b')],
      delete: ['manual-1', 'manual-2'],
    })
  })

  it('never writes a redirect when the path did not change', () => {
    const plan = reconcileRedirects([redirect('/a', '/z')], {fromPath: '/a', toPath: '/a'})
    expect(plan).toEqual({createOrReplace: [], delete: [redirectId('/a')]})
  })
})
