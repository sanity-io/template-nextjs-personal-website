import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Header } from 'components/shared/Header'
import ScrollUp from 'components/shared/ScrollUp'
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
      {/* Header */}
      <Header title={title} description={overview} />

      {/* Body */}
      {body && <PortableText components={components} value={body} />}

      {/* Workaround: scroll to top on route change */}
      <ScrollUp />
    </div>
  )
}
