/**
 * This is the schema definition for the text section it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'text'
 *  }
 */

import { DocumentTextIcon, ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const textContent = defineType({
  title: 'Text Content',
  name: 'textContent',
  type: 'object',
  icon: DocumentTextIcon,
  preview: {
    select: {
      title: 'heading',
      image: 'image',
    },
    prepare({ title, image }) {
      return {
        title: title || 'Untitled',
        subtitle: 'Text content',
        media: image || DocumentTextIcon,
      }
    },
  },
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'text',
      type: 'blockContent',
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'cta',
    }),
  ],
})

export default textContent
