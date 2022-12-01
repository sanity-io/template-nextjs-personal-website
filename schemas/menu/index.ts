import { MenuIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'menu',
  title: 'Menu header',
  type: 'document',
  icon: MenuIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'menuItems',
      title: 'Menu Item list',
      description:
        'This is a list of pages that will be displayed as a menu on the header of your personal website.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'page' }],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu Items',
      }
    },
  },
})
