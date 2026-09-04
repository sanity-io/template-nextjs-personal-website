import {describe, expect, it} from 'vitest'

import type {ImageJob} from '../lib/events'
import {DEFAULT_STYLE, imageInstruction, imageInstructionParams} from './instruction'
import type {SiteContext} from './plan'

const cover: ImageJob = {field: 'coverImage', kind: 'cover', prompt: 'A lighthouse at dusk'}
const og: ImageJob = {field: 'ogImage', kind: 'og', prompt: 'A lighthouse seen from the sea'}
const project = {
  _type: 'project' as const,
  title: 'Keeper',
  overview: 'A small tool that keeps a lighthouse lit.',
}
const site: SiteContext = {
  settings: {_id: 'settings', imageStyle: 'woodcut, two inks', title: null, overview: null},
  home: {_id: 'home', imageStyle: null, title: 'Home', overview: 'Portfolio of a keeper.'},
}

describe('imageInstruction', () => {
  it.each<[ImageJob['kind'], string]>([
    ['cover', '16:9'],
    ['og', '1200x630'],
  ])('describes the %s composition', (kind, composition) => {
    expect(imageInstruction(kind)).toContain(composition)
  })

  it.each<ImageJob['kind']>(['cover', 'og'])(
    'uses exactly the variables the params provide for %s',
    (kind) => {
      const variables = new Set(imageInstruction(kind).match(/\$\w+/g))
      expect(variables).toEqual(new Set(['$prompt', '$title', '$overview', '$style']))
    },
  )
})

describe('imageInstructionParams', () => {
  it('describes a project through its own title and overview', () => {
    expect(imageInstructionParams(cover, project, site)).toEqual({
      prompt: cover.prompt,
      title: 'Keeper',
      overview: 'A small tool that keeps a lighthouse lit.',
      style: 'woodcut, two inks',
    })
  })

  it('falls back to the default style when Settings has none', () => {
    const blank: SiteContext = {
      settings: {_id: 'settings', imageStyle: '  ', title: null, overview: null},
      home: null,
    }
    expect(imageInstructionParams(og, project, blank).style).toBe(DEFAULT_STYLE)
    expect(imageInstructionParams(og, project, {settings: null, home: null}).style).toBe(
      DEFAULT_STYLE,
    )
  })

  it('sends empty strings for a document without title or overview', () => {
    const bare = {_type: 'page' as const, title: null, overview: null}
    expect(imageInstructionParams(og, bare, site)).toMatchObject({title: '', overview: ''})
  })
})
