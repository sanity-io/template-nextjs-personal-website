import { defineField, defineType } from 'sanity'

export default defineType({
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      duration: 'duration',
      image: 'image',
      title: 'title',
    },
    prepare({ duration, image, title }) {
      return {
        media: image,
        subtitle: [
          duration?.start && new Date(duration.start).getFullYear(),
          duration?.end && new Date(duration.end).getFullYear(),
        ]
          .filter(Boolean)
          .join(' - '),
        title,
      }
    },
  },
})
