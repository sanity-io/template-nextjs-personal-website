import {describe, expect, it} from 'vitest'

import {MAX_TAGS, normalizeTags} from './tags'

describe('normalizeTags', () => {
  it('returns nothing for a missing or malformed result', () => {
    expect(normalizeTags(undefined)).toEqual([])
    expect(normalizeTags('design')).toEqual([])
    expect(normalizeTags({tags: ['design']})).toEqual([])
  })

  it('keeps only non-empty strings, trimmed and lowercased', () => {
    expect(normalizeTags([' Web Design ', 42, null, '', '   ', 'AUDIO'])).toEqual([
      'web design',
      'audio',
    ])
  })

  it('drops repeats that differ only in case or whitespace', () => {
    expect(normalizeTags(['web', 'Web', ' WEB ', 'audio'])).toEqual(['web', 'audio'])
  })

  it('keeps the first five in order', () => {
    const many = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    expect(normalizeTags(many)).toEqual(many.slice(0, MAX_TAGS))
  })
})
