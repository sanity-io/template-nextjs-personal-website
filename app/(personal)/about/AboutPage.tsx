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
      <div className="w-3/5">
        <Header title={title} description={overview} />
      </div>

      {<PortableText value={content} components={components} />}
    </div>
  )
}
