import { UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'name',
      description: 'This field is your name!',
      title: 'Name',
      type: 'string',
      //initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Descriprion',
      type: 'array',
      //initialValue: demo.description,
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineType({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      type: 'array',
      name: 'work',
      title: 'Work Experience',
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
    defineField({
      type: 'array',
      name: 'educcation',
      title: 'Education',
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
