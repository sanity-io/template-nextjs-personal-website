import {defineField} from 'sanity'

import {imagePromptField} from '@/sanity/schemas/objects/imagePrompt'

/**
 * Declared inline rather than as a named image type: a named type would store `_type: 'ogImage'`,
 * and the Open Graph image that already exists in Settings stores `_type: 'image'`.
 */
export const ogImageField = (description: string) =>
  defineField({
    name: 'ogImage',
    title: 'Open Graph image',
    type: 'image',
    description: `${description} Cropped to 1200x630.`,
    options: {hotspot: true},
    fields: [imagePromptField],
  })
