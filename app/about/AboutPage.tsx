import { PortableText } from '@portabletext/react'
import { Page } from 'app/queries'

interface AboutProps {
  page?: Page
}

export function AboutPage(props: AboutProps) {
  const name = props.page?.title
  const content = props.page?.content

  return (
    <div className="m-16">
      <div className="text-2xl font-extrabold">{name}</div>
      {/* <PortableText value={content} /> */}
    </div>
  )
}
