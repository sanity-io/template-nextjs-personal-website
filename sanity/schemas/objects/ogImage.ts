import {defineType} from 'sanity'

import {imagePromptField} from '@/sanity/schemas/objects/imagePrompt'

export default defineType({
  name: 'ogImage',
  title: 'Open Graph image',
  type: 'image',
  description:
    'Shown when the page is shared on social media and in search results. 1200x630 crop.',
  options: {hotspot: true},
  fields: [imagePromptField],
})
