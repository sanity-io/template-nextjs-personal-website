import { ReactNode } from 'react'

export function PreviewWrapper({ children }: { children: ReactNode }) {
  return <div className="opacity-50">{children}</div>
}
