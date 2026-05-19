import {createClient} from 'next-sanity'
import {dataset, projectId, studioUrl} from './api'

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2026-05-19',
  perspective: 'published',
  stega: {studioUrl},
})
