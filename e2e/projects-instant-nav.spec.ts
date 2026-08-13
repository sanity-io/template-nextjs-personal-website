import {instant} from '@next/playwright'
import {expect, test} from '@playwright/test'

const VIEWPORTS = [
  {width: 1280, height: 800},
  {width: 390, height: 844},
] as const

test.describe('instant nav: /projects/project-alpha -> /projects/project-bravo', () => {
  test('project-bravo header and footer commit under instant()', async ({page}) => {
    await page.goto('/projects/project-alpha')
    const trigger = page.getByTestId('nav-link-projects-project-bravo')
    await expect(trigger).toBeVisible({timeout: 20000})

    await instant(page, async () => {
      await trigger.click()
      await expect(page).toHaveURL(/\/projects\/project-bravo(\?|$)/)
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport)
        await expect(page.getByTestId('site-header')).toBeVisible()
        await expect(page.getByTestId('site-footer')).toBeVisible()
        await expect(
          page.getByTestId('page-title').filter({hasText: 'Project Bravo', visible: true}),
        ).toBeVisible()
      }
    })
  })
})
