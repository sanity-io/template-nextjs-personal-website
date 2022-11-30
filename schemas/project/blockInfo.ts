import { defineField, defineType } from 'sanity'

export const blockInfo = defineType({
  name: 'blockInfo',
  title: 'Object Info',
  type: 'object',
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your info section.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      description: 'This field is the content of your info section.',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
