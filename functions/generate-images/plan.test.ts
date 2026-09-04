import {describe, expect, it} from 'vitest'

import type {ImageJob} from '../lib/events'
import {imageInstructionParams} from './instruction'
import {
  planImageJobs,
  siteContext,
  withoutDraftJobs,
  type ImageFields,
  type SiteDocument,
} from './plan'

const cover: ImageJob = {field: 'coverImage', kind: 'cover', prompt: 'A lighthouse at dusk'}
const og: ImageJob = {field: 'ogImage', kind: 'og', prompt: 'A lighthouse seen from the sea'}
const pending = (prompt: string) => ({imagePrompt: prompt, asset: null})

describe('planImageJobs', () => {
  it('keeps jobs whose prompt is unchanged and whose image is still missing', () => {
    const fresh: ImageFields = {coverImage: pending(cover.prompt), ogImage: pending(og.prompt)}
    expect(planImageJobs([cover, og], fresh)).toEqual([cover, og])
  })

  it.each<[string, ImageFields]>([
    ['the prompt changed', {coverImage: pending('A harbour'), ogImage: null}],
    [
      'the image arrived',
      {coverImage: {imagePrompt: cover.prompt, asset: 'image-1'}, ogImage: null},
    ],
    ['the prompt was cleared', {coverImage: {imagePrompt: null, asset: null}, ogImage: null}],
    ['the field was removed', {coverImage: null, ogImage: null}],
  ])('drops a job when %s', (_, fresh) => {
    expect(planImageJobs([cover, og], fresh)).toEqual([])
  })

  it('judges each field on its own', () => {
    const fresh: ImageFields = {coverImage: pending('A harbour'), ogImage: pending(og.prompt)}
    expect(planImageJobs([cover, og], fresh)).toEqual([og])
  })
})

describe('withoutDraftJobs', () => {
  it('keeps every job when there is no draft', () => {
    expect(withoutDraftJobs([cover, og], null)).toEqual([cover, og])
  })

  it('drops the jobs the draft carries the same prompt for', () => {
    const draft: ImageFields = {coverImage: pending(cover.prompt), ogImage: pending('Other')}
    expect(withoutDraftJobs([cover, og], draft)).toEqual([og])
  })

  it('keeps a job whose field the draft does not have', () => {
    expect(withoutDraftJobs([cover], {coverImage: null, ogImage: null})).toEqual([cover])
  })
})

describe('siteContext', () => {
  const doc = (_id: string, extra: Partial<SiteDocument> = {}): SiteDocument => ({
    _id,
    imageStyle: null,
    title: null,
    overview: null,
    ...extra,
  })
  const settings = doc('settings', {imageStyle: 'published style'})
  const draftSettings = doc('drafts.settings', {imageStyle: 'draft style'})
  const home = doc('home', {title: 'Home', overview: 'Published overview'})
  const draftHome = doc('drafts.home', {title: 'Home (draft)', overview: 'Draft overview'})
  const all = [settings, draftSettings, home, draftHome]

  it('prefers the drafts for a draft document', () => {
    expect(siteContext(all, true)).toEqual({settings: draftSettings, home: draftHome})
  })

  it('prefers the published variants for a published document', () => {
    expect(siteContext(all, false)).toEqual({settings, home})
  })

  it('falls back to the other variant when the preferred one does not exist', () => {
    expect(siteContext([settings, draftHome], true)).toEqual({settings, home: draftHome})
    expect(siteContext([draftSettings, home], false)).toEqual({settings: draftSettings, home})
  })

  it('leaves a singleton null when neither variant exists', () => {
    expect(siteContext([], true)).toEqual({settings: null, home: null})
  })

  it('describes the Settings Open Graph image through the matching home variant', () => {
    const settingsDoc = {_type: 'settings' as const, title: null, overview: null}
    expect(imageInstructionParams(og, settingsDoc, siteContext(all, true))).toEqual({
      prompt: og.prompt,
      title: 'Home (draft)',
      overview: 'Draft overview',
      style: 'draft style',
    })
    expect(imageInstructionParams(og, settingsDoc, siteContext(all, false))).toMatchObject({
      title: 'Home',
      overview: 'Published overview',
      style: 'published style',
    })
  })
})
