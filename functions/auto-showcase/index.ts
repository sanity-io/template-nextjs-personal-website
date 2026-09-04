import {documentEventHandler} from '@sanity/functions'

import type {AutoShowcasePayload} from '../lib/events'

export const handler = documentEventHandler<AutoShowcasePayload>(({event}) => {
  console.log('auto-showcase', event.data)
})
