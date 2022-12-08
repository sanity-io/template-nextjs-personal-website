import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Header } from 'components/shared/Header'
import type { PagePayload } from 'types'

import { TimelineSection } from './TimelineSection'

export function Page({ data }: { data: PagePayload }) {
  // Default to an empty object to allow previews on non-existent documents
  const { body, overview, title } = data || {}

  const components: PortableTextComponents = {
    types: {
      timeline: ({ value }) => {
        const { items } = value || {}
        return <TimelineSection timelines={items} />
      },
    },
  }

  return (
    <div>
      <Header title={title} description={overview} />
      {body && <PortableText components={components} value={body} />}
    </div>
  )
}
