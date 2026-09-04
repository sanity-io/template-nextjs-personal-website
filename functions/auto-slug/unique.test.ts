import {describe, expect, it} from 'vitest'

import {SLUG_CANDIDATES, slugCandidates, uniqueSlug} from './unique'

describe('slugCandidates', () => {
  it('starts with the base and numbers the rest from 2', () => {
    expect(slugCandidates('hello-world', 4)).toEqual([
      'hello-world',
      'hello-world-2',
      'hello-world-3',
      'hello-world-4',
    ])
  })

  it('adds at most three characters to the base', () => {
    const longest = Math.max(...slugCandidates('x', SLUG_CANDIDATES).map((slug) => slug.length))
    expect(longest).toBe('x'.length + 3)
  })
})

describe('uniqueSlug', () => {
  it('keeps the base when nobody uses it', () => {
    expect(uniqueSlug('hello-world', [])).toBe('hello-world')
    expect(uniqueSlug('hello-world', ['hello-world-2', 'other'])).toBe('hello-world')
  })

  it('takes the first free numbered candidate', () => {
    expect(uniqueSlug('hello-world', ['hello-world'])).toBe('hello-world-2')
    expect(uniqueSlug('hello-world', ['hello-world', 'hello-world-2', 'hello-world-4'])).toBe(
      'hello-world-3',
    )
  })

  it('falls back to a random suffix when every candidate is taken', () => {
    const taken = slugCandidates('hello-world', SLUG_CANDIDATES)
    expect(uniqueSlug('hello-world', taken, () => 'k7q2')).toBe('hello-world-k7q2')
    expect(uniqueSlug('hello-world', taken)).toMatch(/^hello-world-[0-9a-z]{4}$/)
  })
})
