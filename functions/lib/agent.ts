import {createClient, isHttpError, type SanityClient} from '@sanity/client'
import type {FunctionContext} from '@sanity/functions'

export const schemaId = '_.schemas.default'

export const isDraftId = (id: string) => id.startsWith('drafts.')

export const isRevisionConflict = (error: unknown) => isHttpError(error) && error.statusCode === 409

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
