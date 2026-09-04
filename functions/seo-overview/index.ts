import {documentEventHandler} from '@sanity/functions'

import type {SeoOverviewPayload} from '../lib/events'

export const handler = documentEventHandler<SeoOverviewPayload>(({event}) => {
  console.log('seo-overview', event.data)
})
