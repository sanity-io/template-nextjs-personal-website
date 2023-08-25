import { getClient } from 'lib/sanity.client'
import { LiveQueryProvider } from 'next-sanity/preview'

const client = getClient()

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string
}) {
  if (!token) throw new TypeError('Missing token')
  return (
    <LiveQueryProvider client={client} token={token} logger={console}>
      {children}
    </LiveQueryProvider>
  )
}
