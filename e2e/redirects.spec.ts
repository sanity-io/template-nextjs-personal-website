import {expect, test} from '@playwright/test'
import {createClient} from '@sanity/client'

import {readShowcaseProjects} from './showcase'

test.describe('slug redirects', () => {
  test.skip(
    !process.env.SANITY_API_WRITE_TOKEN ||
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Requires Sanity write token and project env to create a redirect document',
  )

  test('a retired project path answers with a 308 to its current path', async ({page, request}) => {
    const projects = await readShowcaseProjects(page)
    expect(projects.length, 'homepage showcase needs a project link').toBeGreaterThanOrEqual(1)

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
      to: projects[0].href,
    }
    await client.createOrReplace(redirect)
    try {
      const response = await request.get(redirect.from, {maxRedirects: 0})
      expect(response.status()).toBe(308)
      expect(response.headers()['location']).toBe(redirect.to)
    } finally {
      await client.delete(redirect._id)
    }
  })
})
