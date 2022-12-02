import { PortableText } from '@portabletext/react'
import React from 'react'
interface HeaderProps {
  title?: string
  description?: any[]
}
export function Header(props: HeaderProps) {
  return (
    <div className="mb-10 text-center">
      <div className="font-inter mb-3 text-4xl font-extrabold">
        {props.title}
      </div>
      <div className="font-serif text-2xl text-gray-600">
        <PortableText value={props.description} />
      </div>
      <div className="font-inter text-sm text-gray-600">
        You can follow me on Twitter, Twitch, LinkedIn, and GitHub.
      </div>
    </div>
  )
}
