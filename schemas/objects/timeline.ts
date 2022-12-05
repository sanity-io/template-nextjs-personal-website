import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  fields: [
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            {
              name: 'milestones',
              title: 'Milestones',
              type: 'array',
              of: [
                {
                  name: 'milestone',
                  title: 'Milestone',
                  type: 'object',
                  fields: [
                    defineField({
                      type: 'string',
                      name: 'title',
                      title: 'Title',
                    }),
                    defineField({
                      type: 'string',
                      name: 'description',
                      title: 'Description',
                    }),
                    defineField({
                      name: 'tags',
                      title: 'Tags',
                      type: 'array',
                      of: [{ type: 'string' }],
                      options: {
                        layout: 'tags',
                      },
                    }),
                    defineField({
                      type: 'duration',
                      name: 'duration',
                      title: 'Duration',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      duration: 'duration',
                    },
                    prepare({ title, duration }) {
                      return {
                        title,
                        subtitle:
                          '(Consider using date-fns to generate a readable range)',
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
