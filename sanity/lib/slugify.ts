export const slugMaxLength = {project: 96, page: 200} as const

export function slugify(input: string, maxLength: number = slugMaxLength.page): string {
  const slug = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cutAtWordBoundary(slug, maxLength)
}

function cutAtWordBoundary(slug: string, maxLength: number): string {
  if (slug.length <= maxLength) return slug
  const head = slug.slice(0, maxLength)
  if (slug[maxLength] === '-') return head
  const lastBoundary = head.lastIndexOf('-')
  return lastBoundary > 0 ? head.slice(0, lastBoundary) : head
}
