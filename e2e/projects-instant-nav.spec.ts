import {instant} from '@next/playwright'
import {expect, test} from '@playwright/test'

import {projectUrlPattern, readShowcaseProjects, visibleTitle} from './showcase'

const VIEWPORTS = [
  {width: 1280, height: 800},
  {width: 390, height: 844},
] as const

test.describe('instant nav to a project page', () => {
  test('project header and footer commit under instant()', async ({page}) => {
    const projects = await readShowcaseProjects(page)
    expect(projects.length, 'homepage showcase needs a project link').toBeGreaterThanOrEqual(1)
    const destination = projects.length > 1 ? projects[1] : projects[0]
    const origin = projects[0]

    await page.goto(origin.href)
    await expect(page.getByTestId('site-header')).toBeVisible({timeout: 20000})

    const navTrigger = page.getByTestId(`nav-link-projects-${destination.slug}`)
    const trigger = (await navTrigger.isVisible())
      ? navTrigger
      : page.locator(`a[href="${destination.href}"]`).first()

    if (!(await navTrigger.isVisible())) {
      await page.goto('/')
      await expect(trigger).toBeVisible({timeout: 20000})
    }

    await instant(page, async () => {
      await trigger.click()
      await expect(page).toHaveURL(projectUrlPattern(destination.href))
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport)
        await expect(page.getByTestId('site-header')).toBeVisible()
        await expect(page.getByTestId('site-footer')).toBeVisible()
        await expect(visibleTitle(page, destination.title)).toBeVisible()
      }
    })
  })
})
