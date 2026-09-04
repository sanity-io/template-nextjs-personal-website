import {describe, expect, it} from 'vitest'

import {maxPlainTextLength, toPlainText} from './portable-text'

const block = (key: string, ...texts: string[]) => ({
  _type: 'block',
  _key: key,
  children: texts.map((text, i) => ({_type: 'span', _key: `${key}${i}`, text})),
})

describe('toPlainText', () => {
  it('joins spans within a block and separates blocks like pt::text', () => {
    expect(toPlainText([block('a', 'Hello, ', 'world'), block('b', 'Bye')])).toBe(
      'Hello, world\n\nBye',
    )
  })

  it('ignores non-text blocks and missing input', () => {
    expect(toPlainText([{_type: 'image', _key: 'i', asset: {_ref: 'image-1'}}])).toBe('')
    expect(toPlainText(undefined)).toBe('')
  })
})

describe('maxPlainTextLength', () => {
  const context = {} as never

  it('counts characters, not blocks', () => {
    const rule = maxPlainTextLength(5)
    expect(rule([block('a', 'ab'), block('b', 'c')], context)).toBe(true)
    expect(rule([block('a', 'abcdef')], context)).toBe('Must be at most 5 characters long')
  })
})
