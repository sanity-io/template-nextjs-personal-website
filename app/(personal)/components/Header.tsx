import { PortableText } from '@portabletext/react'
import React from 'react'
interface HeaderProps {
  title?: string
  description?: any[]
}
export function Header(props: HeaderProps) {
  return (
    <div>
      <div className="font-inter pb-5 text-5xl font-extrabold">
        {props.title}
      </div>
      <div className="pb-16 font-serif text-xl text-gray-600">
        <PortableText value={props.description} />
      </div>
    </div>
  )
}
