import {documentEventHandler} from '@sanity/functions'

import type {AutoSlugPayload} from '../lib/events'

export const handler = documentEventHandler<AutoSlugPayload>(({event}) => {
  console.log('auto-slug', event.data)
})
