import { PortableText } from '@portabletext/react'
import React from 'react'
interface HeaderProps {
  title?: string
  description?: any[]
  centered?: boolean
}
export function Header(props: HeaderProps) {
  const { title, description, centered = false } = props
  return (
    <div className={`${centered ? 'text-center' : 'w-3/5'}`}>
      <div className="font-inter pb-5 text-5xl font-extrabold">{title}</div>
      <div className="pb-16 font-serif text-xl text-gray-600">
        <PortableText value={description} />
      </div>
    </div>
  )
}
