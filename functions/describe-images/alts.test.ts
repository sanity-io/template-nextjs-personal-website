import {describe, expect, it} from 'vitest'

import type {AltPath} from '../lib/events'
import {readAlts, toJsonMatch} from './alts'

const cover: AltPath = ['coverImage', 'alt']
const inline: AltPath = ['description', {_key: 'i1'}, 'alt']

describe('toJsonMatch', () => {
  it.each<[AltPath, string]>([
    [cover, 'coverImage.alt'],
    [inline, 'description[_key=="i1"].alt'],
    [['body', {_key: 'i2'}, 'alt'], 'body[_key=="i2"].alt'],
  ])('turns %j into %s', (path, expected) => {
    expect(toJsonMatch(path)).toBe(expected)
  })
})

describe('readAlts', () => {
  const described = {
    _id: 'drafts.p1',
    coverImage: {asset: {_ref: 'image-cover'}, alt: 'A lighthouse on a rocky shore at dusk.'},
    description: [
      {_type: 'block', _key: 'b1'},
      {_type: 'image', _key: 'i1', alt: 'A harbour crane seen from below.'},
      {_type: 'image', _key: 'i2', alt: '   '},
      {_type: 'image', _key: 'i3'},
    ],
  }

  it('keys every described target by its JSONMatch path', () => {
    expect(readAlts(described, [cover, inline])).toEqual({
      'coverImage.alt': 'A lighthouse on a rocky shore at dusk.',
      'description[_key=="i1"].alt': 'A harbour crane seen from below.',
    })
  })

  it('trims the text it keeps', () => {
    const padded = {coverImage: {alt: '  A boat.  '}}
    expect(readAlts(padded, [cover])).toEqual({'coverImage.alt': 'A boat.'})
  })

  it.each<[string, AltPath]>([
    ['the alt is blank', ['description', {_key: 'i2'}, 'alt']],
    ['the alt is missing', ['description', {_key: 'i3'}, 'alt']],
    ['the key does not exist', ['description', {_key: 'i9'}, 'alt']],
    ['the field is not an array', ['coverImage', {_key: 'i1'}, 'alt']],
    ['the field is not an object', ['_id', 'alt']],
    ['the value is not a string', ['coverImage', 'asset']],
  ])('skips a target when %s', (_, path) => {
    expect(readAlts(described, [path])).toEqual({})
  })

  it('returns nothing for a result that is not a document', () => {
    expect(readAlts(null, [cover])).toEqual({})
    expect(readAlts('text', [cover])).toEqual({})
  })
})
