import { PortableText } from '@portabletext/react'
import React from 'react'

interface HeaderProps {
  centered?: boolean
  description?: any[]
  title?: string
}
export function Header(props: HeaderProps) {
  const { title, description, centered = false } = props
  if (!description && !title) {
    return null
  }
  return (
    <div className={`${centered ? 'text-center' : 'w-3/5'}`}>
      {title && <div className="pb-5 text-5xl font-extrabold">{title}</div>}
      {description && (
        <div className="pb-16 font-serif text-xl text-gray-600">
          <PortableText value={description} />
        </div>
      )}
    </div>
  )
}
