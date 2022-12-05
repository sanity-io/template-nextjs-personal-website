import { DocumentIcon, OlistIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { timelinePreview } from './timelinePreview'

export default defineType({
  type: 'document',
  name: 'page',
  title: 'Page',
  icon: DocumentIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
    }),

    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Overview',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
    defineField({
      type: 'array',
      name: 'content',
      title: 'Content',
      of: [
        defineArrayMember({
          type: 'block',
        }),
        defineField({
          name: 'timeline',
          icon: OlistIcon,
          title: 'Timeline',
          type: 'object',
          fields: [
            defineField({
              type: 'string',
              name: 'title',
              title: 'Title',
              description:
                "What is the name of this timeline? (e.g. 'Education')",
              validation: (rule) =>
                rule.required().warning('Should have a title'),
            }),
            defineField({
              type: 'array',
              name: 'body',
              title: 'Experience',
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
                          duration.start &&
                            new Date(duration.start).toISOString(),
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
          components: {
            preview: timelinePreview,
          },
          preview: {
            select: {
              title: 'title',
              body: 'body',
            },
            prepare({ title, body }) {
              return { title, body }
            },
          },
        }),
      ],
    }),
  ],
})
