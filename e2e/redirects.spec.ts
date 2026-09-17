import {expect, test} from '@playwright/test'
import {createClient} from '@sanity/client'

import {projectUrlPattern, readShowcaseProjects, visibleTitle} from './showcase'

test.describe('slug redirects', () => {
  test.skip(
    !process.env.SANITY_API_WRITE_TOKEN ||
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Requires Sanity write token and project env to create a redirect document',
  )

  test('a retired project path lands on its current path', async ({page}) => {
    const projects = await readShowcaseProjects(page)
    expect(projects.length, 'homepage showcase needs a project link').toBeGreaterThanOrEqual(1)
    const destination = projects[0]

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: process.env.SANITY_API_WRITE_TOKEN,
      apiVersion: '2025-02-19',
      useCdn: false,
    })
    const random = Math.random().toString(36).slice(2, 10)
    const redirect = {
      _id: `redirect-e2e-${random}`,
      _type: 'redirect',
      from: `/projects/e2e-redirect-${random}`,
      to: destination.href,
    }
    try {
      await client.create(redirect)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      // A read+write token can create the fixture; a contributor token cannot.
      test.skip(message.includes('Insufficient permissions'), `${message} (SANITY_API_WRITE_TOKEN)`)
      throw error
    }
    try {
      await page.goto(redirect.from)
      await expect(page).toHaveURL(projectUrlPattern(redirect.to), {timeout: 20000})
      await expect(visibleTitle(page, destination.title)).toBeVisible({timeout: 20000})
    } finally {
      await client.delete(redirect._id)
    }
  })
})
