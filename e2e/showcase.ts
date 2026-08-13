import {expect, type Page} from '@playwright/test'

export type ShowcaseProject = {href: string; slug: string; title: string}

export function visibleTitle(page: Page, title: string) {
  return page.getByTestId('page-title').filter({hasText: title, visible: true})
}

export async function readShowcaseProjects(page: Page): Promise<ShowcaseProject[]> {
  await page.goto('/')
  const links = page.locator('a[href^="/projects/"]')
  await expect(links.first()).toBeVisible({timeout: 20000})
  const raw = await links.evaluateAll((els) =>
    els.map((el) => {
      const href = el.getAttribute('href') || ''
      const slug = href.split('/').filter(Boolean).pop() || ''
      const title = (
        el.querySelector('.font-extrabold')?.textContent ||
        el.textContent ||
        ''
      ).trim()
      return {href, slug, title}
    }),
  )
  const seen = new Set<string>()
  return raw.filter((project) => {
    if (!project.slug || seen.has(project.slug)) return false
    seen.add(project.slug)
    return true
  })
}

export function projectUrlPattern(href: string) {
  return new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\?|$)`)
}
