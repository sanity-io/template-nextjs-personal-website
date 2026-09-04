import {describe, expect, it} from 'vitest'

import {portableTextToString} from './portable-text'

const block = (key: string, ...texts: string[]) => ({
  _type: 'block',
  _key: key,
  children: texts.map((text, i) => ({_type: 'span', _key: `${key}${i}`, text})),
})

describe('portableTextToString', () => {
  it('joins spans within a block and separates blocks like pt::text', () => {
    expect(portableTextToString([block('a', 'Hello, ', 'world'), block('b', 'Bye')])).toBe(
      'Hello, world\n\nBye',
    )
  })

  it('ignores non-text blocks and non-array input', () => {
    expect(portableTextToString([{_type: 'image', _key: 'i', asset: {_ref: 'image-1'}}])).toBe('')
    expect(portableTextToString(undefined)).toBe('')
    expect(portableTextToString('text')).toBe('')
  })
})
