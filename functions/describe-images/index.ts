import {documentEventHandler} from '@sanity/functions'

import type {DescribeImagesPayload} from '../lib/events'

export const handler = documentEventHandler<DescribeImagesPayload>(({event}) => {
  console.log('describe-images', event.data)
})
