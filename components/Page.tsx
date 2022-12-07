import { PortableText, PortableTextComponents } from '@portabletext/react'

import type { PagePayload } from '../types'
import { Header } from './Header'
import { TimelineSection } from './TimelineSection'

interface PageProps {
  page?: PagePayload
}

export function Page(props: PageProps) {
  const { page } = props
  const { title, overview, content } = page || {}

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
      <PortableText value={content} components={components} />
    </div>
  )
}
