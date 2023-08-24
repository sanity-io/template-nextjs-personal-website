import {
  apiVersion,
  dataset,
  projectId,
  readToken,
  useCdn,
} from 'lib/sanity.api'
import { createClient, type SanityClient } from 'next-sanity'

export function getClient(previewDrafts?: boolean): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    // Passing the token early, in case the dataset is private
    token: readToken,
    perspective: 'published',
  })
  if (previewDrafts) {
    // If there is no token but draft mode has been enabled it's a sign that the app isn't fully configured yet
    if (!readToken) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      useCdn: false,
      perspective: 'previewDrafts',
    })
  }
  return client
}
