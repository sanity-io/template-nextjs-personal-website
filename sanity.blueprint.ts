import {loadEnvConfig} from '@next/env'
import {defineBlueprint, defineSyncTagInvalidateFunction} from '@sanity/blueprints'

const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(__dirname, dev, {info: () => null, error: console.error})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

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
    }),
  ],
})
