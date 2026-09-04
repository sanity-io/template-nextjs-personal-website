import type {GenerateImagesPayload, ImageJob} from '../lib/events'
import type {SiteContext} from './plan'

export const DEFAULT_STYLE =
  'clean editorial illustration, restrained palette, soft light, matte finish'

export type ImageInstructionParams = Record<'prompt' | 'title' | 'overview' | 'style', string>

const instructions: Record<ImageJob['kind'], string> = {
  cover:
    'Create the cover image for a portfolio project. Subject: $prompt. Context: the project is titled $title; $overview. Composition: landscape 16:9, one clear focal subject, generous negative space, no text, no letters, no logos, no watermarks, no borders. Style: $style.',
  og: 'Create an Open Graph preview image for a personal website page. Subject: $prompt. Context: $title; $overview. Composition: landscape 1.91:1, subject in the centre third so a 1200x630 crop keeps it, calm background, no text, no letters, no logos, no watermarks, no borders. Style: $style.',
}

export const imageInstruction = (kind: ImageJob['kind']) => instructions[kind]

/**
 * Plain string constants for the instruction template. Settings has no title or overview of its
 * own, so its Open Graph image is described through the home page.
 */
export function imageInstructionParams(
  job: ImageJob,
  doc: Pick<GenerateImagesPayload, '_type' | 'title' | 'overview'>,
  site: SiteContext,
): ImageInstructionParams {
  const subject = doc._type === 'settings' ? site.home : doc
  return {
    prompt: job.prompt,
    title: subject?.title ?? '',
    overview: subject?.overview ?? '',
    style: site.settings?.imageStyle?.trim() || DEFAULT_STYLE,
  }
}
