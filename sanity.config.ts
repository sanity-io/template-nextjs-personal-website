'use client'

import '@sanity/ui/styles.css'
import {vercelProtectionBypassTool} from '@sanity/vercel-protection-bypass'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import * as resolve from '@/sanity/plugins/resolve'
import page from '@/sanity/schemas/documents/page'
import project from '@/sanity/schemas/documents/project'
import duration from '@/sanity/schemas/objects/duration'
import milestone from '@/sanity/schemas/objects/milestone'
import timeline from '@/sanity/schemas/objects/timeline'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'

/**
 * This config is used to set up Sanity Studio that's mounted on the `app/studio/[[...index]]/page.tsx` route
 */
const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Next.js Personal Website with Sanity.io'

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || '',
  dataset: dataset || '',
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: [
      // Singletons
      home,
      settings,
      // Documents
      duration,
      page,
      project,
      // Objects
      milestone,
      timeline,
    ],
  },
  document: {
    // The schema type name doubles as the document id, e.g. `home` edits `_id: "home"`.
    // Use `defineSingleton({documentId, schemaType, ...})` from `sanity` when they need to differ.
    singletons: [home.name, settings.name],
  },
  beta: {
    // Keeps the three most recently used tools mounted when switching between them, so going from
    // Presentation to Structure and back restores the preview and open document instantly.
    // Beta: not production-ready yet, see https://www.sanity.io/docs/changelog/studio-Ni4xNi4w
    reactActivityMode: {enabled: true},
  },
  plugins: [
    presentationTool({
      resolve,
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
    }),
    structureTool({
      structure: (S) =>
        // `.singletons()` only appends, and the builder it returns has no `.items()`,
        // so the registered items are read back and placed ahead of the type lists.
        S.list()
          .title('Content')
          .items([
            ...(S.list().singletons().getItems() ?? []),
            S.divider(),
            ...S.documentTypeListItems().map((item) => item.showCount()),
          ]),
    }),
    // Lets Presentation load previews on Vercel deployments that have Deployment Protection enabled.
    // Open the "Vercel Protection Bypass" tab in the Studio to save the secret, see the README.
    // https://www.sanity.io/docs/visual-editing/vercel-protection-bypass
    vercelProtectionBypassTool(),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
