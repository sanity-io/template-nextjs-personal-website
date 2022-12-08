import { PortableText, PortableTextComponents } from '@portabletext/react'
import ImageBox from 'components/shared/ImageBox'
import { TimelineSection } from 'components/shared/TimelineSection'
import { Block } from 'sanity'

export function CustomPortableText({ value }: { value: Block[] }) {
  const components: PortableTextComponents = {
    marks: {
      link: ({ children, value }) => {
        console.log('value', value)
        return (
          <a
            className="underline transition hover:opacity-50"
            href={value?.href}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        )
      },
    },
    types: {
      image: ({ value }) => {
        return (
          <ImageBox
            image={value}
            alt={value.alt}
            classesWrapper="relative aspect-[16/9] my-6"
          />
        )
      },
      timeline: ({ value }) => {
        const { items } = value || {}
        return <TimelineSection timelines={items} />
      },
    },
  }

  return <PortableText components={components} value={value} />
}
