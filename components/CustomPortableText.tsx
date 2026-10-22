import type {PathSegment} from '@sanity/client/csm'
import {PortableText, type InferStrictComponents, type InferValue} from 'next-sanity'
import Link from 'next/link'

import ImageBox from '@/components/ImageBox'
import {TimelineSection} from '@/components/TimelineSection'
import type {Home, Page, Project, Settings} from '@/sanity.types'

/**
 * Every Portable Text field the site renders, taken from the schema document types. The `.groq`
 * modules declare nothing globally, so there is no `SanityQueries` registry to union over.
 */
type PortableTextValue = InferValue<Home | Page | Project | Settings>

export function CustomPortableText({
  id,
  type,
  path,
  paragraphClasses,
  value,
}: {
  id: string | null
  type: string | null
  path: PathSegment[]
  paragraphClasses?: string
  value: PortableTextValue
}) {
  const components = {
    block: {
      normal: ({children}) => {
        return <p className={paragraphClasses}>{children}</p>
      },
    },
    marks: {
      link: ({children, value: mark}) => {
        if (!mark?.href) return children

        return (
          <Link
            className="underline transition hover:opacity-50"
            href={mark.href}
            rel="noreferrer noopener"
          >
            {children}
          </Link>
        )
      },
    },
    types: {
      image: ({value: image}) => {
        return (
          <div className="my-6 space-y-2">
            <ImageBox image={image} alt={image.alt} classesWrapper="relative aspect-video" />
            {image?.caption && (
              <div className="font-sans text-sm text-gray-600">{image.caption}</div>
            )}
          </div>
        )
      },
      timeline: ({value: timeline}) => {
        const {items, _key} = timeline
        return (
          <TimelineSection
            key={_key}
            id={id}
            type={type}
            path={[...path, {_key}, 'items']}
            timelines={items}
          />
        )
      },
    },
  } satisfies InferStrictComponents<typeof value>

  return <PortableText components={components} value={value} />
}
