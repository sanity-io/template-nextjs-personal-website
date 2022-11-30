import React from 'react'
interface HeaderProps {
  name: string
}
export function Header(props: HeaderProps) {
  return (
    <div className="m-10 text-center ">
      <div className="mb-4 text-2xl font-bold">{props.name}</div>
      <div className="text-gray-600">Description</div>
      <div className="text-xs text-gray-600">Follow me</div>
    </div>
  )
}
