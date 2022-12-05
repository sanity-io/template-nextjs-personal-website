import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'timeline',
  title: 'Timeline',
  type: 'object',
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const hasItems = items && items.length > 0
      const timelineNames =
        hasItems && items.map((timeline) => timeline.title).join(', ')

      return {
        title: 'Timelines',
        subtitle: hasItems
          ? `${timelineNames} (${items.length} items)`
          : 'No timelines',
      }
    },
  },
  fields: [
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule) => Rule.max(2),
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
                        subtitle: [
                          duration.start &&
                            new Date(duration.start).getFullYear(),
                          duration.end && new Date(duration.end).getFullYear(),
                        ]
                          .filter(Boolean)
                          .join(' - '),
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
