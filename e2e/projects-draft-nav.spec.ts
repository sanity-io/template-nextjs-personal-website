import {expect, test} from '@playwright/test'
import {createClient} from '@sanity/client'
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret'

import {openProject, projectUrlPattern, readShowcaseProjects, visibleTitle} from './showcase'

test.describe('draft-mode project navigation', () => {
  test.skip(
    !process.env.SANITY_API_WRITE_TOKEN ||
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Requires Sanity write token and project env to enable draft mode',
  )

  test('opening every project in draft mode shows that project', async ({page, baseURL}) => {
    const projects = await readShowcaseProjects(page)
    expect(projects.length, 'homepage showcase needs a project link').toBeGreaterThanOrEqual(1)

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: process.env.SANITY_API_WRITE_TOKEN,
      apiVersion: '2025-02-19',
      useCdn: false,
    })
    const {secret} = await createPreviewSecret(client, 'draft-nav-e2e', '/studio')
    const enableUrl = new URL('/api/draft-mode/enable', baseURL)
    enableUrl.searchParams.set('sanity-preview-secret', secret)
    enableUrl.searchParams.set('sanity-preview-pathname', projects[0].href)
    enableUrl.searchParams.set('sanity-preview-perspective', 'drafts')

    await page.goto(enableUrl.toString(), {waitUntil: 'domcontentloaded'})
    await expect(visibleTitle(page, projects[0].title)).toBeVisible({timeout: 20000})
    await expect(page.getByText('Draft Mode Enabled')).toBeVisible({timeout: 20000})

    for (const project of projects) {
      await openProject(page, project)
      await expect(page).toHaveURL(projectUrlPattern(project.href))
      await expect(visibleTitle(page, project.title)).toBeVisible({timeout: 10000})
      for (const other of projects) {
        if (other.slug === project.slug) continue
        await expect(visibleTitle(page, other.title)).toHaveCount(0)
      }
    }
  })
})
