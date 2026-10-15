import {expect, test} from '@playwright/test'

test.describe('studio CSS', () => {
  test('preserves light-dark() instead of the Lightning CSS polyfill', async ({request}) => {
    const page = await request.get('/studio')
    expect(page.ok(), `GET /studio -> ${page.status()}`).toBeTruthy()

    const html = await page.text()
    const hrefs = [...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map(
      (match) => match[1],
    )
    expect(hrefs.length, 'studio HTML should link production CSS chunks').toBeGreaterThan(0)

    const css = (
      await Promise.all(
        hrefs.map(async (href) => {
          const response = await request.get(href)
          expect(response.ok(), href).toBeTruthy()
          return response.text()
        }),
      )
    ).join('\n')

    expect(css).toContain('light-dark(')
    // Sanity's precompiled CSS can reference these variables. Only definitions
    // indicate that Next.js generated the OS-driven light-dark() polyfill.
    expect(css).not.toMatch(/--lightningcss-light\s*:/)
    expect(css).not.toMatch(/--lightningcss-dark\s*:/)
  })
})
