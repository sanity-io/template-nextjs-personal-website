import {describe, expect, it} from 'vitest'

import {evaluateEvent} from './test-utils'

const published = {_id: 'a', _type: 'project', title: 'Alpha', slug: {current: 'alpha'}}

describe('evaluateEvent', () => {
  it('returns undefined when the filter does not match', async () => {
    await expect(
      evaluateEvent({filter: '_type == "page"'}, {before: published, after: published}),
    ).resolves.toBeUndefined()
  })

  it('applies the projection to the matched document', async () => {
    await expect(
      evaluateEvent({filter: '_type == "project"', projection: '{_id, title}'}, {after: published}),
    ).resolves.toEqual({_id: 'a', title: 'Alpha'})
  })

  it('exposes before() and delta::changedAny() in delta mode', async () => {
    const renamed = {...published, slug: {current: 'alpha-2'}}
    const rule = {
      filter: 'delta::changedAny(slug.current) && defined(before().slug.current)',
      projection: '{"from": before().slug.current, "to": after().slug.current}',
    }
    await expect(evaluateEvent(rule, {before: published, after: renamed})).resolves.toEqual({
      from: 'alpha',
      to: 'alpha-2',
    })
    await expect(
      evaluateEvent(rule, {before: published, after: published}),
    ).resolves.toBeUndefined()
    await expect(evaluateEvent(rule, {after: renamed})).resolves.toBeUndefined()
  })

  it('treats a create event as having no before()', async () => {
    await expect(
      evaluateEvent({filter: '!defined(before())', projection: '{_id}'}, {after: published}),
    ).resolves.toEqual({_id: 'a'})
    await expect(
      evaluateEvent({filter: '!defined(before())'}, {before: published, after: published}),
    ).resolves.toBeUndefined()
  })

  it('builds target paths with select, spread and array::compact', async () => {
    const doc = {
      _id: 'a',
      _type: 'project',
      coverImage: {asset: {_ref: 'image-1'}},
      description: [
        {_type: 'block', _key: 'b1'},
        {_type: 'image', _key: 'i1', asset: {_ref: 'image-2'}},
        {_type: 'image', _key: 'i2', asset: {_ref: 'image-3'}, alt: 'done'},
        {_type: 'image', _key: 'i3'},
      ],
    }
    const projection = `{
      "targets": array::compact([
        select(defined(coverImage.asset) && !defined(coverImage.alt) => ["coverImage", "alt"]),
        ...description[_type == "image" && defined(asset) && !defined(alt)]{"path": ["description", {"_key": _key}, "alt"]}.path
      ])
    }`
    await expect(evaluateEvent({projection}, {after: doc})).resolves.toEqual({
      targets: [
        ['coverImage', 'alt'],
        ['description', {_key: 'i1'}, 'alt'],
      ],
    })
  })

  it('handles pt::text and count over missing fields', async () => {
    const projection = `{
      "emptyOverview": !defined(overview) || length(pt::text(overview)) == 0,
      "bodyLength": length(pt::text(coalesce(description, body))),
      "noTags": count(coalesce(tags, [])) == 0
    }`
    const doc = {
      _id: 'a',
      _type: 'project',
      description: [
        {
          _type: 'block',
          _key: 'b1',
          children: [{_type: 'span', _key: 's1', text: 'Twelve chars'}],
        },
      ],
    }
    await expect(evaluateEvent({projection}, {after: doc})).resolves.toEqual({
      emptyOverview: true,
      bodyLength: 12,
      noTags: true,
    })
  })
})
