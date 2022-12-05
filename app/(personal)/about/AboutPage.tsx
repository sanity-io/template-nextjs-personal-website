import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Page } from 'app/(personal)/queries'

import { Header } from '../components'
import { TimelineSection } from '../components/timeline/timeline-section'

interface AboutProps {
  page?: Page
}

export function AboutPage(props: AboutProps) {
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
      {<PortableText value={content} components={components} />}
    </div>
  )
}
