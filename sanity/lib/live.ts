import { defineLive } from 'next-sanity'

import { client } from './client'
import { token } from './token'

export const { SanityLive, sanityFetch } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
