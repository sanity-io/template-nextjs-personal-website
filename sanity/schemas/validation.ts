import type {CustomValidator} from 'sanity'

import {portableTextToString} from '@/sanity/lib/portable-text'

export const maxPortableTextLength =
  (limit: number): CustomValidator<unknown[] | undefined> =>
  (blocks) =>
    portableTextToString(blocks).length <= limit || `Keep it under ${limit} characters`
