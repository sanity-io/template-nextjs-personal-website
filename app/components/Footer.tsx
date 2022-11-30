import { PortableText } from '@portabletext/react'
import { Settings } from 'app/queries'

export function Footer({ footer }: Settings) {
  return (
    <footer className="fixed bottom-0 w-full border-t-2 py-6 text-center">
      <PortableText value={footer} />
    </footer>
  )
}
