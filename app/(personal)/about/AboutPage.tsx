import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Page } from 'app/(personal)/queries'

import { TimelineItem } from './timeline-item'

interface AboutProps {
  page?: Page
}

export function AboutPage(props: AboutProps) {
  const { page } = props
  const { title, overview, content } = page || {}

  const components: PortableTextComponents = {
    types: {
      timeline: ({ value }) => {
        const { title, body } = value || {}
        return (
          <div>
            <div className="text-l pb-5 font-bold">{title}</div>

            {body.map((experience, index) => (
              <div key={index}>
                <TimelineItem
                  item={experience}
                  isLast={body.length - 1 === index}
                />
              </div>
            ))}
          </div>
        )
      },
    },
  }

  return (
    <div>
      <div className="pb-5 text-5xl font-extrabold">{title}</div>
      <div className="w-3/5 pb-16 font-serif text-xl text-gray-600">
        <PortableText value={overview} />
      </div>

      {<PortableText value={content} components={components} />}
    </div>
  )
}
