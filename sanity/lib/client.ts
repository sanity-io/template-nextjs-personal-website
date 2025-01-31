import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      return props.filterDefault(props)
    },
  },
})

console.warn(
  'This template is using stega to embed Content Source Maps, see more information here: https://www.sanity.io/docs/loaders-and-overlays#26cf681fadd4',
)
