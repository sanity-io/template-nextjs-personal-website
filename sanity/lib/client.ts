import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
    // Uncomment below to see stega related diagnostics in the console
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      return props.filterDefault(props)
    },
  },
})
