import {loadEnvConfig} from '@next/env'
import {
  defineBlueprint,
  defineDocumentFunction,
  defineSyncTagInvalidateFunction,
} from '@sanity/blueprints'

import {functionSpecs} from './functions/lib/events'

const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(__dirname, dev, {info: () => null, error: console.error})

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET,
  REVALIDATE_URL,
  SANITY_REVALIDATE_SECRET,
} = process.env

// An unscoped document function would run against every dataset in the project.
if (!NEXT_PUBLIC_SANITY_PROJECT_ID || !NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error(
    'Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET so the functions run against one dataset',
  )
}
const resource = {
  type: 'dataset',
  id: `${NEXT_PUBLIC_SANITY_PROJECT_ID}.${NEXT_PUBLIC_SANITY_DATASET}`,
} as const

// Blueprint `env` is additive, so leaving a value out keeps whatever is already deployed.
const env: Record<string, string> = {}
if (REVALIDATE_URL) env.REVALIDATE_URL = REVALIDATE_URL
if (SANITY_REVALIDATE_SECRET) env.SANITY_REVALIDATE_SECRET = SANITY_REVALIDATE_SECRET

/**
 * Deployed with `npx sanity blueprints deploy`, see "Sanity Functions" in the README.
 * Every function is scoped to the dataset this app reads; a dataset can only have one sync tag
 * invalidate function. The document functions' triggers live in `functions/lib/events.ts`, next to
 * the payload type each handler receives.
 */
export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: 'invalidate-sync-tags',
      event: {resource},
      env: Object.keys(env).length > 0 ? env : undefined,
    }),
    ...Object.entries(functionSpecs).map(([name, spec]) =>
      defineDocumentFunction({name, timeout: spec.timeout, event: {...spec.event, resource}}),
    ),
  ],
})
