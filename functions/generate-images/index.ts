import {documentEventHandler} from '@sanity/functions'

import type {GenerateImagesPayload} from '../lib/events'

export const handler = documentEventHandler<GenerateImagesPayload>(({event}) => {
  console.log('generate-images', event.data)
})
