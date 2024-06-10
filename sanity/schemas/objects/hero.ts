/**
 * This is the schema definition for the Hero section it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'cta'
 *  }
 */

import { ImageIcon } from '@sanity/icons'
import { defineField } from 'sanity'

const cta = {
  title: 'Hero',
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
}

export default cta
