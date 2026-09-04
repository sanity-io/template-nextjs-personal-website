import {createClient, isHttpError, type SanityClient} from '@sanity/client'
import type {FunctionContext} from '@sanity/functions'

export const schemaId = '_.schemas.default'

export const isDraftId = (id: string) => id.startsWith('drafts.')

/** A `commit()` guarded by `ifRevisionId()` lost the race against another write. */
export const isRevisionConflict = (error: unknown) => isHttpError(error) && error.statusCode === 409

/**
 * `sanity functions test` runs are dry runs unless SANITY_FUNCTIONS_LOCAL_WRITE=1, so a handler
 * can be exercised against the real dataset without mutating it. Pass the result as `noWrite`
 * to Agent Actions and as `{dryRun}` to `commit()`.
 */
export const dryRun = (context: FunctionContext) =>
  Boolean(context.local) && process.env.SANITY_FUNCTIONS_LOCAL_WRITE !== '1'

export function agentClient(context: FunctionContext): SanityClient {
  return createClient({...context.clientOptions, apiVersion: 'vX', useCdn: false})
}

export function datasetClient(context: FunctionContext): SanityClient {
  return createClient({
    ...context.clientOptions,
    apiVersion: '2026-09-01',
    useCdn: false,
    perspective: 'raw',
  })
}
