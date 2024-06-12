/**
 * This is the schema definition for the text image section it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'textImage'
 *  }
 */

import { DocumentTextIcon, ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const textImage = defineType({
  title: 'Text image section',
  name: 'textImage',
  type: 'object',
  icon: DocumentTextIcon,
  preview: {
    select: {
      title: 'Text image section',
      image: 'image',
    },
    prepare({ title, image }) {
      return {
        title: title || 'Untitled',
        subtitle: 'Text image section',
        media: image || DocumentTextIcon,
      }
    },
  },
  fields: [
    defineField({
      name: 'hideImageMobile',
      title: 'Hide image on mobile devices',
      type: 'boolean',
    }),
    defineField({
      name: 'Image',
      icon: ImageIcon,
      title: 'image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'Left' },
          { title: 'Right', value: 'right' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
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

export default textImage
