import {ClientError, ServerError} from '@sanity/client'
import {describe, expect, it} from 'vitest'

import {isRevisionConflict} from './agent'

const response = (statusCode: number, description: string) => ({
  statusCode,
  statusMessage: null,
  headers: {},
  body: {error: {type: 'mutationError', description}},
  url: 'https://jslcjxc0.api.sanity.io/v2026-09-01/data/mutate/production',
  method: 'POST',
})

describe('isRevisionConflict', () => {
  it('recognises the 409 a stale ifRevisionId produces', () => {
    const error = new ClientError(response(409, 'The document has a different revision'))
    expect(isRevisionConflict(error)).toBe(true)
  })

  it.each([
    ['another client error', new ClientError(response(400, 'Malformed patch'))],
    ['a server error', new ServerError(response(500, 'Internal error'))],
    ['a plain error', new Error('The document has a different revision')],
    ['a non-error', {statusCode: 409}],
  ])('rejects %s', (_, error) => {
    expect(isRevisionConflict(error)).toBe(false)
  })
})
