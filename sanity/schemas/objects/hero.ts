/**
 * This is the schema definition for the Hero section it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'hero'
 *  }
 */

import { DocumentTextIcon, ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const cta = defineType({
  title: 'Hero section',
  name: 'hero',
  type: 'object',

  fields: [
    defineField({
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'mainHeadingBlockContent',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'cta',
    }),
    defineField({
      name: 'HeroImage',
      icon: ImageIcon,
      title: 'Hero image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      image: 'image',
    },
    prepare({ image }) {
      return {
        title: 'Hero section',
        media: image || DocumentTextIcon,
      }
    },
  },
})

export default cta
