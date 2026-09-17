import {evaluate, parse} from 'groq-js'
import {describe, expect, it} from 'vitest'

import {homesMissingProject, homeVariantsQuery, showcaseReference, type HomeVariant} from './plan'

const listHomes = async (dataset: Record<string, unknown>[], id: string) => {
  const value = await evaluate(parse(homeVariantsQuery), {dataset, params: {id}})
  return (await value.get()) as HomeVariant[]
}

const home = (_id: string, showcaseProjects?: unknown[]) => ({
  _id,
  _type: 'home',
  _rev: `rev-${_id}`,
  ...(showcaseProjects ? {showcaseProjects} : {}),
})

describe('homeVariantsQuery', () => {
  it('reports a home without a showcase as not listed', async () => {
    await expect(listHomes([home('home')], 'p1')).resolves.toEqual([
      {_id: 'home', _rev: 'rev-home', listed: false},
    ])
  })

  it('reports the project as listed only where its reference exists', async () => {
    const dataset = [
      home('home', [showcaseReference('p1')]),
      home('drafts.home', [showcaseReference('p2')]),
      {_id: 'p1', _type: 'project'},
    ]
    await expect(listHomes(dataset, 'p1')).resolves.toEqual([
      {_id: 'home', _rev: 'rev-home', listed: true},
      {_id: 'drafts.home', _rev: 'rev-drafts.home', listed: false},
    ])
  })

  it('returns nothing without a home document', async () => {
    await expect(listHomes([{_id: 'p1', _type: 'project'}], 'p1')).resolves.toEqual([])
  })
})

describe('homesMissingProject', () => {
  it('keeps the variants that still need the reference', () => {
    const homes: HomeVariant[] = [
      {_id: 'home', _rev: 'a', listed: true},
      {_id: 'drafts.home', _rev: 'b', listed: false},
    ]
    expect(homesMissingProject(homes)).toEqual([{_id: 'drafts.home', _rev: 'b', listed: false}])
  })
})

describe('showcaseReference', () => {
  it('keys the reference by the project id so a repeat append is visible', () => {
    expect(showcaseReference('p1')).toEqual({_type: 'reference', _ref: 'p1', _key: 'p1'})
  })
})
