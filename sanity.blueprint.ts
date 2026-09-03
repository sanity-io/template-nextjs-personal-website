import {loadEnvConfig} from '@next/env'
import {defineBlueprint, defineSyncTagInvalidateFunction} from '@sanity/blueprints'

const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(__dirname, dev, {info: () => null, error: console.error})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

/**
 * Environment variables handed to the deployed function. Read from the deploying environment
 * (`.env.local` locally, repository variables/secrets in GitHub Actions) so `blueprints deploy`
 * configures the function in one step, without a separate `sanity functions env add`. Blueprint
 * `env` is additive: unset values here leave whatever is already deployed untouched.
 */
const functionEnv = Object.fromEntries(
  Object.entries({
    REVALIDATE_URL: process.env.REVALIDATE_URL,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
  }).filter((entry): entry is [string, string] => Boolean(entry[1])),
)

/**
 * Deploys the Sanity Function in `functions/invalidate-sync-tags` with `npx sanity blueprints deploy`.
 * The function calls this app's `/api/revalidate` route whenever published content changes, then
 * tells Sanity it's done so `<SanityLive waitFor="function">` clients only refresh after the
 * Next.js cache has been invalidated.
 *
 * Only one sync-tag-invalidate function can be deployed per dataset, so the function is scoped
 * to the dataset this app reads from instead of every dataset in the project.
 */
export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: 'invalidate-sync-tags',
      event:
        projectId && dataset
          ? {resource: {type: 'dataset', id: `${projectId}.${dataset}`}}
          : undefined,
      env: Object.keys(functionEnv).length > 0 ? functionEnv : undefined,
    }),
  ],
})
