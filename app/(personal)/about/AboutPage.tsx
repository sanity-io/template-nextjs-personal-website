import { PortableText } from '@portabletext/react'

import { About } from './queries'
import { TimelineItem } from './timeline-item/timeline-item'

interface AboutProps {
  about: About
}

export function AboutPage({ about }: AboutProps) {
  const { overview, education: educationList, work: workList } = about

  return (
    <div>
      <div className="pb-5 text-5xl font-extrabold">About</div>
      <div className="w-3/5 font-serif text-xl text-gray-600">
        <PortableText value={overview} />
      </div>

      <div className="flex pt-16">
        {workList && (
          <div className="flex-1">
            <div className="text-l pb-5 font-bold">Work</div>
            {workList.map((work, index) => (
              <div key={index}>
                <TimelineItem
                  item={work}
                  isLast={workList.length - 1 === index}
                />
              </div>
            ))}
          </div>
        )}

        {educationList && (
          <div className="flex-1">
            <div className="text-l pb-5 font-bold">Education</div>
            {educationList &&
              educationList.map((education, index) => (
                <div key={index}>
                  <TimelineItem
                    item={education}
                    isLast={educationList.length - 1 === index}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
