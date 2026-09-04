import {describe, expect, it} from 'vitest'

import {maxPortableTextLength} from './validation'

const block = (text: string) => ({
  _type: 'block',
  _key: text,
  children: [{_type: 'span', _key: `${text}-s`, text}],
})

describe('maxPortableTextLength', () => {
  const context = {} as never

  it('counts characters, not blocks', () => {
    const rule = maxPortableTextLength(5)
    expect(rule([block('ab'), block('c')], context)).toBe(true)
    expect(rule([block('abcdef')], context)).toBe('Keep it under 5 characters')
    expect(rule(undefined, context)).toBe(true)
  })
})
