import {documentEventHandler} from '@sanity/functions'

import type {AutoTagPayload} from '../lib/events'

export const handler = documentEventHandler<AutoTagPayload>(({event}) => {
  console.log('auto-tag', event.data)
})
