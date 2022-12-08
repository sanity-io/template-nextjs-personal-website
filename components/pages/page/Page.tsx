import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Header } from 'components/shared/Header'
import ImageBox from 'components/shared/ImageBox'
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
      image: ({ value }) => {
        return (
          <ImageBox
            image={value}
            alt={value.alt}
            classesWrapper="relative aspect-[16/9]"
          />
        )
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
