/**
 * This is the schema definition for the Button link.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'cta'
 *  }
 */

const cta = {
  title: 'CTA',
  name: 'cta',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    },
    {
      name: 'url',
      title: 'Url',
      type: 'string',
    },
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      initialValue: {
        title: 'Primary',
      },
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
        ],
      },
      validation: (rule) => rule.required(),
    },
  ],
}

export default cta
