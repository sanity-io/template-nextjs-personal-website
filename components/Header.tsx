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
      {/* Title */}
      {title && (
        <div className="text-5xl font-extrabold tracking-tight">{title}</div>
      )}
      {/* Description */}
      {description && (
        <div className="mt-4 font-serif text-2xl text-gray-600">
          <PortableText value={description} />
        </div>
      )}
    </div>
  )
}
