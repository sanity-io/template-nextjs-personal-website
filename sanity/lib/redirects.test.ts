import {describe, expect, it, vi} from 'vitest'

import {isSitePath} from './redirects'

// `./live` pulls in `server-only`, which refuses to load outside a Server Component.
vi.mock('./live', () => ({sanityFetch: vi.fn()}))

describe('isSitePath', () => {
  it.each(['/', '/projects/new-slug', '/about-us', '/a/b/c-d_e.f'])('accepts %s', (path) => {
    expect(isSitePath(path)).toBe(true)
  })

  it.each([
    ['a protocol-relative host', '//evil.example/projects'],
    ['an absolute URL', 'https://evil.example/'],
    ['a relative path', 'projects/new-slug'],
    ['a query string', '/projects/new?utm=1'],
    ['a fragment', '/projects/new#top'],
    ['whitespace', '/projects/new slug'],
    ['an empty string', ''],
  ])('rejects %s', (_, path) => {
    expect(isSitePath(path)).toBe(false)
  })
})
