import {describe, expect, it} from 'vitest'

import {functionSpecs, type FunctionEvent, type FunctionName} from './events'
import {evaluateEvent, type DocumentChange} from './test-utils'

const run = (name: FunctionName, change: DocumentChange) =>
  evaluateEvent(functionSpecs[name].event, change)

const block = (text: string, marks: string[] = []) => ({
  _type: 'block',
  _key: 'b1',
  children: [{_type: 'span', _key: 's1', text, marks}],
})
const image = (_key: string, extra: Record<string, unknown> = {}) => ({
  _type: 'image',
  _key,
  asset: {_ref: `image-${_key}`},
  ...extra,
})
const asset = {_ref: 'image-cover'}
const longText = 'Words about the work. '.repeat(10).trim()

const project = {_id: 'drafts.p1', _type: 'project', _rev: 'r1', title: 'Alpha'}
const page = {_id: 'drafts.g1', _type: 'page', _rev: 'r1', title: 'About'}
const home = {_id: 'home', _type: 'home', _rev: 'r1', title: 'Home'}
const settings = {_id: 'settings', _type: 'settings', _rev: 'r1'}

describe('triggers', () => {
  it.each<[FunctionName, FunctionEvent['on'], boolean]>([
    ['describe-images', ['create', 'update'], true],
    ['generate-images', ['create', 'update'], true],
    ['auto-slug', ['create', 'update'], true],
    ['seo-overview', ['create', 'update'], true],
    ['auto-tag', ['create'], false],
    ['slug-redirects', ['update'], false],
    ['auto-showcase', ['create'], false],
  ])('%s runs on %j with drafts %s', (name, on, includeDrafts) => {
    expect(functionSpecs[name].event.on).toEqual(on)
    expect(functionSpecs[name].event.includeDrafts ?? false).toBe(includeDrafts)
  })
})

describe('describe-images', () => {
  it('targets a new cover image without alt', async () => {
    await expect(
      run('describe-images', {after: {...project, coverImage: {asset}}}),
    ).resolves.toEqual({_id: 'drafts.p1', title: 'Alpha', targets: [['coverImage', 'alt']]})
  })

  it('targets a replaced cover image', async () => {
    const before = {...project, coverImage: {asset: {_ref: 'image-old'}}}
    await expect(
      run('describe-images', {before, after: {...project, coverImage: {asset}}}),
    ).resolves.toMatchObject({targets: [['coverImage', 'alt']]})
  })

  it('targets image blocks inserted into the prose by key', async () => {
    const before = {...project, description: [block('Intro')]}
    const after = {
      ...project,
      description: [block('Intro'), image('i1'), image('i2', {alt: 'Described'})],
    }
    await expect(run('describe-images', {before, after})).resolves.toMatchObject({
      targets: [['description', {_key: 'i1'}, 'alt']],
    })
  })

  it('addresses page images under body', async () => {
    const before = {...page, body: [block('Intro')]}
    const after = {...page, body: [block('Intro'), image('i1')]}
    await expect(run('describe-images', {before, after})).resolves.toMatchObject({
      targets: [['body', {_key: 'i1'}, 'alt']],
    })
  })

  it('lists the cover before the prose images', async () => {
    const after = {...project, coverImage: {asset}, description: [image('i1'), image('i2')]}
    await expect(run('describe-images', {after})).resolves.toMatchObject({
      targets: [
        ['coverImage', 'alt'],
        ['description', {_key: 'i1'}, 'alt'],
        ['description', {_key: 'i2'}, 'alt'],
      ],
    })
  })

  it.each<[string, DocumentChange]>([
    [
      'every image has alt',
      {
        after: {
          ...project,
          coverImage: {asset, alt: 'Cover'},
          description: [image('i1', {alt: 'x'})],
        },
      },
    ],
    ['the cover has no image yet', {after: {...project, coverImage: {imagePrompt: 'A boat'}}}],
    [
      'only the title changed',
      {
        before: {...project, coverImage: {asset}},
        after: {...project, title: 'Beta', coverImage: {asset}},
      },
    ],
    [
      'text next to an image changed',
      {
        before: {...project, description: [block('Intro'), image('i1')]},
        after: {...project, description: [block('Intro, expanded'), image('i1')]},
      },
    ],
    [
      'the last missing alt was typed in',
      {
        before: {...project, description: [image('i1')]},
        after: {...project, description: [image('i1', {alt: 'Typed'})]},
      },
    ],
    ['the document is not a project or page', {after: {...settings, ogImage: {asset}}}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('describe-images', change)).resolves.toBeUndefined()
  })
})

describe('generate-images', () => {
  const prompt = 'A lighthouse at dusk'

  it('plans a cover on creation', async () => {
    await expect(
      run('generate-images', {after: {...project, coverImage: {imagePrompt: prompt}}}),
    ).resolves.toEqual({
      _id: 'drafts.p1',
      _type: 'project',
      _rev: 'r1',
      title: 'Alpha',
      overview: null,
      jobs: [{field: 'coverImage', kind: 'cover', prompt}],
    })
  })

  it('plans again when the prompt changes', async () => {
    const before = {...project, coverImage: {imagePrompt: 'A harbour'}}
    await expect(
      run('generate-images', {before, after: {...project, coverImage: {imagePrompt: prompt}}}),
    ).resolves.toMatchObject({jobs: [{field: 'coverImage', kind: 'cover', prompt}]})
  })

  it('plans again when the image was removed', async () => {
    const before = {...project, coverImage: {imagePrompt: prompt, asset}}
    await expect(
      run('generate-images', {before, after: {...project, coverImage: {imagePrompt: prompt}}}),
    ).resolves.toMatchObject({jobs: [{field: 'coverImage', kind: 'cover', prompt}]})
  })

  it('plans the Settings Open Graph image without a title or overview', async () => {
    await expect(
      run('generate-images', {after: {...settings, ogImage: {imagePrompt: prompt}}}),
    ).resolves.toEqual({
      _id: 'settings',
      _type: 'settings',
      _rev: 'r1',
      title: null,
      overview: null,
      jobs: [{field: 'ogImage', kind: 'og', prompt}],
    })
  })

  it('plans both images and passes the overview as text', async () => {
    const after = {
      ...page,
      overview: [block('A short summary.')],
      coverImage: {imagePrompt: 'Cover'},
      ogImage: {imagePrompt: 'Preview'},
    }
    await expect(run('generate-images', {after})).resolves.toMatchObject({
      overview: 'A short summary.',
      jobs: [
        {field: 'coverImage', kind: 'cover', prompt: 'Cover'},
        {field: 'ogImage', kind: 'og', prompt: 'Preview'},
      ],
    })
  })

  it.each<[string, DocumentChange]>([
    ['the image exists', {after: {...project, coverImage: {imagePrompt: prompt, asset}}}],
    [
      'an unrelated field changed while a generation is pending',
      {
        before: {...project, coverImage: {imagePrompt: prompt}},
        after: {...project, title: 'Beta', coverImage: {imagePrompt: prompt}},
      },
    ],
    [
      'the prompt was cleared',
      {
        before: {...project, coverImage: {imagePrompt: prompt}},
        after: {...project, coverImage: {}},
      },
    ],
    ['the document is the home page', {after: {...home, coverImage: {imagePrompt: prompt}}}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('generate-images', change)).resolves.toBeUndefined()
  })
})

describe('auto-slug', () => {
  it('matches a titled project without a slug', async () => {
    await expect(run('auto-slug', {after: project})).resolves.toEqual({
      _id: 'drafts.p1',
      _type: 'project',
      _rev: 'r1',
      title: 'Alpha',
    })
  })

  it('matches a page whose title just arrived', async () => {
    const before = {_id: 'drafts.g1', _type: 'page', _rev: 'r0'}
    await expect(run('auto-slug', {before, after: page})).resolves.toEqual({
      _id: 'drafts.g1',
      _type: 'page',
      _rev: 'r1',
      title: 'About',
    })
  })

  it.each<[string, DocumentChange]>([
    ['the slug exists', {after: {...project, slug: {current: 'alpha'}}}],
    ['there is no title', {after: {_id: 'drafts.p1', _type: 'project', _rev: 'r1'}}],
    ['the document has no slug field', {after: home}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('auto-slug', change)).resolves.toBeUndefined()
  })
})

describe('auto-tag', () => {
  const published = {_id: 'p1', _type: 'project', _rev: 'r1', description: [block(longText)]}

  it('matches a first publish with prose and no tags', async () => {
    await expect(run('auto-tag', {after: published})).resolves.toEqual({_id: 'p1', _rev: 'r1'})
  })

  it('treats an empty tag list like no tags', async () => {
    await expect(run('auto-tag', {after: {...published, tags: []}})).resolves.toEqual({
      _id: 'p1',
      _rev: 'r1',
    })
  })

  it.each<[string, DocumentChange]>([
    ['the editor chose tags', {after: {...published, tags: ['design']}}],
    ['there is no description', {after: {_id: 'p1', _type: 'project', _rev: 'r1'}}],
    ['the description is empty', {after: {...published, description: []}}],
    ['the document is a page', {after: {...page, body: [block(longText)]}}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('auto-tag', change)).resolves.toBeUndefined()
  })
})

describe('seo-overview', () => {
  it('matches new long prose without an overview', async () => {
    await expect(
      run('seo-overview', {after: {...project, description: [block(longText)]}}),
    ).resolves.toEqual({_id: 'drafts.p1', _type: 'project', _rev: 'r1'})
  })

  it.each<[string, unknown[]]>([
    ['an empty array', []],
    ['an empty block', [block('')]],
  ])('matches when the prose changes and the overview is %s', async (_, overview) => {
    const before = {...page, overview, body: [block(longText)]}
    const after = {...page, overview, body: [block(`${longText} More.`)]}
    await expect(run('seo-overview', {before, after})).resolves.toEqual({
      _id: 'drafts.g1',
      _type: 'page',
      _rev: 'r1',
    })
  })

  it('matches when prose is first added to an existing document', async () => {
    await expect(
      run('seo-overview', {before: project, after: {...project, description: [block(longText)]}}),
    ).resolves.toEqual({_id: 'drafts.p1', _type: 'project', _rev: 'r1'})
  })

  it.each<[string, DocumentChange]>([
    [
      'the overview has text',
      {after: {...project, overview: [block('Summary')], description: [block(longText)]}},
    ],
    ['the prose is short', {after: {...project, description: [block('Too short')]}}],
    [
      'only the title changed',
      {
        before: {...project, description: [block(longText)]},
        after: {...project, title: 'Beta', description: [block(longText)]},
      },
    ],
    [
      'only an image alt changed',
      {
        before: {...project, description: [block(longText), image('i1')]},
        after: {...project, description: [block(longText), image('i1', {alt: 'Typed'})]},
      },
    ],
    [
      'only a mark changed',
      {
        before: {...page, body: [block(longText)]},
        after: {...page, body: [block(longText, ['strong'])]},
      },
    ],
    ['the document is the home page', {after: {...home, description: [block(longText)]}}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('seo-overview', change)).resolves.toBeUndefined()
  })
})

describe('slug-redirects', () => {
  const published = {_id: 'p1', _type: 'project', _rev: 'r2', slug: {current: 'alpha'}}

  it('reports the slug the document had before', async () => {
    await expect(
      run('slug-redirects', {before: published, after: {...published, slug: {current: 'alpha-2'}}}),
    ).resolves.toEqual({_id: 'p1', _type: 'project', from: 'alpha'})
  })

  it.each<[string, DocumentChange]>([
    ['the document was created', {after: published}],
    ['the slug is unchanged', {before: published, after: {...published, title: 'Beta'}}],
    [
      'the slug is set for the first time',
      {before: {_id: 'p1', _type: 'project'}, after: published},
    ],
    ['the slug was removed', {before: published, after: {_id: 'p1', _type: 'project'}}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('slug-redirects', change)).resolves.toBeUndefined()
  })
})

describe('auto-showcase', () => {
  it('matches a project', async () => {
    await expect(run('auto-showcase', {after: {_id: 'p1', _type: 'project'}})).resolves.toEqual({
      _id: 'p1',
    })
  })

  it.each<[string, DocumentChange]>([
    ['the document is a page', {after: {_id: 'g1', _type: 'page'}}],
    ['the document is the home page', {after: home}],
  ])('does not match when %s', async (_, change) => {
    await expect(run('auto-showcase', change)).resolves.toBeUndefined()
  })
})
