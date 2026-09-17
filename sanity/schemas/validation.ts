import type {CustomValidator} from 'sanity'

import {ptText} from '@/sanity/lib/portable-text'

export const maxPortableTextLength =
  (limit: number): CustomValidator<unknown[] | undefined> =>
  (blocks) =>
    ptText(blocks).length <= limit || `Keep it under ${limit} characters`
