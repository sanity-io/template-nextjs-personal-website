import {expect, test} from '@playwright/test'
import {createClient} from '@sanity/client'
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret'

import {projectUrlPattern, readShowcaseProjects, visibleTitle} from './showcase'

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
    // Enable draft on the home page and then navigate into projects client-side. Starting
    // from "/" (not a project) is what exposes the sticky-navigation bug: the showcase links
    // prefetch a sibling project, and every subsequent /projects/[slug] navigation would
    // otherwise reuse that one prefetched RSC.
    enableUrl.searchParams.set('sanity-preview-pathname', '/')
    enableUrl.searchParams.set('sanity-preview-perspective', 'drafts')

    await page.goto(enableUrl.toString(), {waitUntil: 'domcontentloaded'})
    await expect(page.getByText('Draft Mode Enabled')).toBeVisible({timeout: 20000})

    // Let the showcase links prefetch before navigating; the bug is that a prefetched
    // sibling's RSC gets reused for the whole /projects/[slug] segment.
    const homeLink = page.getByTestId('nav-link-home')
    for (const project of projects) {
      const card = page.locator(`a[href="${project.href}"]`).first()
      await expect(card).toBeVisible({timeout: 20000})
    }
    await page.waitForTimeout(1500)

    for (const project of projects) {
      if (new URL(page.url()).pathname !== '/') {
        await homeLink.click()
        await page.waitForURL((url) => new URL(url).pathname === '/', {timeout: 10000})
        await page.waitForTimeout(500)
      }
      // Click the showcase card directly from "/" (a client-side navigation).
      await page.locator(`a[href="${project.href}"]`).first().click()
      await expect(page).toHaveURL(projectUrlPattern(project.href))
      await expect(visibleTitle(page, project.title)).toBeVisible({timeout: 10000})
      for (const other of projects) {
        if (other.slug === project.slug) continue
        await expect(visibleTitle(page, other.title)).toHaveCount(0)
      }
    }
  })
})
