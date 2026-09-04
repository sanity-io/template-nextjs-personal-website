import {describe, expect, it} from 'vitest'

import {slugify, slugMaxLength} from './slugify'

describe('slugify', () => {
  it('strips diacritics and lowercases', () => {
    expect(slugify('Åre & Öland')).toBe('are-oland')
    expect(slugify('Crème Brûlée')).toBe('creme-brulee')
  })

  it('collapses punctuation and whitespace into single dashes', () => {
    expect(slugify('  Hello,   World!  --  (2026) ')).toBe('hello-world-2026')
    expect(slugify('a_b.c/d')).toBe('a-b-c-d')
  })

  it('returns an empty slug for empty or whitespace input', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
    expect(slugify('!!!')).toBe('')
  })

  it('cuts at a word boundary within the limit', () => {
    expect(slugify('the quick brown fox', 9)).toBe('the-quick')
    expect(slugify('the quick brown fox', 8)).toBe('the')
    expect(slugify('the quick brown fox', 12)).toBe('the-quick')
  })

  it('hard-cuts a single word longer than the limit', () => {
    expect(slugify('supercalifragilistic', 5)).toBe('super')
    expect(slugify('supercalifragilistic expialidocious', 5)).toBe('super')
  })

  it('defaults to the page limit', () => {
    const long = 'word '.repeat(60)
    expect(slugify(long).length).toBeLessThanOrEqual(slugMaxLength.page)
    expect(slugify(long, slugMaxLength.project).length).toBeLessThanOrEqual(slugMaxLength.project)
    expect(slugify(long)).not.toMatch(/-$/)
  })
})
