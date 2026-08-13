import {instant} from '@next/playwright'
import {expect, test} from '@playwright/test'

const SHELL_HEADER = '[data-testid="site-header"]'
const SHELL_FOOTER = '[data-testid="site-footer"]'
const PROJECT_CONTENT = '[data-testid="project-content"]'
const BRAVO_LINK = '[data-testid="nav-link-projects-project-bravo"]'

const VIEWPORTS = [
  {width: 1280, height: 800},
  {width: 390, height: 844},
] as const

test.describe('instant nav: /projects/project-alpha -> /projects/project-bravo', () => {
  // Phase B scaffold: delete before the PR. Confirms the markers render for the
  // anonymous test user without the instant() lock.
  test('dev-only: navigating to project-bravo renders its shell (no lock)', async ({page}) => {
    await page.goto('/projects/project-alpha')
    const trigger = page.locator(BRAVO_LINK)
    await expect(trigger).toBeVisible({timeout: 20000})
    await trigger.click()
    await expect(page).toHaveURL(/\/projects\/project-bravo(\?|$)/)
    await expect(page.locator(SHELL_HEADER)).toBeVisible({timeout: 15000})
    await expect(page.locator(SHELL_FOOTER)).toBeVisible()
    await expect(page.locator(PROJECT_CONTENT)).toBeVisible()
  })

  test('project-bravo header and footer commit under instant()', async ({page}) => {
    await page.goto('/projects/project-alpha')
    const trigger = page.locator(BRAVO_LINK)
    await expect(trigger).toBeVisible({timeout: 20000})

    await instant(page, async () => {
      await trigger.click()
      await expect(page).toHaveURL(/\/projects\/project-bravo(\?|$)/)
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport)
        await expect(page.locator(SHELL_HEADER)).toBeVisible()
        await expect(page.locator(SHELL_FOOTER)).toBeVisible()
      }
      await expect(page.locator(PROJECT_CONTENT)).toHaveCount(0)
    })

    await expect(page.locator(PROJECT_CONTENT)).toBeVisible()
  })
})
