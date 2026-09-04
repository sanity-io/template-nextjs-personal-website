import {defineField} from 'sanity'

export const imagePromptField = defineField({
  name: 'imagePrompt',
  title: 'Generate with AI',
  type: 'text',
  rows: 2,
  description:
    'Describe the picture you want and an image is generated for you. The title, overview and the image style from Settings are added automatically. Clear the image to generate a new one.',
})
