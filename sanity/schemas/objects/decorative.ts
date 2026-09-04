import {defineField} from 'sanity'

export const decorativeField = defineField({
  name: 'decorative',
  title: 'Decorative',
  type: 'boolean',
  options: {layout: 'checkbox'},
  description:
    'For purely visual images. Screen readers skip the image and no alternative text is written for you.',
})
