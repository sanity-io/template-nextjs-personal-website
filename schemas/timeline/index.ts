import { RestoreIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  type: 'document',
  name: 'timeline',
  title: 'Timeline',
  icon: RestoreIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
    }),
    defineField({
      type: 'array',
      name: 'events',
      title: 'Events',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'event',
          title: 'Event',
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
                  duration.start && new Date(duration.start).toISOString(),
                  duration.end && new Date(duration.end).toISOString(),
                ]
                  .filter(Boolean)
                  .join(' - '),
              }
            },
          },
        }),
      ],
    }),
  ],
})
