import {documentEventHandler} from '@sanity/functions'

import type {SlugRedirectsPayload} from '../lib/events'

export const handler = documentEventHandler<SlugRedirectsPayload>(({event}) => {
  console.log('slug-redirects', event.data)
})
