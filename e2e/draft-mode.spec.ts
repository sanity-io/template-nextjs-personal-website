import {expect, test} from '@playwright/test'
import {createClient} from '@sanity/client'
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret'

test.describe('draft mode', () => {
  test.skip(
    !process.env.SANITY_API_WRITE_TOKEN ||
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Requires Sanity write token and project env to create a draft and enable draft mode',
  )

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: '2025-02-19',
    useCdn: false,
  })

  // A draft-only project with a unique slug, so concurrent CI runs sharing a dataset don't
  // collide and the slug is never in the prerendered `generateStaticParams` set.
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  const id = `e2e-draft-mode-${suffix}`
  const slug = `e2e-draft-mode-${suffix}`
  const title = `Draft mode e2e ${suffix}`

  test.beforeAll(async () => {
    await client.create({
      _id: `drafts.${id}`,
      _type: 'project',
      title,
      slug: {_type: 'slug', current: slug},
    })
  })

  test.afterAll(async () => {
    await client.delete(`drafts.${id}`)
  })

  test('previews a draft-only page and the Disable button exits draft mode', async ({
    page,
    browser,
    context,
    baseURL,
  }) => {
    const {secret} = await createPreviewSecret(client, 'draft-mode-e2e', '/studio')
    const enableUrl = new URL('/api/draft-mode/enable', baseURL)
    enableUrl.searchParams.set('sanity-preview-secret', secret)
    enableUrl.searchParams.set('sanity-preview-pathname', `/projects/${slug}`)
    enableUrl.searchParams.set('sanity-preview-perspective', 'drafts')

    await page.goto(enableUrl.toString(), {waitUntil: 'domcontentloaded'})
    await expect(page.getByText('Draft Mode Enabled')).toBeVisible({timeout: 20000})
    await expect(page.getByTestId('page-title').filter({hasText: title})).toBeVisible({
      timeout: 20000,
    })

    const visitor = await browser.newPage()
    await visitor.goto(`/projects/${slug}`)
    await expect(visitor.getByTestId('project-content')).toHaveCount(0)
    await expect(visitor.getByText(title)).toHaveCount(0)
    await visitor.close()

    await page.getByRole('button', {name: 'Disable', exact: true}).click()
    await expect(page.getByText('Draft Mode Enabled')).toHaveCount(0, {timeout: 20000})
    await expect(page.getByTestId('project-content')).toHaveCount(0, {timeout: 20000})
    expect((await context.cookies()).map((cookie) => cookie.name)).not.toContain(
      '__prerender_bypass',
    )
  })
})
