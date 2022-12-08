import { PortableText, PortableTextComponents } from '@portabletext/react'

import type { PagePayload } from '../../types'
import { Header } from '../Header'
import { TimelineSection } from '../TimelineSection'

export function Page(props: { page: PagePayload }) {
  const { page } = props
  const { body, overview, title } = page

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
      {body && <PortableText value={body} components={components} />}
    </div>
  )
}
