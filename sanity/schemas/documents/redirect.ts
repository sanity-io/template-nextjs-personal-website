import {ArrowRightIcon} from '@sanity/icons/ArrowRight'
import {defineField, defineType, type CustomValidator, type StringRule} from 'sanity'

import {apiVersion} from '@/sanity/lib/api'
import {sitePathPattern} from '@/sanity/lib/site-path'

const pathRules = (rule: StringRule) => [
  rule.required(),
  rule
    .regex(sitePathPattern)
    .error(
      'Must be a path on this site, starting with one slash and without query or fragment, for example /projects/old-slug',
    ),
]

const uniqueFrom: CustomValidator<string | undefined> = async (from, context) => {
  if (!from || !context.document) return true
  const id = context.document._id.replace(/^drafts\./, '')
  const others = await context
    .getClient({apiVersion})
    .fetch<number>('count(*[_type == "redirect" && from == $from && !(_id in $ids)])', {
      from,
      ids: [id, `drafts.${id}`],
    })
  return others === 0 || 'Another redirect already starts from this path'
}

const notSelf: CustomValidator<string | undefined> = (to, context) =>
  to === undefined || to !== context.document?.from || 'A redirect cannot point at itself'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
      description: 'Path that no longer exists, for example /projects/old-slug',
      validation: (rule) => [...pathRules(rule), rule.custom(uniqueFrom)],
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'string',
      description: 'Path that replaces it, for example /projects/new-slug',
      validation: (rule) => [...pathRules(rule), rule.custom(notSelf)],
    }),
  ],
  preview: {
    select: {from: 'from', to: 'to'},
    prepare: ({from, to}) => ({title: `${from} → ${to}`, subtitle: 'Redirect'}),
  },
})
